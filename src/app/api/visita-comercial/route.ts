import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

// Schema para validação dos dados
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

// Tipo para os dados da visita
type VisitaComercial = z.infer<typeof visitaFormSchema> & {
  fotos: string[]
  created_at: string
}

export async function POST(request: Request) {
  try {
    console.log('Iniciando processamento da requisição...')

    // Criar cliente Supabase
    console.log('Criando cliente Supabase...')
    const supabase = createServerSupabaseClient()
    console.log('Cliente Supabase criado')

    // Verificar autenticação
    console.log('Verificando sessão...')
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.error('Usuário não autenticado')
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    console.log('Usuário autenticado:', session.user.email)

    // Obter dados do formulário
    console.log('Obtendo dados do formulário...')
    const formData = await request.formData()
    console.log('FormData recebido')
    
    if (!formData) {
      console.error('Nenhum dado recebido')
      return NextResponse.json(
        { error: 'Nenhum dado recebido' },
        { status: 400 }
      )
    }

    // Extrair e logar os campos do formulário
    const campos = Array.from(formData.entries()).map(([key, value]) => ({
      key,
      type: value instanceof File ? 'File' : typeof value,
      value: value instanceof File ? `${value.name} (${value.size} bytes)` : value
    }))
    console.log('Campos recebidos:', JSON.stringify(campos, null, 2))
    
    // Extrair dados do formulário
    const data = {
      empresa: formData.get('empresa')?.toString() || '',
      contato: formData.get('contato')?.toString() || '',
      cargo: formData.get('cargo')?.toString() || '',
      telefone: formData.get('telefone')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      interesse: formData.get('interesse')?.toString() || '',
      produtos: formData.get('produtos')?.toString() || '',
      proximoContato: formData.get('proximoContato')?.toString() || '',
      observacoes: formData.get('observacoes')?.toString() || '',
    }

    console.log('Dados extraídos:', JSON.stringify(data, null, 2))

    // Validar dados
    try {
      console.log('Validando dados...')
      visitaFormSchema.parse(data)
      console.log('Dados validados com sucesso')
    } catch (error) {
      console.error('Erro na validação dos dados:', error)
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Dados inválidos', details: error.errors },
          { status: 400 }
        )
      }
      throw error
    }

    // Verificar se há fotos no formulário
    console.log('Verificando fotos...')
    const fotos = Array.from(formData.entries())
      .filter(([key, value]) => key.startsWith('foto_') && value instanceof File)
      .map(([_, value]) => value as File)

    console.log(`Total de fotos encontradas: ${fotos.length}`)

    if (fotos.length === 0) {
      console.error('Nenhuma foto encontrada')
      return NextResponse.json(
        { error: 'É necessário enviar pelo menos uma foto' },
        { status: 400 }
      )
    }

    // Upload das fotos
    console.log('Iniciando upload das fotos...')
    const fotosUrls: string[] = []
    for (const foto of fotos) {
      try {
        console.log('Processando foto:', foto.name)
        console.log('Tamanho:', foto.size, 'bytes')
        console.log('Tipo:', foto.type)

        const buffer = await foto.arrayBuffer()
        const fileName = `${Date.now()}-${foto.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `visitas-comerciais/${fileName}`

        console.log('Iniciando upload para:', filePath)

        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from('visitas')
          .upload(filePath, buffer, {
            contentType: foto.type,
            duplex: 'half',
            upsert: false
          })

        if (uploadError) {
          console.error('Erro detalhado do upload:', uploadError)
          throw new Error(`Erro no upload: ${uploadError.message}`)
        }

        console.log('Upload concluído:', uploadData)

        const { data: urlData } = supabase
          .storage
          .from('visitas')
          .getPublicUrl(filePath)

        fotosUrls.push(urlData.publicUrl)
        console.log('URL pública gerada:', urlData.publicUrl)
      } catch (error) {
        console.error('Erro detalhado ao processar foto:', error)
        return NextResponse.json(
          { error: `Erro ao processar foto ${foto.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
          { status: 500 }
        )
      }
    }

    // Preparar dados para salvar
    const visitaData: VisitaComercial = {
      ...data,
      fotos: fotosUrls,
      created_at: new Date().toISOString()
    }

    console.log('Dados preparados para salvar:', JSON.stringify(visitaData, null, 2))

    // Salvar no banco
    console.log('Salvando dados no banco...')
    const { error: dbError, data: dbData } = await supabase
      .from('visitas_comerciais')
      .insert([visitaData])
      .select()
      .single()

    if (dbError) {
      console.error('Erro detalhado ao salvar no banco:', dbError)
      return NextResponse.json(
        { 
          error: 'Erro ao salvar visita no banco de dados',
          details: dbError.message,
          code: dbError.code 
        },
        { status: 500 }
      )
    }

    console.log('Dados salvos com sucesso:', dbData)

    return NextResponse.json({
      message: 'Visita comercial registrada com sucesso',
      data: dbData,
    })
  } catch (error: any) {
    console.error('Erro geral ao registrar visita comercial:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao registrar visita comercial',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
