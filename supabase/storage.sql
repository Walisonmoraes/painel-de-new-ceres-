-- Create policies for the visitas bucket

-- Create a policy to allow authenticated users to upload files
create policy "Allow authenticated users to upload files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'visitas' AND
    (storage.foldername(name))[1] = 'visitas-comerciais'
  );

-- Create a policy to allow public access to files
create policy "Allow public access to files"
  on storage.objects for select
  to public
  using (bucket_id = 'visitas');
