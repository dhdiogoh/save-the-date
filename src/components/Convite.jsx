import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AccentIllustration from './AccentIllustration'

gsap.registerPlugin(ScrollTrigger)

export default function Convite() {
  const scrollRef = useRef(null)
  const bodyRef = useRef(null)
  const flapRef = useRef(null)
  const cardRef = useRef(null)
  const hintRef = useRef(null)
  const hintEndRef = useRef(null)

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

    tl.to(flap, { rotationX: -178, duration: 1.7, ease: 'power2.inOut' }, 0.05)
      .to(hint, { opacity: 0, duration: 0.4 }, 0)
      .to(card, { zIndex: 6, duration: 0.01 }, 0.95)
      .to(body, { filter: 'blur(6px)', opacity: 0.5, duration: 1.3, ease: 'power2.out' }, 0.95)
      .to(flap, { filter: 'blur(6px)', opacity: 0.5, zIndex: 0, duration: 1.3, ease: 'power2.out' }, 0.95)
      .to(card, { opacity: 1, width: revealWidth, duration: 1.7, ease: 'power2.out' }, 0.95)

    if (hintEnd) {
      tl.to(hintEnd, { opacity: 1, duration: 0.5 }, 3.2)
    }

    // segura a cena revelada por um bom tempo antes de liberar o scroll
    tl.to({}, { duration: 2.5 }, 3.7)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
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

          <div className="invite-hint" ref={hintRef}>
            <span>continue para abrir</span>
          </div>

          <div className="invite-hint invite-hint-end" ref={hintEndRef} style={{ opacity: 0 }}>
            <span>continue</span>
          </div>
        </div>
      </div>
    </section>
  )
}
