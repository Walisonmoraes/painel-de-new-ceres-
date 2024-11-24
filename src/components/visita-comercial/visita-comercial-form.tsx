"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ImagePlus, Loader2, X } from "lucide-react"
import { useState } from "react"
import { createVisitaComercial } from "@/services/visita-comercial"

const formSchema = z.object({
  empresa: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  contato: z.string().min(2, {
    message: "Nome do contato deve ter pelo menos 2 caracteres.",
  }),
  cargo: z.string().min(2, {
    message: "Cargo deve ter pelo menos 2 caracteres.",
  }),
  telefone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  interesse: z.string({
    required_error: "Por favor selecione o nível de interesse.",
  }),
  produtos: z.string({
    required_error: "Por favor selecione o produto de interesse.",
  }),
  proximoContato: z.string().min(1, {
    message: "Por favor informe a data do próximo contato.",
  }),
  observacoes: z.string().optional(),
})

const PRODUTOS_OPTIONS = [
  { value: "FOB", label: "FOB" },
  { value: "CIF", label: "CIF" },
  { value: "RECEBIMENTO_PORTUARIO", label: "RECEBIMENTO PORTUÁRIO" },
]

export function VisitaComercialForm() {
  const [fotos, setFotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: "",
      contato: "",
      cargo: "",
      telefone: "",
      email: "",
      interesse: "",
      produtos: "",
      proximoContato: "",
      observacoes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return

    try {
      setLoading(true)
      console.log('Valores do formulário:', values)
      
      // Validar se há fotos selecionadas
      if (fotos.length === 0) {
        toast.error("Por favor, selecione pelo menos uma foto")
        return
      }

      console.log('Iniciando chamada para API...')
      const response = await createVisitaComercial(values, fotos)
      console.log('Resposta da API:', response)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      toast.success("Visita comercial registrada com sucesso!")
      form.reset()
      setFotos([])
    } catch (error) {
      console.error('Erro detalhado ao registrar visita:', error)
      if (error instanceof Error) {
        console.error('Mensagem de erro:', error.message)
        console.error('Stack trace:', error.stack)
        toast.error(error.message)
      } else {
        console.error('Erro desconhecido:', error)
        toast.error("Erro ao registrar visita comercial")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        // Verificar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} é muito grande. Tamanho máximo: 5MB`)
          return false
        }
        
        // Verificar tipo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Arquivo ${file.name} não é uma imagem válida. Formatos aceitos: JPG, JPEG, PNG`)
          return false
        }

        // Verificar nome do arquivo
        if (file.name.match(/[^a-zA-Z0-9.-]/g)) {
          const newName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          toast.warning(`O nome do arquivo "${file.name}" contém caracteres especiais e será renomeado para "${newName}"`)
        }
        
        return true
      })

      if (validFiles.length > 0) {
        setFotos(prev => [...prev, ...validFiles])
        toast.success(`${validFiles.length} foto(s) adicionada(s) com sucesso`)
      }
    }
  }

  const removeFoto = (index: number) => {
    setFotos(prev => {
      const newFotos = prev.filter((_, i) => i !== index)
      toast.success('Foto removida com sucesso')
      return newFotos
    })
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Nova Visita Comercial</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Registre os detalhes da visita comercial
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Cargo do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interesse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Interesse</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de interesse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="baixo">Baixo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="produtos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produtos de Interesse</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto de interesse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUTOS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecione o tipo de produto de interesse.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximoContato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximo Contato</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações adicionais sobre a visita"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>Fotos</FormLabel>
              <div className="mt-2">
                <label htmlFor="fotos" className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ImagePlus className="h-5 w-5" />
                    <span>Adicionar fotos</span>
                  </div>
                  <Input
                    id="fotos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            {fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(index)}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={loading}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrar Visita
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
