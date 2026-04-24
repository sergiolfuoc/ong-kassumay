CREATE TABLE public.news_tags (
    news_id int NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
    tag_id  int NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, tag_id)
);

CREATE TABLE public.campaign_tags (
    campaign_id int NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    tag_id      int NOT NULL REFERENCES public.tags(id)      ON DELETE CASCADE,
    tagged_at   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (campaign_id, tag_id)
);

CREATE INDEX news_tags_tag_id_idx     ON public.news_tags(tag_id);
CREATE INDEX campaign_tags_tag_id_idx ON public.campaign_tags(tag_id);

ALTER TABLE public.news_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_tags ENABLE ROW LEVEL SECURITY;

-- lectura publica 
CREATE POLICY "Everyone can read news_tags"
  ON public.news_tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Everyone can read campaign_tags"
  ON public.campaign_tags FOR SELECT
  TO anon, authenticated
  USING (true);

-- CUD solo admins
CREATE POLICY "Admins have full CRUD permissions to news_tags"
  ON public.news_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins have full CRUD permissions to campaign_tags"
  ON public.campaign_tags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );