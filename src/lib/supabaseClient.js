import { createClient } from '@supabase/supabase-js';

const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const mockSupabase = {
  from: (table) => ({
    select: () => ({
      data: [],
      error: null
    }),
    insert: () => ({
      data: { id: 'mock-id' },
      error: null
    }),
    upsert: () => ({
      data: { id: 'mock-id' },
      error: null
    })
  })
};

const supabase = isDemoMode ? mockSupabase : createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export { supabase };
