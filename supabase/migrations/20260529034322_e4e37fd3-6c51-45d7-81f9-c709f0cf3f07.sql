DROP POLICY IF EXISTS "Anyone can book an appointment" ON public.appointments;

REVOKE INSERT ON public.appointments FROM anon, authenticated;