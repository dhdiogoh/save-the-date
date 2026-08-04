const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function GiftCard({ gift, onSelect }) {
  const isGiven = gift.tem_cota
    ? gift.cotas_confirmadas >= gift.qtd_cotas_total
    : gift.cotas_confirmadas >= 1

  const progresso = gift.tem_cota
    ? Math.min(100, Math.round((gift.cotas_confirmadas / gift.qtd_cotas_total) * 100))
    : null

  return (
    <div className={`gift-card${isGiven ? ' is-given' : ''}`}>
      <div className="gift-card-img">
        {gift.imagem_url ? (
          <img src={gift.imagem_url} alt={gift.nome} />
        ) : (
          <div className="gift-card-img-placeholder" aria-hidden="true" />
        )}
        {isGiven && <span className="gift-badge">Presente completo</span>}
      </div>
      <div className="gift-card-body">
        <span className="gift-card-category">{gift.categoria}</span>
        <h3 className="gift-card-name">{gift.nome}</h3>

        {gift.tem_cota ? (
          <>
            <span className="gift-card-price">
              {currency.format(gift.valor_cota)} <span className="gift-card-price-unit">/ cota</span>
            </span>
            <div className="gift-progress">
              <div className="gift-progress-bar">
                <div className="gift-progress-fill" style={{ width: `${progresso}%` }} />
              </div>
              <span className="gift-progress-label">
                {gift.cotas_confirmadas} de {gift.qtd_cotas_total} cotas
              </span>
            </div>
          </>
        ) : (
          <span className="gift-card-price">{currency.format(gift.preco_referencia)}</span>
        )}

        <button type="button" className="btn-gift" disabled={isGiven} onClick={onSelect}>
          {isGiven ? 'Presenteado' : gift.tem_cota ? 'Presentear uma cota' : 'Presentear'}
        </button>
      </div>
    </div>
  )
}
