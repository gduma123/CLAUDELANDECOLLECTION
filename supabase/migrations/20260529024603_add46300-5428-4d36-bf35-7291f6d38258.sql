-- Fix missing INSERT policy on appointments (public booking form)
CREATE POLICY "Anyone can book an appointment"
  ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Restrict user_roles so only admins can assign roles
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));