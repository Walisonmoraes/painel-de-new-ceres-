import { ProgramacaoForm } from "@/components/programacao/form"
import { ProgramacaoTable } from "@/components/programacao/table"

export default function ProgramacaoPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programação de Embarque</h1>
        <p className="text-muted-foreground">
          Gerencie a programação de embarques e acompanhe as atividades.
        </p>
      </div>
      <ProgramacaoForm />
      <ProgramacaoTable />
    </div>
  )
}
