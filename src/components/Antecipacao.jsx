import AccentIllustration from './AccentIllustration'
import NoivadoCarousel from './NoivadoCarousel'
import { useCountdown } from '../hooks/useCountdown'
import { WEDDING_INFO } from '../config/wedding'

export default function Antecipacao() {
  const { days, hours, mins, secs } = useCountdown(WEDDING_INFO.date)

  return (
    <section className="antecip bg-ivory" id="antecip">
      <AccentIllustration
        src="/images/illustrations/sage/cafe=illustration.png"
        style={{ top: '8%', left: '5%', transform: 'rotate(-8deg)' }}
      />
      <AccentIllustration
        src="/images/illustrations/sage/camera-illustration.png"
        style={{ bottom: '10%', right: '6%', transform: 'rotate(10deg)' }}
      />

      <div className="wrap antecip-grid">
        <div className="antecip-copy">
          <span className="eyebrow eyebrow-line" data-reveal>
            O grande dia está chegando
          </span>
          <h2 className="section-title" data-reveal>
            Estamos contando os dias
            <br className="mobile-only-break" />
            para celebrar com você
          </h2>
          <p className="lead" data-reveal>
            Estamos contando os dias para viver ao lado de quem amamos o começo de um novo capítulo. E queremos você
            pertinho de nós.
          </p>

          <div className="countdown" data-reveal>
            <div className="cd-cell">
              <div className="cd-num">{days}</div>
              <div className="cd-label">dias</div>
            </div>
            <div className="cd-cell">
              <div className="cd-num">{hours}</div>
              <div className="cd-label">horas</div>
            </div>
            <div className="cd-cell">
              <div className="cd-num">{mins}</div>
              <div className="cd-label">min</div>
            </div>
            <div className="cd-cell">
              <div className="cd-num">{secs}</div>
              <div className="cd-label">seg</div>
            </div>
          </div>
        </div>

        <NoivadoCarousel />
      </div>
    </section>
  )
}
