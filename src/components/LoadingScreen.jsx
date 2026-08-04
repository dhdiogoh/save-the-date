import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const CRITICAL_IMAGES = [
  '/images/illustrations/rostos/rosto-diogo.png',
  '/images/illustrations/rostos/rosto-amanda.png',
  '/images/illustrations/monograma-diogo-amanda.png',
  '/images/illustrations/lettering-diogo-amanda.png',
]

const HERO_VIDEO_URL =
  'https://r7gebaatjirfgncj.public.blob.vercel-storage.com/magnific_animate-this-garden-illus_626MOn6iJO.mp4'

const MIN_VISIBLE_MS = 1800
const VIDEO_TIMEOUT_MS = 4000
const FADE_OUT_MS = 0.6

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = src
  })
}

function preloadVideo(src) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      video.removeEventListener('canplaythrough', finish)
      video.removeEventListener('error', finish)
      resolve()
    }
    const timer = setTimeout(finish, VIDEO_TIMEOUT_MS)
    video.addEventListener('canplaythrough', finish)
    video.addEventListener('error', finish)
    video.preload = 'auto'
    video.muted = true
    video.src = src
  })
}

// testa, num vídeo invisível descartável, se o navegador realmente vai deixar
// tocar sozinho — no iOS com Modo de Baixo Consumo o autoplay é bloqueado
// mesmo com muted+playsInline certos, e isso só se descobre tentando.
function checkVideoAutoplay(src) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = src

    let done = false
    const finish = (canAutoplay) => {
      if (done) return
      done = true
      video.pause()
      video.removeAttribute('src')
      video.load()
      resolve(canAutoplay)
    }

    video
      .play()
      .then(() => finish(true))
      .catch(() => finish(false))

    setTimeout(() => finish(false), VIDEO_TIMEOUT_MS)
  })
}

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const monogramRef = useRef(null)
  const screenRef = useRef(null)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let cancelled = false
    const total = CRITICAL_IMAGES.length + 2
    let loaded = 0

    const bumpProgress = () => {
      loaded += 1
      if (!cancelled) setProgress(Math.round((loaded / total) * 100))
    }

    let canAutoplayVideo = false
    const assetPromises = [
      ...CRITICAL_IMAGES.map((src) => preloadImage(src).then(bumpProgress)),
      preloadVideo(HERO_VIDEO_URL).then(bumpProgress),
      checkVideoAutoplay(HERO_VIDEO_URL).then((canAutoplay) => {
        canAutoplayVideo = canAutoplay
        bumpProgress()
      }),
    ]

    const minTime = new Promise((resolve) => setTimeout(resolve, MIN_VISIBLE_MS))

    Promise.all([Promise.all(assetPromises), minTime]).then(() => {
      if (cancelled) return

      const finish = () => {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        setVisible(false)
        onComplete?.(canAutoplayVideo)
      }

      if (screenRef.current) {
        gsap.to(screenRef.current, { opacity: 0, duration: FADE_OUT_MS, ease: 'power1.out', onComplete: finish })
      } else {
        finish()
      }
    })

    return () => {
      cancelled = true
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [onComplete])

  useEffect(() => {
    if (!monogramRef.current) return undefined
    const tween = gsap.to(monogramRef.current, {
      scale: 1.04,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    return () => tween.kill()
  }, [])

  if (!visible) return null

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ivory"
      style={{ width: '100vw', height: '100vh' }}
    >
      <img
        ref={monogramRef}
        src="/images/illustrations/monograma-diogo-amanda.png"
        alt=""
        className="w-[clamp(96px,22vw,160px)]"
      />
      <div className="h-[2px] w-[120px] overflow-hidden rounded-full bg-sage/25">
        <div
          className="h-full bg-sage transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
