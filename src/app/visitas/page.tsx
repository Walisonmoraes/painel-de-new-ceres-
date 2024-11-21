"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VisitasForm } from "@/components/visitas/form"
import { VisitasTable } from "@/components/visitas/table"

export default function VisitasPage() {
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Nova Visita</TabsTrigger>
          <TabsTrigger value="table">Relatório de Visitas</TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="space-y-4">
          <VisitasForm />
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          <VisitasTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
