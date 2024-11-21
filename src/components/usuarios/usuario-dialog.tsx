"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"

interface Usuario {
  id: string
  nome: string
  email: string
  tipo: string
  created_at: string
}

interface UsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (usuario: Omit<Usuario, "id" | "created_at">) => void
  usuario?: Usuario | null
}

export function UsuarioDialog({
  open,
  onOpenChange,
  onSave,
  usuario,
}: UsuarioDialogProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<
    Omit<Usuario, "id" | "created_at"> & { senha?: string }
  >({
    defaultValues: {
      nome: "",
      email: "",
      tipo: "",
      senha: "",
    },
  })

  const tipoValue = watch("tipo")

  useEffect(() => {
    if (usuario) {
      reset({
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      })
    } else {
      reset({
        nome: "",
        email: "",
        tipo: "",
        senha: "",
      })
    }
  }, [usuario, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {usuario ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              {...register("nome", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true })}
            />
          </div>

          {!usuario && (
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                {...register("senha", { required: !usuario })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Usuário</Label>
            <Select
              onValueChange={(value) => setValue("tipo", value)}
              value={tipoValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
                <SelectItem value="visualizador">Visualizador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
