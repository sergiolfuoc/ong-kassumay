CREATE TABLE public.tags (
    id         serial PRIMARY KEY,
    slug       text NOT NULL UNIQUE,
    name       text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Lectura publica
CREATE POLICY "Everyone can read tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- CUD solo admins
CREATE POLICY "Admins have full CRUD permissions to tags"
  ON public.tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );
