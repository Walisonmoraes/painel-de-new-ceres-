"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VisitaComercialForm } from "@/components/visita-comercial/visita-comercial-form"
import { CadastroVisitaModal } from "@/components/visitas/cadastro-modal"

export default function VisitaComercialPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visita Comercial</h1>
        <CadastroVisitaModal />
      </div>

      <div dir="ltr" data-orientation="horizontal">
        <Tabs defaultValue="form">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="form">Nova Visita</TabsTrigger>
            <TabsTrigger value="table">Relatório de Visitas</TabsTrigger>
          </TabsList>
          <TabsContent value="form" className="mt-4">
            <VisitaComercialForm />
          </TabsContent>
          <TabsContent value="table" className="mt-4">
            <div className="bg-card rounded-lg shadow p-6">
              <p className="text-muted-foreground">Nenhuma visita comercial registrada.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
