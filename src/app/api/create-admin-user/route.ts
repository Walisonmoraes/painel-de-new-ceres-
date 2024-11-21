import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST() {
  try {
    // Criar usuário com admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@newceres.com',
      password: 'admin123',
      email_confirm: true,
    })

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // Criar entrada na tabela de colaboradores
    const { error: profileError } = await supabaseAdmin
      .from('colaboradores')
      .insert([
        {
          nome: 'Administrador',
          email: 'admin@newceres.com',
          cargo: 'Administrador',
          user_id: userData.user.id,
        },
      ])

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Usuário admin criado com sucesso',
      credentials: {
        email: 'admin@newceres.com',
        password: 'admin123'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
