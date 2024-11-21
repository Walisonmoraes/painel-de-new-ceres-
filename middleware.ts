import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/login', '/signup', '/auth/callback']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não estiver autenticado e não for uma rota pública, redireciona para o login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se estiver autenticado e estiver em uma rota pública, redireciona para a programação
  if (session && isPublicRoute) {
    const programacaoUrl = new URL('/programacao', request.url)
    return NextResponse.redirect(programacaoUrl)
  }

  // Se estiver na raiz, redireciona para a programação
  if (request.nextUrl.pathname === '/') {
    const programacaoUrl = new URL('/programacao', request.url)
    return NextResponse.redirect(programacaoUrl)
  }

  return res
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto assets estáticos
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
