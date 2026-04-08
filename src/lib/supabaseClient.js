// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwmoftfgoiwbfwitcyrf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bW9mdGZnb2l3YmZ3aXRjeXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Mjg2MjUsImV4cCI6MjA5MDUwNDYyNX0.JRUI4sKa-_Q9JqFnRZxpM9k5ywXJp9DeKlcye1F5SGE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);