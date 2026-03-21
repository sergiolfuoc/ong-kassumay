ALTER TABLE public.profiles ADD COLUMN role text NOT NULL DEFAULT 'USER'
    CHECK (role IN ('GUEST', 'USER', 'ADMIN'));
