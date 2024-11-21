-- Primeiro, vamos inserir um usuário de teste na tabela usuarios
INSERT INTO usuarios (id, nome, tipo, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Administrador', 'admin', CURRENT_TIMESTAMP);

-- Garantir que o usuário tenha as permissões necessárias
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir que usuários autenticados vejam todos os usuários
CREATE POLICY "Permitir select para usuários autenticados"
ON usuarios FOR SELECT
TO authenticated
USING (true);
