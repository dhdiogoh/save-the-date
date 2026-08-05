import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (authError) {
      setError('Email ou senha incorretos.')
      setSubmitting(false)
    }
    // sucesso: onAuthStateChange no Admin.jsx cuida do resto
  }

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h1>Painel admin</h1>
        <div className="field">
          <label htmlFor="admin-email">Email</label>
          <input
            type="email"
            id="admin-email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Senha</label>
          <input
            type="password"
            id="admin-password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
