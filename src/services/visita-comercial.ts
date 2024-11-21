import { z } from "zod"

const visitaFormSchema = z.object({
  empresa: z.string().min(2),
  contato: z.string().min(2),
  cargo: z.string().min(2),
  telefone: z.string().min(10),
  email: z.string().email(),
  interesse: z.string(),
  produtos: z.string(),
  proximoContato: z.string().min(1),
  observacoes: z.string().optional(),
})

export type VisitaFormData = z.infer<typeof visitaFormSchema>

export async function createVisitaComercial(data: VisitaFormData, fotos: File[]) {
  try {
    console.log('Iniciando criação do FormData...')
    const formData = new FormData()

    // Adiciona os dados do formulário
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        console.log(`Adicionando campo ${key}:`, value)
        formData.append(key, value)
      }
    })

    // Adiciona as fotos
    fotos.forEach((foto, index) => {
      console.log(`Adicionando foto ${index}:`, foto.name)
      formData.append(`foto_${index}`, foto)
    })

    console.log('FormData criado, iniciando requisição...')
    const response = await fetch('/api/visita-comercial', {
      method: 'POST',
      body: formData,
    })

    console.log('Status da resposta:', response.status)
    const responseText = await response.text()
    console.log('Resposta em texto:', responseText)

    if (!response.ok) {
      let errorMessage = 'Erro ao registrar visita comercial'
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error || errorMessage
        console.error('Dados do erro:', errorData)
      } catch (e) {
        console.error('Erro ao parsear resposta:', e)
      }
      throw new Error(errorMessage)
    }

    try {
      const responseData = JSON.parse(responseText)
      console.log('Dados da resposta:', responseData)
      return responseData
    } catch (e) {
      console.error('Erro ao parsear resposta de sucesso:', e)
      throw new Error('Erro ao processar resposta do servidor')
    }
  } catch (error) {
    console.error('Erro detalhado ao registrar visita comercial:', error)
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message)
      console.error('Stack trace:', error.stack)
      throw error
    }
    throw new Error('Erro ao registrar visita comercial')
  }
}
