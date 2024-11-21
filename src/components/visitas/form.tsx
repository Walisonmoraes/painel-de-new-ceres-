"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FormData {
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
}

const initialFormData: FormData = {
  empresa: "",
  contato: "",
  cargo: "",
  telefone: "",
  email: "",
  interesse: "",
  produtos: "",
  proximo_contato: "",
  observacoes: "",
  fotos: []
}

export function VisitasForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const router = useRouter()
  const supabase = createBrowserClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Verificar autenticação
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session) {
        console.error("Erro de autenticação:", authError)
        toast.error("Sessão expirada. Por favor, faça login novamente.")
        router.push("/login")
        return
      }

      // Validar campos obrigatórios
      if (!formData.empresa || !formData.contato || !formData.cargo || 
          !formData.telefone || !formData.email || !formData.interesse || 
          !formData.produtos || !formData.proximo_contato) {
        toast.error("Por favor, preencha todos os campos obrigatórios")
        return
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error("Por favor, insira um email válido")
        return
      }

      // Validar formato do telefone (aceita (99) 99999-9999 ou 99999999999)
      const telefoneRegex = /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/
      const telefoneNumerico = formData.telefone.replace(/\D/g, "")
      if (!telefoneRegex.test(formData.telefone) && telefoneNumerico.length !== 11) {
        toast.error("Por favor, insira um telefone válido")
        return
      }

      // Formatar a data para o formato do banco
      const formattedData = new Date(formData.proximo_contato).toISOString()

      const { error: insertError } = await supabase
        .from("visitas_comerciais")
        .insert([{
          ...formData,
          proximo_contato: formattedData
        }])

      if (insertError) {
        console.error("Erro detalhado ao salvar visita:", insertError)
        if (insertError.code === "42501") { // Erro de permissão
          toast.error("Você não tem permissão para salvar visitas")
        } else if (insertError.code === "23505") { // Violação de chave única
          toast.error("Esta visita já foi cadastrada")
        } else {
          toast.error(`Erro ao salvar visita: ${insertError.message}`)
        }
        return
      }

      toast.success("Visita salva com sucesso!")
      setFormData(initialFormData)
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar visita:", error)
      toast.error("Erro ao salvar visita. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function handleChange(field: keyof FormData, value: string | string[]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Formatar telefone enquanto digita
  function formatTelefone(value: string) {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      let formatted = numbers
      if (numbers.length > 2) {
        formatted = `(${numbers.slice(0,2)}) ${numbers.slice(2)}`
      }
      if (numbers.length > 7) {
        formatted = formatted.slice(0,10) + "-" + formatted.slice(10)
      }
      return formatted
    }
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Visita Comercial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input 
                type="text" 
                id="empresa"
                placeholder="Nome da empresa"
                value={formData.empresa}
                onChange={e => handleChange("empresa", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Input 
                type="text" 
                id="contato"
                placeholder="Nome do contato"
                value={formData.contato}
                onChange={e => handleChange("contato", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input 
                type="text" 
                id="cargo"
                placeholder="Cargo do contato"
                value={formData.cargo}
                onChange={e => handleChange("cargo", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                type="tel" 
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={e => handleChange("telefone", formatTelefone(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                type="email" 
                id="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interesse">Interesse</Label>
              <Input 
                type="text" 
                id="interesse"
                placeholder="Interesse do cliente"
                value={formData.interesse}
                onChange={e => handleChange("interesse", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="produtos">Produtos</Label>
              <Input 
                type="text" 
                id="produtos"
                placeholder="Produtos de interesse"
                value={formData.produtos}
                onChange={e => handleChange("produtos", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proximo_contato">Próximo Contato</Label>
              <Input 
                type="date" 
                id="proximo_contato"
                value={formData.proximo_contato}
                onChange={e => handleChange("proximo_contato", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2 col-span-full">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes"
                placeholder="Observações adicionais"
                value={formData.observacoes}
                onChange={e => handleChange("observacoes", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
