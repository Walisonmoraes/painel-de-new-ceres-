import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminAuthClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
}).auth.admin

export async function POST() {
  try {
    // Primeiro, vamos verificar se o usuário já existe
    const { data: existingUsers } = await adminAuthClient.listUsers({
      filter: `email.eq.admin@newceres.com`,
    })

    let userId

    if (existingUsers && existingUsers.users.length > 0) {
      // Se o usuário existe, vamos apenas atualizar a senha
      const user = existingUsers.users[0]
      userId = user.id

      await adminAuthClient.updateUserById(userId, {
        password: 'admin123',
        email_confirm: true,
      })
    } else {
      // Se não existe, vamos criar um novo usuário
      const { data, error } = await adminAuthClient.createUser({
        email: 'admin@newceres.com',
        password: 'admin123',
        email_confirm: true,
      })

      if (error) throw error
      userId = data.user.id
    }

    // Agora vamos verificar/criar o registro na tabela de colaboradores
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: existingColaborador } = await adminClient
      .from('colaboradores')
      .select()
      .eq('user_id', userId)
      .single()

    if (!existingColaborador) {
      const { error: insertError } = await adminClient
        .from('colaboradores')
        .insert([
          {
            nome: 'Administrador',
            email: 'admin@newceres.com',
            cargo: 'Administrador',
            user_id: userId,
          },
        ])

      if (insertError) throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário configurado com sucesso',
      credentials: {
        email: 'admin@newceres.com',
        password: 'admin123',
      },
    })
  } catch (error: any) {
    console.error('Erro ao configurar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
