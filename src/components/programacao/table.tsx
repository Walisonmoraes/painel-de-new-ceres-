"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { FileSpreadsheet, Printer, Pencil, Trash } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { exportToExcel } from "@/lib/excel"
import { Database } from "@/lib/database.types"

type Programacao = Database["public"]["Tables"]["programacao"]["Row"]

export function ProgramacaoTable() {
  const [programacoes, setProgramacoes] = useState<Programacao[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchProgramacoes()
  }, [])

  async function fetchProgramacoes() {
    try {
      const { data, error } = await supabase
        .from("programacao")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao carregar programações:", error)
        toast.error("Erro ao carregar programações")
        return
      }

      setProgramacoes(data || [])
    } catch (error) {
      console.error("Erro ao carregar programações:", error)
      toast.error("Erro ao carregar programações")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from("programacao")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Erro ao deletar programação:", error)
        toast.error("Erro ao deletar programação")
        return
      }

      toast.success("Programação deletada com sucesso")
      fetchProgramacoes()
    } catch (error) {
      console.error("Erro ao deletar programação:", error)
      toast.error("Erro ao deletar programação")
    }
  }

  const handleExportToExcel = () => {
    const data = programacoes.map((prog) => ({
      Data: format(new Date(prog.data), "dd/MM/yyyy", { locale: ptBR }),
      Colaborador: prog.colaborador,
      Função: prog.funcao,
      "Ordem de Serviço": prog.ordem_servico,
      Cliente: prog.cliente,
      Tipo: prog.tipo,
      "Local/Região": prog.local_regiao,
      Origem: prog.origem,
      Produto: prog.produto,
      "OGM/Aflatoxina": prog.ogm_aflatoxina ? "Sim" : "Não",
      Destino: prog.destino,
      "Data de Criação": format(new Date(prog.created_at), "dd/MM/yyyy HH:mm", {
        locale: ptBR,
      }),
    }))

    exportToExcel(data, "programacao")
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Card>
    )
  }

  if (programacoes.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-32">
          <p className="text-muted-foreground">Nenhuma programação encontrada</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex justify-end space-x-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={handleExportToExcel}
        >
          <FileSpreadsheet className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Colaborador</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Local/Região</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>OGM/Aflatoxina</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programacoes.map((prog) => (
              <TableRow key={prog.id}>
                <TableCell>
                  {format(new Date(prog.data), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{prog.colaborador}</TableCell>
                <TableCell>{prog.funcao}</TableCell>
                <TableCell>{prog.ordem_servico}</TableCell>
                <TableCell>{prog.cliente}</TableCell>
                <TableCell>{prog.tipo}</TableCell>
                <TableCell>{prog.local_regiao}</TableCell>
                <TableCell>{prog.origem}</TableCell>
                <TableCell>{prog.produto}</TableCell>
                <TableCell>{prog.ogm_aflatoxina ? "Sim" : "Não"}</TableCell>
                <TableCell>{prog.destino}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(prog.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
