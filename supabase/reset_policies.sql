-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Permitir select para usuários autenticados" ON public.programacao;
DROP POLICY IF EXISTS "Permitir insert para usuários autenticados" ON public.programacao;
DROP POLICY IF EXISTS "Permitir update para usuários autenticados" ON public.programacao;
DROP POLICY IF EXISTS "Permitir delete para usuários autenticados" ON public.programacao;

-- Recriar as políticas
create policy "Permitir select para usuários autenticados"
    on public.programacao for select
    to authenticated
    using (true);

create policy "Permitir insert para usuários autenticados"
    on public.programacao for insert
    to authenticated
    with check (true);

create policy "Permitir update para usuários autenticados"
    on public.programacao for update
    to authenticated
    using (true)
    with check (true);

create policy "Permitir delete para usuários autenticados"
    on public.programacao for delete
    to authenticated
    using (true);
