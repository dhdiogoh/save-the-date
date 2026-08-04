import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AccentIllustration from './AccentIllustration'
import { useLenis } from '../context/LenisContext'

gsap.registerPlugin(ScrollTrigger)

export default function Convite() {
  const scrollRef = useRef(null)
  const bodyRef = useRef(null)
  const flapRef = useRef(null)
  const cardRef = useRef(null)
  const hintRef = useRef(null)
  const hintEndRef = useRef(null)
  const timelineRef = useRef(null)
  const lenis = useLenis()

  // move o scroll até uma posição correspondente a um ponto da timeline do
  // GSAP (0 a tl.duration()), usando os limites reais do ScrollTrigger.
  function scrollToTimelinePosition(position) {
    const tl = timelineRef.current
    const st = tl?.scrollTrigger
    if (!st) return
    const fraction = position / tl.duration()
    const target = st.start + fraction * (st.end - st.start)
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 })
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' })
    }
  }

  // clique no envelope fechado: leva até logo depois da carta revelada,
  // já com o hint de "continue" visível — segue a mesma animação de scroll.
  function handleOpenEnvelope() {
    scrollToTimelinePosition(3.0)
  }

  // a carta já terminou de se revelar quando esse hint aparece, então dar um
  // empurrão de scroll aqui é seguro — não mexe na animação da revelação,
  // só ajuda quem não percebeu que dá pra continuar rolando a página.
  function handleContinueNudge() {
    const nudge = window.innerHeight * 0.6
    const target = window.scrollY + nudge
    if (lenis) {
      lenis.scrollTo(target, { duration: 1 })
    } else {
      window.scrollBy({ top: nudge, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const body = bodyRef.current
    const flap = flapRef.current
    const card = cardRef.current
    const hint = hintRef.current
    const hintEnd = hintEndRef.current
    if (!flap || !card) return undefined

    gsap.set(card, { opacity: 0 })

    // largura final do card no auge da revelação, calculada em px
    // (equivalente ao antigo scale, mas via layout real — evita blur de upscale)
    // no desktop o teto é bem menor: 97% da viewport ficaria enorme numa tela larga
    const maxRevealWidth = window.innerWidth >= 900 ? 480 : 764
    const revealWidth = Math.min(Math.max(300, window.innerWidth * 0.97), maxRevealWidth)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
    timelineRef.current = tl

    tl.to(flap, { rotationX: -178, duration: 1.7, ease: 'power2.inOut' }, 0.05)
      .to(hint, { opacity: 0, pointerEvents: 'none', duration: 0.4 }, 0)
      .to(card, { zIndex: 6, duration: 0.01 }, 0.95)
      .to(body, { filter: 'blur(6px)', opacity: 0.5, duration: 1.3, ease: 'power2.out' }, 0.95)
      .to(flap, { filter: 'blur(6px)', opacity: 0.5, zIndex: 0, duration: 1.3, ease: 'power2.out' }, 0.95)
      .to(card, { opacity: 1, width: revealWidth, duration: 1.7, ease: 'power2.out' }, 0.95)

    if (hintEnd) {
      tl.to(hintEnd, { opacity: 1, pointerEvents: 'auto', duration: 0.5 }, 2.7)
    }

    // segura a cena revelada por um bom tempo antes de liberar o scroll
    tl.to({}, { duration: 2.5 }, 3.7)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      timelineRef.current = null
    }
  }, [])

  return (
    <section className="invite bg-blue-wash" id="convite">
      <div className="invite-scroll" ref={scrollRef}>
        <div className="invite-sticky">
          <AccentIllustration
            src="/images/illustrations/sage/estrelas-illustrations.png"
            style={{ top: '12%', left: '7%', transform: 'rotate(-6deg)' }}
          />
          <AccentIllustration
            src="/images/illustrations/sage/sinos-illustration.png"
            style={{ top: '14%', right: '8%', transform: 'rotate(8deg)' }}
          />

          <div className="invite-stage">
            <div className="env-layer env-body" ref={bodyRef}>
              <img src="/images/illustrations/convite/corpo-envelope.png" alt="" />
            </div>

            <div className="env-card" ref={cardRef}>
              <div className="env-card-img">
                <img src="/images/illustrations/convite/save-the-date-carta.png" alt="Save the Date - Diogo e Amanda, 24 de outubro de 2026" />
              </div>
            </div>

            <div className="env-layer env-flap" ref={flapRef}>
              <img src="/images/illustrations/convite/bolso-cima-convite.png" alt="" />
            </div>
          </div>

          <button
            type="button"
            className="invite-hint invite-hint-btn"
            ref={hintRef}
            onClick={handleOpenEnvelope}
          >
            <span>clique para abrir</span>
          </button>

          <button
            type="button"
            className="invite-hint invite-hint-end invite-hint-btn"
            ref={hintEndRef}
            style={{ opacity: 0, pointerEvents: 'none' }}
            onClick={handleContinueNudge}
          >
            <span>continue</span>
            <span className="invite-hint-arrow">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}
