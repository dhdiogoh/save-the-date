const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function GiftCard({ gift }) {
  const isGiven = gift.status === 'presenteado'

  return (
    <div className={`gift-card${isGiven ? ' is-given' : ''}`} data-reveal>
      <div className="gift-card-img">
        <img src={gift.imagem} alt={gift.nome} />
        {isGiven && <span className="gift-badge">Já presenteado</span>}
      </div>
      <div className="gift-card-body">
        <h3 className="gift-card-name">{gift.nome}</h3>
        <span className="gift-card-price">{currency.format(gift.valor_centavos / 100)}</span>
        <button type="button" className="btn-gift" disabled={isGiven}>
          {isGiven ? 'Presenteado' : 'Presentear'}
        </button>
      </div>
    </div>
  )
}
