-- Add new columns to clientes table
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT NOT NULL DEFAULT 'juridica',
ADD COLUMN IF NOT EXISTS ie_rg TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT;
