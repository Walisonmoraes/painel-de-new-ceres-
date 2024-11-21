import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erro no callback:', error)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/programacao', request.url))
  } catch (error) {
    console.error('Erro no callback:', error)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}