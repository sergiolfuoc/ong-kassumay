-- Bucket publico para imagenes de noticias
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true);

-- lectura publica
CREATE POLICY "Anyone can view news images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'news-images');

-- solo admins pueden subir/editar/borrar imagenes de noticias
CREATE POLICY "Admins can upload news images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'news-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update news images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'news-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete news images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'news-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );
