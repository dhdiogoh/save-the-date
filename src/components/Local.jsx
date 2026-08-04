import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AccentIllustration from './AccentIllustration'
import { isMobileDevice } from '../hooks/useIsMobile'
import { WEDDING_INFO } from '../config/wedding'

gsap.registerPlugin(ScrollTrigger)

export default function Local() {
  const sectionRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    if (isMobileDevice() || !parallaxRef.current) return undefined

    const tween = gsap.fromTo(
      parallaxRef.current,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section className="local bg-ivory-2" id="local" ref={sectionRef}>
      <AccentIllustration
        src="/images/illustrations/sage/buque-illustration.png"
        style={{ bottom: '8%', left: '4%', transform: 'rotate(-6deg)' }}
      />

      <div className="wrap">
        <div className="local-copy">
          <span className="eyebrow eyebrow-line" data-reveal>
            O lugar
          </span>
          <h2 className="section-title" data-reveal>
            Um jardim para
            <br />
            celebrar o amor
          </h2>
          <p className="lead" data-reveal>
            Entre luzes suaves e muito verde, o {WEDDING_INFO.venue.name} vai receber nosso grande dia. Um cantinho
            encantador no coração de Belém.
          </p>
          <span className="pin-tag" data-reveal>
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {WEDDING_INFO.venue.name} — {WEDDING_INFO.venue.address.replace(/,\s*Belém.*$/, '')}
          </span>
        </div>

        <div className="local-figure" data-reveal>
          <img
            className="parallax-bg"
            ref={parallaxRef}
            src="/images/local/garden-821-illustration.png"
            alt={`Ilustração do ${WEDDING_INFO.venue.name}`}
          />
        </div>
      </div>
    </section>
  )
}
