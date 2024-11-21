-- Remover a tabela se ela existir
drop table if exists public.visitas_comerciais;

-- Criar a tabela de visitas comerciais
create table public.visitas_comerciais (
    id uuid default gen_random_uuid() primary key,
    empresa text not null,
    contato text not null,
    cargo text not null,
    telefone text not null,
    email text not null,
    interesse text not null,
    produtos text not null,
    proximo_contato date not null,
    observacoes text,
    fotos text[] default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices
create index visitas_comerciais_empresa_idx on public.visitas_comerciais(empresa);
create index visitas_comerciais_contato_idx on public.visitas_comerciais(contato);
create index visitas_comerciais_proximo_contato_idx on public.visitas_comerciais(proximo_contato);

-- Habilitar RLS
alter table public.visitas_comerciais enable row level security;

-- Criar políticas de segurança
create policy "Permitir select para usuários autenticados"
    on public.visitas_comerciais for select
    to authenticated
    using (true);

create policy "Permitir insert para usuários autenticados"
    on public.visitas_comerciais for insert
    to authenticated
    with check (true);

create policy "Permitir update para usuários autenticados"
    on public.visitas_comerciais for update
    to authenticated
    using (true)
    with check (true);

create policy "Permitir delete para usuários autenticados"
    on public.visitas_comerciais for delete
    to authenticated
    using (true);

-- Criar função para atualizar o updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Criar trigger para atualizar o updated_at
create trigger set_updated_at
    before update on public.visitas_comerciais
    for each row
    execute function public.handle_updated_at();
