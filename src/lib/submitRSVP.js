import { supabase } from './supabaseClient'

// Payload já no formato de linha da tabela `rsvp_confirmations`:
//   id uuid default gen_random_uuid() primary key
//   nome text
//   telefone text
//   dependentes jsonb
//   criado_em timestamptz default now()
export async function submitRSVP(payload) {
  if (!supabase) {
    throw new Error('Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env')
  }

  const { error } = await supabase.from('rsvp_confirmations').insert(payload)
  if (error) throw error

  return { success: true }
}
