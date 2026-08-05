import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HERO_VIDEO_URL =
  'https://r7gebaatjirfgncj.public.blob.vercel-storage.com/magnific_animate-this-garden-illus_626MOn6iJO.mp4'
const HERO_FALLBACK_IMAGE = '/images/jardim-hero.webp'

export default function Hero({ canAutoplayVideo = true }) {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const facesRef = useRef(null)
  const faceDiogoRef = useRef(null)
  const faceAmandaRef = useRef(null)
  const brandRef = useRef(null)
  const monogramRef = useRef(null)
  const letteringRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !canAutoplayVideo) return undefined

    video.muted = true
    video.play().catch(() => {})

    // segurança extra: se mesmo assim o autoplay real falhar (o teste no
    // preload foi otimista), qualquer interação da pessoa libera o vídeo.
    const tryPlayOnInteraction = () => {
      video.play().catch(() => {})
    }
    window.addEventListener('pointerdown', tryPlayOnInteraction, { once: true })
    window.addEventListener('touchstart', tryPlayOnInteraction, { once: true, passive: true })
    window.addEventListener('scroll', tryPlayOnInteraction, { once: true, passive: true })

    return () => {
      window.removeEventListener('pointerdown', tryPlayOnInteraction)
      window.removeEventListener('touchstart', tryPlayOnInteraction)
      window.removeEventListener('scroll', tryPlayOnInteraction)
    }
  }, [canAutoplayVideo])

  useLayoutEffect(() => {
    // rostos entram de lados opostos e se unem no centro, bem devagar
    const entrance = gsap.timeline()
    entrance
      .fromTo(
        faceDiogoRef.current,
        { x: -220, opacity: 0 },
        { x: 0, opacity: 1, duration: 2.4, ease: 'power2.out' },
        0,
      )
      .fromTo(
        faceAmandaRef.current,
        { x: 220, opacity: 0 },
        { x: 0, opacity: 1, duration: 2.4, ease: 'power2.out' },
        0.15,
      )

    gsap.set(brandRef.current, { opacity: 0, scale: 0.9 })
    gsap.set(monogramRef.current, { opacity: 0, y: 16 })
    gsap.set(letteringRef.current, { opacity: 0, y: 16 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * 2.6,
        scrub: 1,
        pin: true,
      },
    })

    tl.to(facesRef.current, { scale: 1.35, opacity: 0, duration: 1, ease: 'power1.in' }, 0)
      .to(brandRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 1.1)
      .to(monogramRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.3)
      .to(letteringRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 1.9)
      .to({}, { duration: 1.1 }, 2.9)

    return () => {
      entrance.kill()
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {canAutoplayVideo ? (
        <video ref={videoRef} className="hero-video" autoPlay loop muted playsInline>
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      ) : (
        <img className="hero-video" src={HERO_FALLBACK_IMAGE} alt="" />
      )}
      <div className="hero-veil" />

      <div className="hero-inner">
        <div className="hero-eyebrow eyebrow eyebrow-line">Vamos casar</div>

        <div className="hero-stage">
          <div className="hero-faces" ref={facesRef}>
            <div className="hero-face" ref={faceDiogoRef}>
              <img src="/images/illustrations/rostos/rosto-diogo.png" alt="Ilustração do rosto de Diogo" />
            </div>
            <div className="hero-face" ref={faceAmandaRef}>
              <img src="/images/illustrations/rostos/rosto-amanda.png" alt="Ilustração do rosto de Amanda" />
            </div>
          </div>

          <div className="hero-brand" ref={brandRef}>
            <img
              className="hero-monogram"
              ref={monogramRef}
              src="/images/illustrations/monograma-diogo-amanda.png"
              alt=""
            />
            <img
              className="hero-lettering"
              ref={letteringRef}
              src="/images/illustrations/lettering-diogo-amanda.png"
              alt="Diogo & Amanda"
            />
          </div>
        </div>

        <p className="hero-sub">Save the date · 2026</p>
      </div>

      <div className="scroll-cue">
        <span>continue scrollando</span>
        <span className="dot" />
      </div>
    </section>
  )
}
