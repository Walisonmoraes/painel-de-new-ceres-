-- Habilitar RLS na tabela programacao
alter table public.programacao enable row level security;

-- Política para permitir SELECT para usuários autenticados
create policy "Permitir select para usuários autenticados"
    on public.programacao for select
    to authenticated
    using (true);

-- Política para permitir INSERT para usuários autenticados
create policy "Permitir insert para usuários autenticados"
    on public.programacao for insert
    to authenticated
    with check (true);

-- Política para permitir UPDATE para usuários autenticados
create policy "Permitir update para usuários autenticados"
    on public.programacao for update
    to authenticated
    using (true)
    with check (true);

-- Política para permitir DELETE para usuários autenticados
create policy "Permitir delete para usuários autenticados"
    on public.programacao for delete
    to authenticated
    using (true);
