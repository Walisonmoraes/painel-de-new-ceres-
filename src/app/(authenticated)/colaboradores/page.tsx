import { Colaboradores } from "@/components/colaboradores/colaboradores"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ColaboradoresPage() {
  return (
    <div className="container mx-auto py-6 max-w-[1200px]">
      <Colaboradores />
    </div>
  )
}
