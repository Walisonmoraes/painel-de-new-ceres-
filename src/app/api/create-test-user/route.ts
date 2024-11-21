import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.auth.signUp({
      email: 'teste@newceres.com',
      password: 'teste123',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Criar entrada na tabela de colaboradores
    const { error: profileError } = await supabase
      .from('colaboradores')
      .insert([
        {
          nome: 'Usuário Teste',
          email: 'teste@newceres.com',
          cargo: 'Teste',
          user_id: data.user?.id,
        },
      ])

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Usuário criado com sucesso',
      credentials: {
        email: 'teste@newceres.com',
        password: 'teste123'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
