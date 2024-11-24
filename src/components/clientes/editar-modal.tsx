"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Cliente {
  id: string
  razao_social: string
  cnpj_cpf: string
  tipo_pessoa: string
  ie_rg: string
  email: string
  telefone: string
  celular: string
  cep: string
  estado: string
  cidade: string
  bairro: string
  tipo_bairro: string
  endereco: string
  tipo_endereco: string
  numero: string
  complemento: string
}

interface EditarModalProps {
  cliente: Cliente
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditarModal({ cliente, isOpen, onClose, onSuccess }: EditarModalProps) {
  const [formData, setFormData] = useState<Cliente>(cliente)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          razao_social: formData.razao_social,
          cnpj_cpf: formData.cnpj_cpf,
          tipo_pessoa: formData.tipo_pessoa,
          ie_rg: formData.ie_rg,
          email: formData.email,
          telefone: formData.telefone,
          celular: formData.celular,
          cep: formData.cep,
          estado: formData.estado,
          cidade: formData.cidade,
          bairro: formData.bairro,
          tipo_bairro: formData.tipo_bairro,
          endereco: formData.endereco,
          tipo_endereco: formData.tipo_endereco,
          numero: formData.numero,
          complemento: formData.complemento,
        })
        .eq("id", cliente.id)

      if (error) throw error

      toast.success("Cliente atualizado com sucesso!")
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error("Erro ao atualizar cliente:", error)
      toast.error("Erro ao atualizar cliente: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="razao_social">Razão Social / Nome</Label>
              <Input
                id="razao_social"
                value={formData.razao_social}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj_cpf">CNPJ / CPF</Label>
              <Input
                id="cnpj_cpf"
                value={formData.cnpj_cpf}
                onChange={(e) => setFormData({ ...formData, cnpj_cpf: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_pessoa">Tipo de Pessoa</Label>
              <Input
                id="tipo_pessoa"
                value={formData.tipo_pessoa}
                onChange={(e) => setFormData({ ...formData, tipo_pessoa: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ie_rg">IE / RG</Label>
              <Input
                id="ie_rg"
                value={formData.ie_rg || ""}
                onChange={(e) => setFormData({ ...formData, ie_rg: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone || ""}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                value={formData.celular || ""}
                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep || ""}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado || ""}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade || ""}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro || ""}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_bairro">Tipo do Bairro</Label>
              <Input
                id="tipo_bairro"
                value={formData.tipo_bairro || ""}
                onChange={(e) => setFormData({ ...formData, tipo_bairro: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco || ""}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_endereco">Tipo do Endereço</Label>
              <Input
                id="tipo_endereco"
                value={formData.tipo_endereco || ""}
                onChange={(e) => setFormData({ ...formData, tipo_endereco: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero || ""}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento || ""}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
