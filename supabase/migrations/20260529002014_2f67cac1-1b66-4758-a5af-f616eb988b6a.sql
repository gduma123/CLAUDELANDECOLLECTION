CREATE OR REPLACE FUNCTION public.gen_confirmation_number()
RETURNS text
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT 'CLC-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
$$;