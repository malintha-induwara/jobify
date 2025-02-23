import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cqrjinreyanjnsbktdwk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcmppbnJleWFuam5zYmt0ZHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxOTk2MjUsImV4cCI6MjA1NTc3NTYyNX0.Tz_UX1vw0Zr-Sm6cqkZqYo8AFzWuVXnXs8ntztnEs40';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
