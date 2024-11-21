"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import * as XLSX from "xlsx"

interface Visita {
  id: string
  empresa: string
  contato: string
  cargo: string
  telefone: string
  email: string
  interesse: string
  produtos: string
  proximo_contato: string
  observacoes?: string
  fotos: string[]
  created_at: string
}

export function VisitasTable() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchVisitas()
  }, [])

  async function fetchVisitas() {
    try {
      let query = supabase
        .from("visitas_comerciais")
        .select("*")
        .order("created_at", { ascending: false })

      if (searchTerm) {
        query = query.or(`empresa.ilike.%${searchTerm}%,contato.ilike.%${searchTerm}%,produtos.ilike.%${searchTerm}%`)
      }

      if (startDate && endDate) {
        query = query.gte("proximo_contato", startDate).lte("proximo_contato", endDate)
      }

      const { data, error } = await query

      if (error) {
        console.error("Erro ao carregar visitas:", error)
        toast.error("Erro ao carregar visitas")
        return
      }

      setVisitas(data || [])
    } catch (error) {
      console.error("Erro ao carregar visitas:", error)
      toast.error("Erro ao carregar visitas")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta visita?")) return

    try {
      const { error } = await supabase
        .from("visitas_comerciais")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("Erro ao excluir visita:", error)
        toast.error("Erro ao excluir visita")
        return
      }

      toast.success("Visita excluída com sucesso!")
      fetchVisitas()
    } catch (error) {
      console.error("Erro ao excluir visita:", error)
      toast.error("Erro ao excluir visita")
    }
  }

  function handleExport() {
    try {
      const exportData = visitas.map(visita => ({
        Empresa: visita.empresa,
        Contato: visita.contato,
        Cargo: visita.cargo,
        Telefone: visita.telefone,
        Email: visita.email,
        Interesse: visita.interesse,
        Produtos: visita.produtos,
        "Próximo Contato": format(new Date(visita.proximo_contato), "dd/MM/yyyy"),
        Observações: visita.observacoes || "",
        "Data de Criação": format(new Date(visita.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Visitas")
      XLSX.writeFile(wb, `visitas_${format(new Date(), "dd-MM-yyyy")}.xlsx`)

      toast.success("Relatório exportado com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar relatório:", error)
      toast.error("Erro ao exportar relatório")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visitas Comerciais</CardTitle>
        <Button onClick={handleExport}>Exportar</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por empresa, contato ou produtos"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyUp={e => e.key === "Enter" && fetchVisitas()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Interesse</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Próximo Contato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : visitas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma visita encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  visitas.map((visita) => (
                    <TableRow key={visita.id}>
                      <TableCell>{visita.empresa}</TableCell>
                      <TableCell>{visita.contato}</TableCell>
                      <TableCell>{visita.telefone}</TableCell>
                      <TableCell>{visita.interesse}</TableCell>
                      <TableCell>{visita.produtos}</TableCell>
                      <TableCell>
                        {format(new Date(visita.proximo_contato), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(visita.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
