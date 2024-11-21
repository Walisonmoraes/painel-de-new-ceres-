"use client"

import { useState } from "react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileSpreadsheet, Printer } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { DateRange } from "react-day-picker"
import { exportToExcel } from "@/lib/excel"

type RelatorioTipo = "visitas" | "programacao"

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
  created_at: string
}

interface Programacao {
  id: string
  data: string
  colaborador: string
  funcao: string
  ordem_servico: string
  cliente: string
  tipo: string
  local_regiao: string
  origem: string
  produto: string
  destino: string
  created_at: string
}

export default function RelatoriosPage() {
  const [tipo, setTipo] = useState<RelatorioTipo>("visitas")
  const [date, setDate] = useState<DateRange | undefined>()
  const [dados, setDados] = useState<Visita[] | Programacao[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient()

  async function buscarDados() {
    if (!date?.from || !date?.to) {
      toast.error("Selecione um período para buscar os dados")
      return
    }

    setLoading(true)
    try {
      const dataInicial = format(date.from, "yyyy-MM-dd")
      const dataFinal = format(date.to, "yyyy-MM-dd")

      if (tipo === "visitas") {
        const { data, error } = await supabase
          .from("visitas_comerciais")
          .select("*")
          .gte("created_at", dataInicial)
          .lte("created_at", dataFinal)
          .order("created_at", { ascending: false })

        if (error) throw error
        setDados(data || [])
      } else {
        const { data, error } = await supabase
          .from("programacao")
          .select("*")
          .gte("created_at", dataInicial)
          .lte("created_at", dataFinal)
          .order("created_at", { ascending: false })

        if (error) throw error
        setDados(data || [])
      }

      toast.success("Dados carregados com sucesso!")
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast.error("Erro ao buscar dados")
    } finally {
      setLoading(false)
    }
  }

  function exportarExcel() {
    if (tipo === "visitas") {
      const columns = [
        { header: "Data", key: "created_at", width: 15 },
        { header: "Empresa", key: "empresa", width: 30 },
        { header: "Contato", key: "contato", width: 20 },
        { header: "Cargo", key: "cargo", width: 20 },
        { header: "Interesse", key: "interesse", width: 30 },
        { header: "Produtos", key: "produtos", width: 30 },
        { header: "Próximo Contato", key: "proximo_contato", width: 15 },
      ]

      const formattedData = dados.map((item) => ({
        ...item,
        created_at: format(new Date(item.created_at), "dd/MM/yyyy", {
          locale: ptBR,
        }),
      }))

      exportToExcel(formattedData, columns, "relatorio-visitas")
    } else {
      const columns = [
        { header: "Data", key: "created_at", width: 15 },
        { header: "Colaborador", key: "colaborador", width: 25 },
        { header: "Função", key: "funcao", width: 20 },
        { header: "OS", key: "ordem_servico", width: 15 },
        { header: "Cliente", key: "cliente", width: 30 },
        { header: "Local/Região", key: "local_regiao", width: 25 },
        { header: "Produto", key: "produto", width: 25 },
        { header: "Destino", key: "destino", width: 25 },
      ]

      const formattedData = dados.map((item) => ({
        ...item,
        created_at: format(new Date(item.created_at), "dd/MM/yyyy", {
          locale: ptBR,
        }),
      }))

      exportToExcel(formattedData, columns, "relatorio-programacao")
    }
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">
          Gere relatórios de visitas comerciais e programação
        </p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select
              value={tipo}
              onValueChange={(value) => setTipo(value as RelatorioTipo)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitas">Visitas Comerciais</SelectItem>
                <SelectItem value="programacao">Programação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <DatePickerWithRange date={date} onDateChange={setDate} />
          </div>

          <div className="flex items-end space-x-2">
            <Button
              onClick={buscarDados}
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>
      </Card>

      {dados.length > 0 && (
        <Card>
          <div className="p-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={exportarExcel}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" onClick={imprimir}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  {tipo === "visitas" ? (
                    <>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Interesse</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Próximo Contato</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Local/Região</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Destino</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {format(new Date(item.created_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    {tipo === "visitas" ? (
                      <>
                        <TableCell>{(item as Visita).empresa}</TableCell>
                        <TableCell>{(item as Visita).contato}</TableCell>
                        <TableCell>{(item as Visita).cargo}</TableCell>
                        <TableCell>{(item as Visita).interesse}</TableCell>
                        <TableCell>{(item as Visita).produtos}</TableCell>
                        <TableCell>{(item as Visita).proximo_contato}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{(item as Programacao).colaborador}</TableCell>
                        <TableCell>{(item as Programacao).funcao}</TableCell>
                        <TableCell>{(item as Programacao).ordem_servico}</TableCell>
                        <TableCell>{(item as Programacao).cliente}</TableCell>
                        <TableCell>{(item as Programacao).local_regiao}</TableCell>
                        <TableCell>{(item as Programacao).produto}</TableCell>
                        <TableCell>{(item as Programacao).destino}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}
