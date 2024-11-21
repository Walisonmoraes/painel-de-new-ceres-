'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erro de autenticação:', error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Erro de autenticação</h2>
      <p className="text-muted-foreground">
        Ocorreu um erro durante o processo de autenticação.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          variant="outline"
        >
          Tentar novamente
        </Button>
        <Button asChild>
          <Link href="/auth/login">Voltar ao login</Link>
        </Button>
      </div>
    </div>
  )
}
