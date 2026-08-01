import { Link } from 'react-router-dom'
import { downloadWeddingIcs } from '../lib/generateIcs'
import { WEDDING_INFO } from '../config/wedding'

export default function Encerramento() {
  function handleAddToCalendar(e) {
    e.preventDefault()
    downloadWeddingIcs()
  }

  return (
    <section className="closing bg-blue-wash" id="closing">
      <div className="wrap">
        <div className="closing-cats" data-reveal>
          <img src="/images/illustrations/sage/gatos-illustration.png" alt="Nossos gatos" />
        </div>
        <p className="closing-msg" data-reveal>
          Mal podemos esperar para celebrar com você
        </p>
        <img
          className="closing-lettering"
          src="/images/illustrations/lettering-diogo-amanda.png"
          alt={`${WEDDING_INFO.coupleNames.groom} & ${WEDDING_INFO.coupleNames.bride}`}
          data-reveal
        />

        <a className="btn-cal" href="#" onClick={handleAddToCalendar} data-reveal>
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4.5" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" />
          </svg>
          Adicionar ao calendário
        </a>

        <Link className="link-gifts" to="/presentes" data-reveal>
          Ver lista de presentes
        </Link>

        <p className="footer-note" data-reveal>
          24 · 10 · 2026 — Belém, Pará
        </p>
      </div>
    </section>
  )
}
