import { Link } from 'react-router-dom'
import AccentIllustration from './AccentIllustration'

export default function PresentesTeaser() {
  return (
    <section className="gifts-teaser bg-ivory-2" id="presentes-teaser">
      <AccentIllustration
        src="/images/illustrations/sage/presente-illustration.png"
        style={{ top: '10%', left: '6%', transform: 'rotate(-8deg)' }}
      />

      <div className="wrap gifts-teaser-wrap">
        <span className="eyebrow eyebrow-line" data-reveal>
          Lista de Presentes
        </span>
        <h2 className="section-title" data-reveal>
          Ajude a gente a montar esse novo lar
        </h2>
        <p className="lead" data-reveal>
          Escolhemos com carinho os itens que mais vão fazer diferença nesse começo. Ao presentear um deles, o valor
          vai direto pra gente — e ele é usado exatamente pra isso, priorizando sempre o que for mais necessário no
          momento.
        </p>
        <Link className="btn-map" to="/presentes" data-reveal>
          <svg viewBox="0 0 24 24">
            <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          Ver lista de presentes
        </Link>
      </div>
    </section>
  )
}
