import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Página não encontrada</h2>
      <p className="text-muted-foreground">
        A página de autenticação que você está procurando não existe.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Voltar ao início</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/login">Ir para login</Link>
        </Button>
      </div>
    </div>
  )
}
