// Payload já no formato de linha da tabela `rsvp_confirmations`:
//   id uuid default gen_random_uuid() primary key
//   nome text
//   telefone text
//   dependentes jsonb
//   criado_em timestamptz default now()
export async function submitRSVP(payload) {
  console.log('[RSVP] payload pronto para Supabase:', payload)

  // TODO: integrar Supabase aqui.
  // const { error } = await supabase.from('rsvp_confirmations').insert(payload)
  // if (error) throw error

  return { success: true }
}
