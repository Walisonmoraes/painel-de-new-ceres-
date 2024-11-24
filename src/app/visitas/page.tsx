"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VisitasForm } from "@/components/visitas/form"
import { VisitasTable } from "@/components/visitas/table"
import { CadastroVisitaModal } from "@/components/visitas/cadastro-modal";

export default function VisitasPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visitas Comerciais</h1>
        <CadastroVisitaModal />
      </div>
      
      {/* Lista de visitas será adicionada aqui */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Nenhuma visita comercial registrada.</p>
      </div>
    </div>
  );
}
