import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LenisProvider } from '../context/LenisContext'
import { RevealProvider } from '../context/RevealContext'
import AccentIllustration from '../components/AccentIllustration'
import GiftCard from '../components/GiftCard'
import GiftCheckoutModal from '../components/GiftCheckoutModal'
import { supabase } from '../lib/supabaseClient'

export default function Presentes() {
  return (
    <LenisProvider>
      <RevealProvider>
        <PresentesContent />
      </RevealProvider>
    </LenisProvider>
  )
}

function PresentesContent() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [selectedGift, setSelectedGift] = useState(null)

  async function loadGifts() {
    if (!supabase) {
      setLoadError(true)
      setLoading(false)
      return
    }
    const { data, error } = await supabase.from('presentes_progresso').select('*').order('ordem')
    if (error) {
      console.error('[presentes] falha ao carregar lista:', error)
      setLoadError(true)
    } else {
      setGifts(data)
      setLoadError(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadGifts()

    if (!supabase) return undefined

    const channel = supabase
      .channel('presentes-progresso')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presentes' }, () => {
        loadGifts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <section className="gifts-page bg-ivory-2">
      <AccentIllustration
        src="/images/illustrations/sage/presente-illustration.png"
        style={{ top: '6%', left: '5%', transform: 'rotate(-8deg)' }}
        hideMobile={false}
      />
      <AccentIllustration
        src="/images/illustrations/sage/coracao-illustration.png"
        style={{ bottom: '6%', right: '5%', transform: 'rotate(8deg)' }}
        hideMobile={false}
      />

      <div className="wrap gifts-page-wrap">
        <Link className="gifts-back" to="/">
          <svg viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <div className="gifts-head">
          <span className="eyebrow eyebrow-line" data-reveal>
            Lista de Presentes
          </span>
          <h1 className="section-title" data-reveal>
            Presentes para a nossa casa
          </h1>
          <p className="lead gifts-lead" data-reveal>
            Montamos essa lista pensando no que realmente vai nos ajudar a começar essa nova fase em casa. Alguns
            itens podem ser presenteados em cotas — escolha quantas quiser. O pagamento é feito direto pra gente,
            e a barra de progresso de cada item atualiza na hora.
          </p>
        </div>

        {loading && <p className="gifts-status">Carregando lista...</p>}
        {!loading && loadError && (
          <p className="gifts-status">Não conseguimos carregar a lista agora. Tenta recarregar a página.</p>
        )}

        {!loading && !loadError && (
          <div className="gifts-grid">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onSelect={() => setSelectedGift(gift)} />
            ))}
          </div>
        )}
      </div>

      {selectedGift && <GiftCheckoutModal gift={selectedGift} onClose={() => setSelectedGift(null)} />}
    </section>
  )
}
