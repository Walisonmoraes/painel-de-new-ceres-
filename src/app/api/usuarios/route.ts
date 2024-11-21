import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET() {
  try {
    // Buscar usuários da autenticação usando o cliente admin
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('Erro ao buscar usuários da autenticação:', authError)
      throw authError
    }

    // Buscar dados complementares da tabela usuarios
    const { data: dbUsers, error: dbError } = await supabaseAdmin
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error('Erro ao buscar usuários do banco:', dbError)
      throw dbError
    }

    if (!dbUsers) {
      console.log('Nenhum usuário encontrado no banco')
      return NextResponse.json([])
    }

    // Combinar os dados
    const combinedUsers = dbUsers.map(dbUser => {
      const authUser = authUsers.users.find(au => au.id === dbUser.id)
      return {
        ...dbUser,
        email: authUser?.email || dbUser.email
      }
    })

    return NextResponse.json(combinedUsers)
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error)
    return NextResponse.json(
      { error: 'Erro ao listar usuários. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { nome, email, senha, tipo } = await request.json()

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select()
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado.' },
        { status: 400 }
      )
    }

    // Criar usuário na autenticação
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true
    })

    if (authError) {
      throw authError
    }

    // Criar registro na tabela usuarios
    const { error: dbError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        nome,
        email,
        tipo,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ message: 'Usuário criado com sucesso!' })
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário não fornecido.' },
        { status: 400 }
      )
    }

    // Deletar usuário da autenticação
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
      throw authError
    }

    // Deletar registro da tabela usuarios
    const { error: dbError } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw dbError
    }

    return NextResponse.json({ message: 'Usuário deletado com sucesso!' })
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar usuário. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}
