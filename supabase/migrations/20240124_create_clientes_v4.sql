/* Remover políticas existentes */
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.clientes;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.clientes;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.clientes;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.clientes;

/* Remover trigger existente */
DROP TRIGGER IF EXISTS handle_clientes_updated_at ON public.clientes;

/* Remover tabela existente */
DROP TABLE IF EXISTS public.clientes CASCADE;

/* Criar tabela de clientes */
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    razao_social TEXT NOT NULL,
    cnpj_cpf TEXT NOT NULL,
    tipo_pessoa TEXT NOT NULL DEFAULT 'juridica',
    ie_rg TEXT,
    email TEXT,
    telefone TEXT,
    celular TEXT,
    cep TEXT,
    estado TEXT,
    cidade TEXT,
    bairro TEXT,
    tipo_bairro TEXT,
    endereco TEXT,
    tipo_endereco TEXT,
    numero TEXT,
    complemento TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

/* Habilitar RLS */
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

/* Criar políticas de acesso */
CREATE POLICY "Enable read access for authenticated users" ON public.clientes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON public.clientes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON public.clientes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON public.clientes
    FOR DELETE
    TO authenticated
    USING (true);

/* Criar índices */
CREATE INDEX IF NOT EXISTS clientes_razao_social_idx ON public.clientes (razao_social);
CREATE INDEX IF NOT EXISTS clientes_cnpj_cpf_idx ON public.clientes (cnpj_cpf);

/* Criar trigger para updated_at usando a função existente */
CREATE TRIGGER handle_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
