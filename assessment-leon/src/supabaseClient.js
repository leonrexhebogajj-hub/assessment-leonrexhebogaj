import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ziylojpeokzlfgdkzoqw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeWxvanBlb2t6bGZnZGt6b3F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDEyNTIsImV4cCI6MjA4NjU3NzI1Mn0.90IFjOwOqr-9mO22EQ0Q0Z-yhhGG-9esHgUvN_6i69Y";

export const supabase = createClient(supabaseUrl, supabaseKey);