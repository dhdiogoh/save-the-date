import { useEffect, useState } from 'react'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function GiftCheckoutModal({ gift, onClose }) {
  const cotasRestantes = gift.tem_cota ? Math.max(1, gift.qtd_cotas_total - gift.cotas_confirmadas) : 1

  const [quantidade, setQuantidade] = useState(1)
  const [nome, setNome] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const valorTotal = gift.tem_cota ? quantidade * Number(gift.valor_cota) : Number(gift.preco_referencia)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!nome.trim()) {
      setError('Coloca seu nome pra gente saber quem presenteou.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presente_id: gift.id,
          quantidade_cotas: gift.tem_cota ? quantidade : 1,
          comprador_nome: nome.trim(),
          comprador_telefone: null,
        }),
      })
      const data = await resp.json()
      if (!resp.ok || !data.checkout_url) {
        throw new Error(data?.error || 'falha ao gerar checkout')
      }
      window.location.href = data.checkout_url
    } catch (err) {
      console.error('[checkout] erro:', err)
      setError('Não conseguimos gerar o pagamento agora. Tenta de novo em instantes?')
      setSubmitting(false)
    }
  }

  return (
    <div className="gift-modal-backdrop" onClick={onClose}>
      <div className="gift-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gift-modal-close" aria-label="Fechar" onClick={onClose}>
          &times;
        </button>

        <h3 className="gift-modal-title">{gift.nome}</h3>
        <p className="gift-modal-category">{gift.categoria}</p>

        <form onSubmit={handleSubmit}>
          {gift.tem_cota && (
            <div className="field">
              <label htmlFor="quantidade">Quantas cotas você quer presentear?</label>
              <div className="gift-qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  disabled={quantidade <= 1}
                  aria-label="Diminuir"
                >
                  −
                </button>
                <input
                  type="number"
                  id="quantidade"
                  min="1"
                  max={cotasRestantes}
                  value={quantidade}
                  onChange={(e) => {
                    const v = Number.parseInt(e.target.value, 10)
                    if (Number.isInteger(v)) setQuantidade(Math.min(cotasRestantes, Math.max(1, v)))
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.min(cotasRestantes, q + 1))}
                  disabled={quantidade >= cotasRestantes}
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>
              <p className="field-hint">{cotasRestantes} cota(s) restante(s) — {currency.format(gift.valor_cota)} cada.</p>
              <p className="field-hint">Quanto mais cotas, mais perto a gente chega de fechar esse presente — mas qualquer quantidade já ajuda muito. 💛</p>
            </div>
          )}

          <div className="field">
            <label htmlFor="gift-nome">Seu nome</label>
            <input
              type="text"
              id="gift-nome"
              placeholder="Como devemos te reconhecer"
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="gift-modal-total">
            <span>Total</span>
            <strong>{currency.format(valorTotal)}</strong>
          </div>

          <p className="field-hint gift-modal-checkout-note">
            Na próxima tela, o checkout pode pedir um endereço — é só o endereço de cobrança padrão, não tem entrega
            de verdade. Pode preencher com o seu.
          </p>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Gerando pagamento...' : 'Ir para pagamento'}
          </button>
        </form>
      </div>
    </div>
  )
}
