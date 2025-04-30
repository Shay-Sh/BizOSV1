-- Create a function to check if tables exist
CREATE OR REPLACE FUNCTION check_tables_exist(table_names TEXT[])
RETURNS TABLE(table_name TEXT, table_exists BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.table_name::TEXT,
    EXISTS(
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = t.table_name
    ) AS table_exists
  FROM unnest(table_names) AS t(table_name);
END;
$$ LANGUAGE plpgsql; 