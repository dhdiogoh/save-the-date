import { Link } from 'react-router-dom'
import { LenisProvider } from '../context/LenisContext'
import { RevealProvider } from '../context/RevealContext'
import AccentIllustration from '../components/AccentIllustration'
import GiftCard from '../components/GiftCard'
import { mockGifts } from '../data/mockGifts'

export default function Presentes() {
  return (
    <LenisProvider>
      <RevealProvider>
        <PresentesContent />
      </RevealProvider>
    </LenisProvider>
  )
}

function PresentesContent() {
  return (
    <section className="gifts-page bg-ivory-2">
      <AccentIllustration
        src="/images/illustrations/sage/presente-illustration.png"
        style={{ top: '6%', left: '5%', transform: 'rotate(-8deg)' }}
        hideMobile={false}
      />
      <AccentIllustration
        src="/images/illustrations/sage/coracao-illustration.png"
        style={{ bottom: '6%', right: '5%', transform: 'rotate(8deg)' }}
        hideMobile={false}
      />

      <div className="wrap gifts-page-wrap">
        <Link className="gifts-back" to="/">
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <div className="gifts-head">
          <span className="eyebrow eyebrow-line" data-reveal>
            Lista de Presentes
          </span>
          <h1 className="section-title" data-reveal>
            Um mimo pra gente começar essa nova fase
          </h1>
          <p className="lead gifts-lead" data-reveal>
            Montamos essa lista pensando no que realmente vai nos ajudar a começar essa nova fase em casa. Cada item
            tem um valor de referência, e ao escolher presentear, esse valor vai direto pra gente — assim
            conseguimos priorizar as compras conforme a necessidade real do momento, sem correr o risco de duplicar
            presentes ou receber algo que já temos. É prático pra quem mora longe, e garante que cada contribuição
            realmente vai virar aquilo que estamos precisando.
          </p>
        </div>

        <div className="gifts-grid">
          {mockGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      </div>
    </section>
  )
}
