"use client"

import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export type Usuario = {
  id: string
  email: string
  nome: string
  tipo: "admin" | "operador" | "visualizador"
  created_at: string
}

interface UsuariosTableProps {
  usuarios: Usuario[]
  loading?: boolean
  onEdit: (usuario: Usuario) => void
  onDelete: (usuario: Usuario) => void
}

export function UsuariosTable({
  usuarios,
  loading,
  onEdit,
  onDelete,
}: UsuariosTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[250px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead className="w-[150px]">Tipo</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{usuario.nome}</TableCell>
                <TableCell className="text-muted-foreground">
                  {usuario.email}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      usuario.tipo === "admin"
                        ? "bg-red-50 text-red-700 ring-red-600/20"
                        : usuario.tipo === "operador"
                        ? "bg-blue-50 text-blue-700 ring-blue-700/10"
                        : "bg-green-50 text-green-700 ring-green-600/20"
                    }`}
                  >
                    {usuario.tipo === "admin"
                      ? "Administrador"
                      : usuario.tipo === "operador"
                      ? "Operador"
                      : "Visualizador"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem
                        onClick={() => onEdit(usuario)}
                        className="hover:bg-muted cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(usuario)}
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function UsuariosTableContainer() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setUsuarios(data || [])
    } catch (error: any) {
      toast.error("Erro ao carregar usuários: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (usuario: Usuario) => {
    console.log("Editar usuário:", usuario)
  }

  const handleDelete = (usuario: Usuario) => {
    console.log("Excluir usuário:", usuario)
  }

  return (
    <UsuariosTable
      usuarios={usuarios}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}
