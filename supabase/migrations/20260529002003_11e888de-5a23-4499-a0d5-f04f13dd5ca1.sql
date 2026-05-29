-- Assign admin role to the owner account
INSERT INTO public.user_roles (user_id, role)
VALUES ('4d81d718-75a8-41db-b1eb-552280efd03b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Auto-generate a confirmation number for new appointments
CREATE OR REPLACE FUNCTION public.gen_confirmation_number()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'CLC-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
$$;

ALTER TABLE public.appointments
  ALTER COLUMN confirmation_number SET DEFAULT public.gen_confirmation_number();