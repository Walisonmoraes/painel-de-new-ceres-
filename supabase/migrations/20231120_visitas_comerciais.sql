-- Create the visitas_comerciais table
create table visitas_comerciais (
  id uuid default uuid_generate_v4() primary key,
  empresa text not null,
  contato text not null,
  cargo text not null,
  telefone text not null,
  email text not null,
  interesse text not null,
  produtos text not null,
  proximo_contato text not null,
  observacoes text,
  fotos text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a trigger to automatically update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_visitas_comerciais_updated_at
  before update on visitas_comerciais
  for each row
  execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table visitas_comerciais enable row level security;

-- Create a policy that allows all authenticated users to select visitas_comerciais
create policy "Allow authenticated users to select visitas_comerciais"
  on visitas_comerciais for select
  to authenticated
  using (true);

-- Create a policy that allows authenticated users to insert their own visitas_comerciais
create policy "Allow authenticated users to insert visitas_comerciais"
  on visitas_comerciais for insert
  to authenticated
  with check (true);

-- Create a policy that allows authenticated users to update their own visitas_comerciais
create policy "Allow authenticated users to update visitas_comerciais"
  on visitas_comerciais for update
  to authenticated
  using (true)
  with check (true);

-- Create a policy that allows authenticated users to delete their own visitas_comerciais
create policy "Allow authenticated users to delete visitas_comerciais"
  on visitas_comerciais for delete
  to authenticated
  using (true);
