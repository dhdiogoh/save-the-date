import { supabaseAdmin } from '../_supabaseAdmin.js'

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE

// A InfinitePay não documenta assinatura/segredo pro webhook — a orientação
// oficial deles é validar o order_nsu contra um pedido real e, além disso,
// confirmar o pagamento com o próprio servidor deles via payment_check antes
// de considerar pago. Isso evita que qualquer um forje uma chamada pra essa
// rota e finja que um presente foi pago.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, message: 'method not allowed' })
  }

  const { order_nsu: orderNsu, transaction_nsu: transactionNsu, invoice_slug: invoiceSlug } = req.body || {}

  if (!orderNsu || !transactionNsu || !invoiceSlug) {
    return res.status(400).json({ success: false, message: 'payload incompleto' })
  }

  const { data: compra, error: compraError } = await supabaseAdmin
    .from('compras')
    .select('id, status')
    .eq('id', orderNsu)
    .single()

  if (compraError || !compra) {
    return res.status(400).json({ success: false, message: 'pedido não encontrado' })
  }

  if (compra.status === 'pago') {
    // webhook pode reenviar o mesmo evento; já processamos, só confirma
    return res.status(200).json({ success: true, message: null })
  }

  let verified
  try {
    const resp = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: invoiceSlug,
      }),
    })
    verified = await resp.json()
  } catch (err) {
    console.error('[webhook infinitepay] falha ao chamar payment_check:', err)
    return res.status(400).json({ success: false, message: 'falha ao verificar pagamento' })
  }

  if (!verified?.success || !verified?.paid) {
    return res.status(400).json({ success: false, message: 'pagamento não confirmado pela InfinitePay' })
  }

  const { error: updateError } = await supabaseAdmin
    .from('compras')
    .update({
      status: 'pago',
      infinitepay_charge_id: transactionNsu,
      infinitepay_payload: req.body,
      updated_at: new Date().toISOString(),
    })
    .eq('id', compra.id)

  if (updateError) {
    console.error('[webhook infinitepay] falha ao atualizar compra:', updateError)
    return res.status(400).json({ success: false, message: 'falha ao registrar pagamento' })
  }

  return res.status(200).json({ success: true, message: null })
}
