"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"

interface Colaborador {
  id: string
  nome: string
  cargo: string
  departamento: string
}

interface FormData {
  data: Date | string
  colaborador: string
  funcao: string
  ordem_servico: string
  cliente: string
  tipo: string
  local_regiao: string
  origem: string
  produto: string
  ogm_aflatoxina: boolean
  destino: string
}

const initialFormData: FormData = {
  data: "",
  colaborador: "",
  funcao: "",
  ordem_servico: "",
  cliente: "",
  tipo: "",
  local_regiao: "",
  origem: "",
  produto: "",
  ogm_aflatoxina: false,
  destino: "",
}

export function ProgramacaoForm() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchColaboradores()
  }, [])

  async function fetchColaboradores() {
    try {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("nome")

      if (error) {
        console.error("Erro ao carregar colaboradores:", error)
        toast.error("Erro ao carregar colaboradores")
        return
      }
      setColaboradores(data || [])
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error)
      toast.error("Erro ao carregar colaboradores")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Validar campos obrigatórios
      if (!formData.data || !formData.colaborador || !formData.funcao || !formData.ordem_servico || 
          !formData.cliente || !formData.tipo || !formData.local_regiao || !formData.origem || 
          !formData.produto || !formData.destino) {
        toast.error("Por favor, preencha todos os campos obrigatórios")
        return
      }

      // Formatar a data para o formato do banco
      const formattedData = formData.data instanceof Date 
        ? formData.data.toISOString()
        : new Date(formData.data).toISOString()

      const { error } = await supabase
        .from("programacao")
        .insert([{
          ...formData,
          data: formattedData
        }])

      if (error) {
        console.error("Erro detalhado ao salvar programação:", error)
        toast.error(`Erro ao salvar programação: ${error.message}`)
        return
      }

      toast.success("Programação salva com sucesso!")
      setFormData(initialFormData)
      // Recarregar a tabela
      window.location.reload()
    } catch (error) {
      console.error("Erro ao salvar programação:", error)
      toast.error("Erro ao salvar programação")
    } finally {
      setSaving(false)
    }
  }

  function handleChange(field: keyof FormData, value: string | boolean | Date) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Programação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !formData.data && "text-muted-foreground"
                    )}
                  >
                    {formData.data ? (
                      format(
                        formData.data instanceof Date ? formData.data : new Date(formData.data),
                        "PPP",
                        { locale: ptBR }
                      )
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.data instanceof Date ? formData.data : undefined}
                    onSelect={(date) => handleChange("data", date as Date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="colaborador">Colaborador</Label>
              <Select
                value={formData.colaborador}
                onValueChange={value => handleChange("colaborador", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Carregando..." : "Selecione um colaborador"} />
                </SelectTrigger>
                <SelectContent>
                  {colaboradores.map((colaborador) => (
                    <SelectItem key={colaborador.id} value={colaborador.nome}>
                      {colaborador.nome} - {colaborador.cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funcao">Função</Label>
              <Select
                value={formData.funcao}
                onValueChange={value => handleChange("funcao", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorista">Motorista</SelectItem>
                  <SelectItem value="ajudante">Ajudante</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem de Serviço</Label>
              <Input 
                type="text" 
                id="ordem" 
                placeholder="Digite a ordem de serviço"
                value={formData.ordem_servico}
                onChange={e => handleChange("ordem_servico", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input 
                type="text" 
                id="cliente" 
                placeholder="Digite o nome do cliente"
                value={formData.cliente}
                onChange={e => handleChange("cliente", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={value => handleChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coleta">Coleta</SelectItem>
                  <SelectItem value="entrega">Entrega</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="inspecao">Inspeção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local/Região</Label>
              <Input 
                type="text" 
                id="local" 
                placeholder="Digite o local ou região"
                value={formData.local_regiao}
                onChange={e => handleChange("local_regiao", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input 
                type="text" 
                id="origem" 
                placeholder="Digite a origem"
                value={formData.origem}
                onChange={e => handleChange("origem", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Input 
                type="text" 
                id="produto" 
                placeholder="Digite o produto"
                value={formData.produto}
                onChange={e => handleChange("produto", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogm">OGM/Aflatoxina</Label>
              <Select
                value={formData.ogm_aflatoxina ? "sim" : "nao"}
                onValueChange={value => handleChange("ogm_aflatoxina", value === "sim")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input 
                type="text" 
                id="destino" 
                placeholder="Digite o destino"
                value={formData.destino}
                onChange={e => handleChange("destino", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
