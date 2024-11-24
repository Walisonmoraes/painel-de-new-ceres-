-- Create visitas_comerciais table
CREATE TABLE IF NOT EXISTS public.visitas_comerciais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa TEXT NOT NULL,
    contato TEXT NOT NULL,
    cargo TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    interesse TEXT,
    produtos TEXT,
    proximo_contato DATE,
    observacoes TEXT,
    fotos TEXT[], -- Array para armazenar URLs das fotos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) -- Referência ao usuário que criou a visita
);

-- Create storage bucket for fotos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('visitas-comerciais', 'visitas-comerciais', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies
ALTER TABLE public.visitas_comerciais ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT
CREATE POLICY "Enable read access for authenticated users" ON public.visitas_comerciais
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy para INSERT
CREATE POLICY "Enable insert access for authenticated users" ON public.visitas_comerciais
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy para UPDATE
CREATE POLICY "Enable update access for own visitas" ON public.visitas_comerciais
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy para DELETE
CREATE POLICY "Enable delete access for own visitas" ON public.visitas_comerciais
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS visitas_comerciais_empresa_idx ON public.visitas_comerciais (empresa);
CREATE INDEX IF NOT EXISTS visitas_comerciais_contato_idx ON public.visitas_comerciais (contato);
CREATE INDEX IF NOT EXISTS visitas_comerciais_proximo_contato_idx ON public.visitas_comerciais (proximo_contato);
CREATE INDEX IF NOT EXISTS visitas_comerciais_user_id_idx ON public.visitas_comerciais (user_id);

-- Create storage policies
CREATE POLICY "Enable public read access" ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'visitas-comerciais');

CREATE POLICY "Enable authenticated insert access" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'visitas-comerciais');

CREATE POLICY "Enable authenticated delete access" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'visitas-comerciais' AND auth.uid() = owner);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_visitas_comerciais_updated_at
    BEFORE UPDATE ON public.visitas_comerciais
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
