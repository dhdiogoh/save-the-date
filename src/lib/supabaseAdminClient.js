import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// cliente isolado do público (src/lib/supabaseClient.js): sessão de login do
// admin fica num storageKey separado, então nunca "vaza" pras chamadas do
// site público (RSVP, presentes) — que sempre devem rodar como anon.
export const supabaseAdmin =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          storageKey: 'admin-auth-storage',
        },
      })
    : null
