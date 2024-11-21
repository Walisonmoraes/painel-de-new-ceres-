import { Usuarios } from "@/components/usuarios/usuarios"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function UsuariosPage() {
  return (
    <div className="container mx-auto py-6 max-w-[1200px]">
      <Usuarios />
    </div>
  )
}
