-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing users
INSERT INTO public.user_profiles (id, display_name, avatar_url, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email),
  COALESCE(raw_user_meta_data->>'avatar_url', NULL),
  created_at,
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles); 