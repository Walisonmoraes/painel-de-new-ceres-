export interface Colaborador {
  id: string
  nome: string
  email: string
  senha?: string // Opcional, usado apenas no frontend
  cargo: string
  departamento: string
  created_at: string
  auth_id?: string
}
