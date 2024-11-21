"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { UsuarioDialog } from "./usuario-dialog"
import { UsuariosTable, Usuario } from "./usuarios-table"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export function Usuarios() {
  const [open, setOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/usuarios')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setUsuarios(data)
    } catch (error: any) {
      toast.error("Erro ao carregar usuários: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      usuario.nome.toLowerCase().includes(searchLower) ||
      usuario.email.toLowerCase().includes(searchLower) ||
      usuario.tipo.toLowerCase().includes(searchLower)
    )
  })

  async function handleSave(usuario: Omit<Usuario, "id" | "created_at">) {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar usuário')
      }

      toast.success(selectedUsuario ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!")
      await fetchUsuarios()
      setOpen(false)
      setSelectedUsuario(null)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function handleDelete(usuario: Usuario) {
    try {
      const response = await fetch(`/api/usuarios?id=${usuario.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir usuário')
      }

      toast.success("Usuário excluído com sucesso!")
      await fetchUsuarios()
    } catch (error: any) {
      toast.error("Erro ao excluir usuário: " + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gerencie os usuários do sistema e suas permissões
        </p>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex justify-end">
        <div className="relative w-[250px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <UsuariosTable
        usuarios={filteredUsuarios}
        loading={loading}
        onEdit={(usuario) => {
          setSelectedUsuario(usuario)
          setOpen(true)
        }}
        onDelete={handleDelete}
      />

      <UsuarioDialog
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
        usuario={selectedUsuario}
      />
    </div>
  )
}
