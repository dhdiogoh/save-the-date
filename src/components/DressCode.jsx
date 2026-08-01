import AccentIllustration from './AccentIllustration'

export default function DressCode() {
  return (
    <section className="dresscode bg-ivory" id="dresscode">
      <AccentIllustration
        src="/images/illustrations/sage/trajes-casal-illustration.png"
        style={{ top: '8%', right: '5%', transform: 'rotate(7deg)' }}
      />

      <div className="wrap">
        <div className="dresscode-head">
          <span className="eyebrow eyebrow-line" data-reveal>
            Dress Code
          </span>
          <h2 className="section-title" data-reveal>
            Traje: Passeio Completo
          </h2>
        </div>

        <div className="dresscode-columns">
          <div className="dc-col">
            <h3 className="dc-col-title" data-reveal>
              Homens
            </h3>
            <p className="dc-text" data-reveal>
              Terno e gravata, sem dúvida — mas pensando no calor de outubro e na cerimônia ao ar livre, vale
              escolher tecidos leves e cores que respirem bem. Elegância com conforto é a régua aqui.
            </p>
            <div className="dc-alert" data-reveal>
              <span className="dc-swatch is-split" aria-hidden="true" />
              <p>
                <strong>Bege + amarelo</strong> (terno bege com gravata amarela) é a combinação dos padrinhos — se
                puderem evitar essa dupla, ajuda a gente a manter eles em destaque no dia.
              </p>
            </div>
          </div>

          <div className="dc-col">
            <h3 className="dc-col-title" data-reveal>
              Mulheres
            </h3>
            <p className="dc-text" data-reveal>
              Vestido longo é o pedido, com espaço livre pra escolher cor, estampa e caimento. A cerimônia é num
              jardim ao ar livre, então tecidos fluidos agradecem. Só pedimos atenção a duas cores específicas,
              explicadas abaixo.
            </p>
            <div className="dc-alert" data-reveal>
              <span className="dc-swatch is-white" aria-hidden="true" />
              <p>
                <strong>Branco</strong> (e tons próximos como off-white, marfim, champagne) é reservado pra noiva.
              </p>
            </div>
            <div className="dc-alert" data-reveal>
              <span className="dc-swatch is-yellow" aria-hidden="true" />
              <p>
                <strong>Amarelo</strong> é a cor das madrinhas — se puderem evitar esse tom, ajuda a gente a manter
                elas em destaque no dia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
