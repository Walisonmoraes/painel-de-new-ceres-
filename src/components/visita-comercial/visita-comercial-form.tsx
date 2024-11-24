"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ImagePlus, Loader2, X } from "lucide-react"
import { useState } from "react"
import { createVisitaComercial } from "@/services/visita-comercial"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

export type VisitaComercialFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isLoading?: boolean;
}

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
  proximoContato: z.date({
    required_error: "Por favor selecione a data do próximo contato.",
  }),
  coordenacaoResponsavel: z.string().min(2, {
    message: "Por favor informe a coordenação responsável.",
  }),
  acompanhado: z.string({
    required_error: "Por favor indique se estava acompanhado.",
  }),
  nomeAcompanhante: z.string().optional().refine((val) => {
    if (form?.getValues("acompanhado") === "sim") {
      return val && val.length >= 2;
    }
    return true;
  }, {
    message: "Por favor informe o nome do acompanhante.",
  }),
  oQueFoiDiscutido: z.string().min(1, {
    message: "Por favor informe o que foi discutido.",
  }),
  porQueVisita: z.string().min(1, {
    message: "Por favor informe o motivo da visita.",
  }),
  ondeOcorreu: z.string().min(1, {
    message: "Por favor informe onde ocorreu a reunião.",
  }),
  horarioInicio: z.date({
    required_error: "Por favor selecione o horário de início.",
  }),
  horarioFim: z.date({
    required_error: "Por favor selecione o horário de fim.",
  }),
  participantes: z.string().min(1, {
    message: "Por favor informe quem participou.",
  }),
  comoConduzida: z.string().min(1, {
    message: "Por favor informe como foi conduzida a reunião.",
  }),
  pontosPositivos: z.string().min(1, {
    message: "Por favor liste os pontos positivos.",
  }),
  pontosNegativos: z.string().min(1, {
    message: "Por favor liste os pontos negativos.",
  }),
  oportunidadesMelhoria: z.string().min(1, {
    message: "Por favor liste as oportunidades de melhoria.",
  }),
  proximosPassos: z.string().min(1, {
    message: "Por favor informe os próximos passos.",
  }),
  responsaveis: z.string().min(1, {
    message: "Por favor informe os responsáveis.",
  }),
  prazos: z.string().min(1, {
    message: "Por favor informe os prazos.",
  }),
  data: z.date({
    required_error: "Por favor selecione a data da visita.",
  }),
})

const PRODUTOS_OPTIONS = [
  { value: "PORTO", label: "Porto" },
  { value: "TERMINAL", label: "Terminal" },
  { value: "CIF_ARM_FAZ", label: "CIF (Arm/Faz)" }
]

export function VisitaComercialForm({
  onSubmit,
  isLoading = false,
}: VisitaComercialFormProps) {
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
      proximoContato: undefined,
      coordenacaoResponsavel: "",
      acompanhado: "",
      nomeAcompanhante: "",
      oQueFoiDiscutido: "",
      porQueVisita: "",
      ondeOcorreu: "",
      horarioInicio: new Date(),
      horarioFim: new Date(),
      participantes: "",
      comoConduzida: "",
      pontosPositivos: "",
      pontosNegativos: "",
      oportunidadesMelhoria: "",
      proximosPassos: "",
      responsaveis: "",
      prazos: "",
      data: undefined,
    },
  })

  const watchAcompanhado = form.watch("acompanhado")

  const onSubmitForm = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      console.log('Valores do formulário:', data)
      
      // Validar se há fotos selecionadas
      if (fotos.length === 0) {
        toast.error("Por favor, selecione pelo menos uma foto")
        return
      }

      console.log('Iniciando chamada para API...')
      const response = await createVisitaComercial(data, fotos)
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
          Registro da visita 
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="p-6 space-y-6">
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
                  <FormLabel>Quem nos Recebeu </FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de quem nos recebeu" {...field} />
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
                    <Input placeholder="Cargo de quem nos recebeu" {...field} />
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
                  <FormLabel>Pontos de Interesse</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ponto de interesse" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proximoContato"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Próximo Contato</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordenacaoResponsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenação Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe a coordenação responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acompanhado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estava Acompanhado?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sim">Sim</SelectItem>
                      <SelectItem value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchAcompanhado === "sim" && (
              <FormField
                control={form.control}
                name="nomeAcompanhante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Acompanhante</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do acompanhante" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Relatório da Visita</h3>

            <div className="space-y-4">
              <h4 className="font-medium">1. Análise 5W2H</h4>
              
              <FormField
                control={form.control}
                name="oQueFoiDiscutido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O que foi discutido? (What)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os principais tópicos discutidos na reunião..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="porQueVisita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Por que esta visita foi realizada? (Why)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explique o objetivo e motivação desta visita..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ondeOcorreu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Onde ocorreu a reunião? (Where)</FormLabel>
                    <FormControl>
                      <Input placeholder="Local da reunião" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="horarioInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Início</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes));
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="horarioFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Fim</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ? format(field.value, "HH:mm") : ""}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":");
                            const date = new Date();
                            date.setHours(parseInt(hours), parseInt(minutes));
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="participantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quem participou? (Who)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste todos os participantes da reunião..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comoConduzida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como foi conduzida a reunião? (How)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva como a reunião foi conduzida, metodologia utilizada..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium">2. Análise de Pontos</h4>

              <FormField
                control={form.control}
                name="pontosPositivos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontos Positivos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os aspectos positivos identificados..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pontosNegativos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pontos Negativos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os pontos que precisam de atenção..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oportunidadesMelhoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oportunidades de Melhoria</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Sugestões para próximas interações..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium">3. Plano de Ação</h4>

              <FormField
                control={form.control}
                name="proximosPassos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximos Passos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste as ações que precisam ser tomadas..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsaveis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsáveis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Liste os responsáveis por cada ação..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prazos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Defina os prazos para cada ação..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Data da Visita</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !form.getValues("data") && "text-muted-foreground"
                      )}
                    >
                      {form.getValues("data") ? (
                        format(form.getValues("data"), "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.getValues("data")}
                    onSelect={(date) => form.setValue("data", date)}
                    disabled={(date) =>
                      date < new Date()
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </div>

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
