import { useEffect, useState } from 'react'

const PHOTOS = [
  '/images/fotos-noivado/foto-1-noivado.jpeg',
  '/images/fotos-noivado/foto-2-noivado.jpeg',
  '/images/fotos-noivado/foto-3-noivado.jpeg',
]

const INTERVAL_MS = 3200

export default function NoivadoCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % PHOTOS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="antecip-figure" data-reveal>
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Foto do noivado ${i + 1}`}
          className={`antecip-figure-img${i === active ? ' is-active' : ''}`}
        />
      ))}
    </div>
  )
}
