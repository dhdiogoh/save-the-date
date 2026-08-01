import { createContext, useContext, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RevealContext = createContext(false)

export function RevealProvider({ children }) {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.classList.add('reveal-ready')
    setReady(true)

    const triggers = []
    gsap.utils.toArray('section').forEach((section) => {
      const items = section.querySelectorAll('[data-reveal]')
      if (!items.length) return

      const tween = gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      })
      const fromTween = gsap.from(items, {
        y: 34,
        duration: 0.9,
        stagger: 0.1,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      })

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      if (fromTween.scrollTrigger) triggers.push(fromTween.scrollTrigger)
    })

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('load', onLoad)
      triggers.forEach((trigger) => trigger.kill())
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])

  return <RevealContext.Provider value={ready}>{children}</RevealContext.Provider>
}

export function useReveal() {
  return useContext(RevealContext)
}
