import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AccentIllustration from './AccentIllustration'
import { submitRSVP } from '../lib/submitRSVP'
import { WEDDING_INFO } from '../config/wedding'
import { useLenis } from '../context/LenisContext'

gsap.registerPlugin(ScrollTrigger)

function maskPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let out = ''
  if (digits.length > 0) out = '(' + digits.slice(0, 2)
  if (digits.length >= 2) out += ') '
  if (digits.length >= 7) {
    out += digits.slice(2, 7) + '-' + digits.slice(7)
  } else {
    out += digits.slice(2)
  }
  return out
}

function formatDeadline(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

let depCounter = 0

export default function RSVPForm() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dependentes, setDependentes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [successName, setSuccessName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [nomeTouched, setNomeTouched] = useState(false)

  const nomeIncompleto = nome.trim().length > 0 && nome.trim().split(/\s+/).filter(Boolean).length < 2

  const nomeRef = useRef(null)
  const telRef = useRef(null)
  const successRef = useRef(null)
  const settleCleanupRef = useRef(null)
  const lenis = useLenis()

  function handleContinue() {
    const target = document.getElementById('local')
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.4 })
    } else {
      target?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Ao focar um input no mobile, o teclado abre e o navegador (principalmente
  // iOS Safari) faz seu próprio auto-scroll pra revelar o campo — o que, num
  // layout com seções "pinadas" via ScrollTrigger, pode acabar pousando numa
  // seção errada. Não dá pra prevenir esse auto-scroll de forma confiável, então
  // deixamos ele acontecer, esperamos a viewport estabilizar e corrigimos a
  // posição de volta pro campo focado usando o próprio Lenis.
  function handleFormFocus(e) {
    const target = e.target
    if (!lenis || !(target instanceof HTMLElement)) return

    settleCleanupRef.current?.()
    lenis.stop()

    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      lenis.start()
      lenis.scrollTo(target, { offset: -16, immediate: true })
    }

    const vv = window.visualViewport
    const fallback = setTimeout(settle, 350)
    const onViewportResize = () => settle()
    vv?.addEventListener('resize', onViewportResize)

    settleCleanupRef.current = () => {
      clearTimeout(fallback)
      vv?.removeEventListener('resize', onViewportResize)
    }
  }

  function handleFormBlur() {
    settleCleanupRef.current?.()
    settleCleanupRef.current = null
    lenis?.start()
  }

  useEffect(() => {
    if (!submitted || !successRef.current) return
    const tween = gsap.fromTo(
      successRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    )
    ScrollTrigger.refresh()
    return () => tween.kill()
  }, [submitted])

  function addDependente() {
    depCounter += 1
    setDependentes((prev) => [...prev, { id: depCounter, nome: '', idade: '' }])
  }

  function removeDependente(id) {
    setDependentes((prev) => prev.filter((dep) => dep.id !== id))
  }

  function updateDependente(id, field, value) {
    setDependentes((prev) => prev.map((dep) => (dep.id === id ? { ...dep, [field]: value } : dep)))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (nome.trim().split(/\s+/).filter(Boolean).length < 2) {
      nomeRef.current?.focus()
      return
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      telRef.current?.focus()
      return
    }

    const dependentesPayload = dependentes
      .filter((dep) => dep.nome.trim())
      .map((dep) => ({
        nome: dep.nome.trim(),
        idade: dep.idade ? parseInt(dep.idade, 10) : null,
      }))

    const payload = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      dependentes: dependentesPayload,
    }

    setSubmitError('')
    setSubmitting(true)
    try {
      await submitRSVP(payload)
      setSuccessName(payload.nome.split(' ')[0])
      setSubmitted(true)
    } catch (err) {
      setSubmitError('Não conseguimos confirmar agora. Tenta de novo em instantes?')
      console.error('[RSVP] falha ao gravar no Supabase:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rsvp bg-ivory" id="rsvp">
      <AccentIllustration
        src="/images/illustrations/sage/coracao-illustration.png"
        style={{ top: '9%', right: '5%', transform: 'rotate(9deg)' }}
      />
      <AccentIllustration
        src="/images/illustrations/sage/aneis-illustration.png"
        style={{ bottom: '9%', left: '5%', transform: 'rotate(-8deg)' }}
      />

      <div className="wrap">
        <div className="rsvp-head">
          <span className="eyebrow eyebrow-line" data-reveal>
            Confirme sua presença
          </span>
          <h2 className="section-title" data-reveal>
            Vem celebrar com a gente?
          </h2>
          <p className="lead" data-reveal>
            O que mais queremos é ter você com a gente nesse dia. Preencha abaixo para confirmar — vai ser uma
            alegria ter você lá.
          </p>
          <span className="deadline-badge" data-reveal>
            Confirme até {formatDeadline(WEDDING_INFO.rsvpDeadline)}
          </span>
        </div>

        <div className="form-card" data-reveal>
          {!submitted ? (
            <form id="rsvpForm" noValidate onSubmit={handleSubmit} onFocus={handleFormFocus} onBlur={handleFormBlur}>
              <div className="field">
                <label htmlFor="nome">Seu nome completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Como devemos te chamar no convite"
                  autoComplete="name"
                  required
                  ref={nomeRef}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => setNomeTouched(true)}
                />
                {nomeTouched && nomeIncompleto && (
                  <p className="field-error field-error-spaced">
                    Inclui pelo menos o sobrenome, pra gente te reconhecer na lista.
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="telefone">WhatsApp</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(91) 90000-0000"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  ref={telRef}
                  value={telefone}
                  onChange={(e) => setTelefone(maskPhone(e.target.value))}
                />
                <p className="field-hint">
                  Preenchimento individual — se você for casado(a), fique tranquilo(a)! Enviamos esse mesmo link também para
                  confirmar seu cônjuge separadinho. 💛
                </p>
              </div>

              <div className="field">
                <label>Vai levar alguém que não confirma sozinho? (ex.: filhos)</label>
                <div className="dependents" id="dependents">
                  {dependentes.map((dep) => (
                    <div className="dep-row" key={dep.id}>
                      <input
                        type="text"
                        placeholder="Nome"
                        className="dep-nome"
                        aria-label="Nome do dependente"
                        value={dep.nome}
                        onChange={(e) => updateDependente(dep.id, 'nome', e.target.value)}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Idade"
                        className="dep-idade"
                        aria-label="Idade do dependente"
                        maxLength={2}
                        value={dep.idade}
                        onChange={(e) => updateDependente(dep.id, 'idade', e.target.value.replace(/\D/g, ''))}
                      />
                      <button
                        type="button"
                        className="dep-remove"
                        aria-label="Remover"
                        onClick={() => removeDependente(dep.id)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-add-dep" onClick={addDependente}>
                  <span className="plus">+</span> Adicionar criança / dependente
                </button>
              </div>

              {submitError && <p className="field-error">{submitError}</p>}

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Confirmando...' : 'Confirmar presença'}
              </button>
            </form>
          ) : (
            <div className="form-success show" id="formSuccess" ref={successRef}>
              <div className="check">
                <svg viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3>Presença confirmada!</h3>
              <p>
                Que alegria, <span id="successName">{successName || 'amigo(a)'}</span>! Já anotamos você com todo
                carinho. Até outubro. 💛
              </p>
              <button type="button" className="btn-continue" onClick={handleContinue}>
                Ver local, dress code e presentes
                <span className="btn-continue-arrow">↓</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
