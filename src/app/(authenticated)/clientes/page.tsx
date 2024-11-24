"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CadastroModal } from "@/components/clientes/cadastro-modal"
import { EditarModal } from "@/components/clientes/editar-modal"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  tipo_pessoa: string
  ie_rg: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCadastroModal, setShowCadastroModal] = useState(false)
  const [showEditarModal, setShowEditarModal] = useState(false)
  const [showExcluirDialog, setShowExcluirDialog] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const supabase = createBrowserClient()

  async function carregarClientes() {
    try {
      setIsLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error("Você precisa estar autenticado para acessar esta página")
        return
      }

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

  async function handleExcluir() {
    if (!selectedCliente) return

    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", selectedCliente.id)

      if (error) throw error

      toast.success("Cliente excluído com sucesso!")
      carregarClientes()
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error)
      toast.error("Erro ao excluir cliente: " + error.message)
    } finally {
      setShowExcluirDialog(false)
      setSelectedCliente(null)
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setShowCadastroModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">
          Carregando lista de clientes...
        </div>
      ) : clientes.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Nenhum cliente cadastrado.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  {cliente.razao_social}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCliente(cliente)
                      setShowEditarModal(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCliente(cliente)
                      setShowExcluirDialog(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p><strong>CNPJ/CPF:</strong> {cliente.cnpj_cpf}</p>
                  {cliente.email && <p><strong>Email:</strong> {cliente.email}</p>}
                  {cliente.telefone && <p><strong>Telefone:</strong> {cliente.telefone}</p>}
                  {cliente.cidade && <p><strong>Cidade:</strong> {cliente.cidade} - {cliente.estado}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CadastroModal
        isOpen={showCadastroModal}
        onClose={() => setShowCadastroModal(false)}
        onSuccess={() => {
          setShowCadastroModal(false)
          carregarClientes()
        }}
      />

      {selectedCliente && (
        <EditarModal
          cliente={selectedCliente}
          isOpen={showEditarModal}
          onClose={() => {
            setShowEditarModal(false)
            setSelectedCliente(null)
          }}
          onSuccess={() => {
            setShowEditarModal(false)
            setSelectedCliente(null)
            carregarClientes()
          }}
        />
      )}

      <AlertDialog open={showExcluirDialog} onOpenChange={setShowExcluirDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{selectedCliente?.razao_social}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowExcluirDialog(false)
              setSelectedCliente(null)
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleExcluir}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
