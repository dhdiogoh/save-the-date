import { useState } from 'react'
import { LenisProvider } from '../context/LenisContext'
import { RevealProvider } from '../context/RevealContext'
import LoadingScreen from '../components/LoadingScreen'
import Hero from '../components/Hero'
import Antecipacao from '../components/Antecipacao'
import Convite from '../components/Convite'
import Local from '../components/Local'
import DressCode from '../components/DressCode'
import PresentesTeaser from '../components/PresentesTeaser'
import RSVPForm from '../components/RSVPForm'
import Encerramento from '../components/Encerramento'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [canAutoplayVideo, setCanAutoplayVideo] = useState(true)

  if (isLoading) {
    return (
      <LoadingScreen
        onComplete={(canAutoplay) => {
          setCanAutoplayVideo(canAutoplay)
          setIsLoading(false)
        }}
      />
    )
  }

  return (
    <LenisProvider>
      <RevealProvider>
        <Hero canAutoplayVideo={canAutoplayVideo} />
        <Antecipacao />
        <Convite />
        <RSVPForm />
        <Local />
        <DressCode />
        <PresentesTeaser />
        <Encerramento />
      </RevealProvider>
    </LenisProvider>
  )
}
