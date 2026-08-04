import { supabaseAdmin, siteUrl } from './_supabaseAdmin.js'

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const { presente_id, quantidade_cotas, comprador_nome, comprador_telefone } = req.body || {}

  if (!presente_id || !comprador_nome || !comprador_nome.trim()) {
    return res.status(400).json({ error: 'presente_id e comprador_nome são obrigatórios' })
  }

  const { data: presente, error: presenteError } = await supabaseAdmin
    .from('presentes')
    .select('*')
    .eq('id', presente_id)
    .eq('ativo', true)
    .single()

  if (presenteError || !presente) {
    return res.status(404).json({ error: 'presente não encontrado' })
  }

  let quantidade = 1
  let valorTotal = Number(presente.preco_referencia)

  if (presente.tem_cota) {
    quantidade = Number.parseInt(quantidade_cotas, 10)
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      return res.status(400).json({ error: 'quantidade de cotas inválida' })
    }
    valorTotal = Number((quantidade * Number(presente.valor_cota)).toFixed(2))
  }

  const { data: compra, error: compraError } = await supabaseAdmin
    .from('compras')
    .insert({
      presente_id,
      comprador_nome: comprador_nome.trim(),
      comprador_telefone: comprador_telefone?.trim() || null,
      quantidade_cotas: quantidade,
      valor_total: valorTotal,
      status: 'pendente',
    })
    .select()
    .single()

  if (compraError || !compra) {
    console.error('[checkout] falha ao criar compra:', compraError)
    return res.status(500).json({ error: 'falha ao registrar compra' })
  }

  const itemDescription = (
    presente.tem_cota ? `${presente.nome} (${quantidade} cota${quantidade > 1 ? 's' : ''})` : presente.nome
  ).slice(0, 100)

  const base = siteUrl()

  let checkoutUrl
  try {
    const resp = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        order_nsu: compra.id,
        webhook_url: `${base}/api/webhooks/infinitepay`,
        redirect_url: `${base}/presentes?obrigado=1`,
        items: [{ quantity: 1, price: Math.round(valorTotal * 100), description: itemDescription }],
      }),
    })
    const data = await resp.json()
    if (!resp.ok || !data.url) {
      throw new Error(data?.message || `resposta inesperada da InfinitePay (status ${resp.status})`)
    }
    checkoutUrl = data.url
  } catch (err) {
    console.error('[checkout] falha ao criar link InfinitePay:', err)
    await supabaseAdmin.from('compras').update({ status: 'cancelado' }).eq('id', compra.id)
    return res.status(502).json({ error: 'falha ao gerar link de pagamento, tenta de novo' })
  }

  return res.status(200).json({ checkout_url: checkoutUrl, compra_id: compra.id })
}
