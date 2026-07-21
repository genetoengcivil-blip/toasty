import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rkgbhvmykbkdyhzxrqee.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZ2Jodm15a2JrZHloenhycWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzOTU0ODUsImV4cCI6MjA5OTk3MTQ4NX0.qQV5FnkY5rYCQOVwnnWLavl6l7osNqEjaeG_rSiPlnw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
