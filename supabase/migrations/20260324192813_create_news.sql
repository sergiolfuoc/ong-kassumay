CREATE TABLE public.news (
    id          serial PRIMARY KEY,
    title       text NOT NULL,
    slug        text NOT NULL UNIQUE,
    content     text NOT NULL DEFAULT '',
    excerpt     text,
    image_url   text,
    published   boolean NOT NULL DEFAULT false,
    author_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read published news"
  ON public.news FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins have full CRUD permissions to news"
  ON public.news FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );
