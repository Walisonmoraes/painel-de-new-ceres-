"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CadastroModal } from "@/components/clientes/cadastro-modal"
import { toast } from "sonner"

interface Cliente {
  id: string
  razao_social: string
  cnpj_cpf: string
  email: string
  telefone: string
  cidade: string
  estado: string
  celular: string
  bairro: string
  tipo_bairro: string
  endereco: string
  tipo_endereco: string
  numero: string
  complemento: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCadastroModal, setShowCadastroModal] = useState(false)
  const supabase = createBrowserClient()

  async function carregarClientes() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("clientes")
        .select()
        .order("razao_social", { ascending: true })

      if (error) {
        console.error("Erro ao carregar clientes:", error.message)
        toast.error("Erro ao carregar a lista de clientes")
        return
      }

      setClientes(data || [])
    } catch (error) {
      console.error("Erro inesperado:", error)
      toast.error("Erro ao carregar a lista de clientes")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setShowCadastroModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Carregando lista de clientes...
        </div>
      ) : clientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <p className="text-center">Nenhum cliente cadastrado.</p>
          <p className="text-center text-sm">Clique em "Cadastrar Cliente" para adicionar um novo cliente.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{cliente.razao_social}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>CNPJ/CPF:</strong> {cliente.cnpj_cpf}</p>
                  <p><strong>E-mail:</strong> {cliente.email}</p>
                  <p><strong>Telefone:</strong> {cliente.telefone}</p>
                  <p><strong>Celular:</strong> {cliente.celular}</p>
                  <p><strong>Endereço:</strong> {cliente.tipo_endereco} {cliente.endereco}, {cliente.numero}</p>
                  <p><strong>Bairro:</strong> {cliente.tipo_bairro} {cliente.bairro}</p>
                  <p><strong>Localização:</strong> {cliente.cidade}/{cliente.estado}</p>
                  {cliente.complemento && (
                    <p><strong>Complemento:</strong> {cliente.complemento}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CadastroModal 
        open={showCadastroModal} 
        onOpenChange={setShowCadastroModal}
        onSuccess={() => {
          setShowCadastroModal(false)
          carregarClientes()
        }}
      />
    </div>
  )
}
