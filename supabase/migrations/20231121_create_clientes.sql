-- Create the clientes table
create table if not exists public.clientes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tipo_pessoa text not null,
  razao_social text not null,
  cnpj_cpf text not null unique,
  ie_rg text,
  email text,
  telefone text,
  celular text,
  cep text,
  estado text,
  cidade text,
  tipo_bairro text,
  bairro text,
  tipo_endereco text,
  endereco text,
  numero text,
  complemento text
);

-- Create an index on razao_social for faster ordering
create index if not exists clientes_razao_social_idx on public.clientes (razao_social);

-- Enable RLS
alter table public.clientes enable row level security;

-- Create policy to allow all authenticated users to view all records
create policy "Allow authenticated users to view all clientes"
  on public.clientes for select
  to authenticated
  using (true);

-- Create policy to allow authenticated users to insert their own records
create policy "Allow authenticated users to insert clientes"
  on public.clientes for insert
  to authenticated
  with check (true);

-- Grant access to authenticated users
grant select, insert on public.clientes to authenticated;
