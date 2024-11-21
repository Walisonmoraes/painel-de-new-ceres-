export interface Database {
  public: {
    Tables: {
      colaboradores: {
        Row: {
          id: string
          nome: string
          cargo: string
          departamento: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cargo: string
          departamento: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cargo?: string
          departamento?: string
          created_at?: string
        }
      }
      programacao: {
        Row: {
          id: string
          data: string
          colaborador: string
          funcao: string
          ordem_servico: string
          cliente: string
          tipo: string
          local_regiao: string
          origem: string
          produto: string
          ogm_aflatoxina: boolean
          destino: string
          created_at: string
        }
        Insert: {
          id?: string
          data: string
          colaborador: string
          funcao: string
          ordem_servico: string
          cliente: string
          tipo: string
          local_regiao: string
          origem: string
          produto: string
          ogm_aflatoxina?: boolean
          destino: string
          created_at?: string
        }
        Update: {
          id?: string
          data?: string
          colaborador?: string
          funcao?: string
          ordem_servico?: string
          cliente?: string
          tipo?: string
          local_regiao?: string
          origem?: string
          produto?: string
          ogm_aflatoxina?: boolean
          destino?: string
          created_at?: string
        }
      }
      visitas_comerciais: {
        Row: {
          id: string
          empresa: string
          contato: string
          cargo: string
          telefone: string
          email: string
          interesse: string
          produtos: string
          proximoContato: string
          observacoes?: string
          fotos: string[]
          created_at: string
        }
        Insert: {
          id?: string
          empresa: string
          contato: string
          cargo: string
          telefone: string
          email: string
          interesse: string
          produtos: string
          proximoContato: string
          observacoes?: string
          fotos?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          empresa?: string
          contato?: string
          cargo?: string
          telefone?: string
          email?: string
          interesse?: string
          produtos?: string
          proximoContato?: string
          observacoes?: string
          fotos?: string[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
