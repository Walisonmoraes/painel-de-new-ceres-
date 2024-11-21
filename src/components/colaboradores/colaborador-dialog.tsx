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
import { useForm } from "react-hook-form"
import type { Colaborador } from "./colaboradores"

interface ColaboradorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (colaborador: Omit<Colaborador, "id" | "created_at" | "senha">) => void
  colaborador?: Colaborador | null
}

export function ColaboradorDialog({
  open,
  onOpenChange,
  onSave,
  colaborador,
}: ColaboradorDialogProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<
    Omit<Colaborador, "id" | "created_at" | "senha">
  >({
    defaultValues: {
      nome: "",
      email: "",
      cargo: "",
      departamento: "",
    },
  })

  useEffect(() => {
    if (colaborador) {
      reset({
        nome: colaborador.nome,
        email: colaborador.email,
        cargo: colaborador.cargo,
        departamento: colaborador.departamento,
      })
    } else {
      reset({
        nome: "",
        email: "",
        cargo: "",
        departamento: "",
      })
    }
  }, [colaborador, reset])

  async function onSubmit(data: Omit<Colaborador, "id" | "created_at" | "senha">) {
    await onSave(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {colaborador ? "Editar Colaborador" : "Novo Colaborador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              required
              {...register("nome", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              required
              {...register("cargo", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              required
              {...register("departamento", { required: true })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : colaborador ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
