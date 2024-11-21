"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { ColaboradorDialog } from "./colaborador-dialog"
import { ColaboradoresTable } from "./colaboradores-table"
import { ColaboradoresTableSkeleton } from "./colaboradores-table-skeleton"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export type Colaborador = {
  id: string
  nome: string
  email: string
  cargo: string
  created_at: string
}

export function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null)

  useEffect(() => {
    loadColaboradores()
  }, [])

  const loadColaboradores = async () => {
    try {
      const response = await fetch("/api/colaboradores")
      if (!response.ok) {
        throw new Error("Erro ao carregar colaboradores")
      }
      const data = await response.json()
      setColaboradores(data)
    } catch (error) {
      toast.error("Erro ao carregar colaboradores")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredColaboradores = colaboradores.filter((colaborador) =>
    colaborador.nome?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function handleSave(colaborador: Omit<Colaborador, "id" | "created_at">) {
    try {
      const response = await fetch('/api/colaboradores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colaborador),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar colaborador')
      }

      toast.success(selectedColaborador ? "Colaborador atualizado com sucesso!" : "Colaborador criado com sucesso!")
      await loadColaboradores()
      setOpen(false)
      setSelectedColaborador(null)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function handleDelete(colaborador: Colaborador) {
    try {
      const response = await fetch(`/api/colaboradores?id=${colaborador.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir colaborador')
      }

      toast.success("Colaborador excluído com sucesso!")
      await loadColaboradores()
    } catch (error: any) {
      toast.error("Erro ao excluir colaborador: " + error.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground">
            Gerencie os colaboradores da empresa
          </p>
        </div>
        <div className="space-y-2">
          <Button onClick={() => setOpen(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Novo Colaborador
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar colaborador..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <ColaboradoresTableSkeleton />
      ) : (
        <ColaboradoresTable 
          colaboradores={filteredColaboradores} 
          onRefresh={loadColaboradores} 
          onEdit={(colaborador) => {
            setSelectedColaborador(colaborador)
            setOpen(true)
          }}
          onDelete={handleDelete}
        />
      )}
      <ColaboradorDialog
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
        colaborador={selectedColaborador}
      />
    </div>
  )
}
