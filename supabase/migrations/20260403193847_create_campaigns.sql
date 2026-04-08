CREATE TABLE public.campaigns (
    id             serial PRIMARY KEY,
    title          text NOT NULL,
    slug           text NOT NULL UNIQUE,
    description    text NOT NULL DEFAULT '',
    excerpt        text,
    image_url      text,
    goal_amount    numeric(12,2),
    raised_amount  numeric(12,2) NOT NULL DEFAULT 0,
    start_date     date,
    end_date       date,
    active         boolean NOT NULL DEFAULT false,
    author_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read active campaigns"
  ON public.campaigns FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins have full CRUD permissions to campaigns"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

-- Bucket publico para imagenes de campañas
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true);

-- Lectura publica
CREATE POLICY "Anyone can view campaign images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'campaign-images');

-- Solo admins pueden CUD imagenes de campañas
CREATE POLICY "Admins can upload campaign images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'campaign-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update campaign images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'campaign-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete campaign images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'campaign-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );
