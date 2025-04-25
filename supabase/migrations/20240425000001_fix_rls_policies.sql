-- First, ensure RLS is enabled on the user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Create more permissive policy for viewing profiles
CREATE POLICY "Anyone can view user profiles"
  ON public.user_profiles 
  FOR SELECT 
  USING (true);

-- Create policy for users to update their own profiles
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles 
  FOR UPDATE 
  USING (id = auth.uid());

-- Create policy for service role and authenticated users to insert profiles
CREATE POLICY "Auth users and service role can insert profiles"
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'service_role' OR 
    id = auth.uid()
  );

-- Create policy for service role and users to delete their own profiles
CREATE POLICY "Users can delete their own profiles"
  ON public.user_profiles 
  FOR DELETE
  USING (
    auth.role() = 'service_role' OR 
    id = auth.uid()
  ); 