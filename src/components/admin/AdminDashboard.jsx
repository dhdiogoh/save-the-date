import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function formatDate(value) {
  if (!value) return '—'
  return dateFormat.format(new Date(value))
}

export default function AdminDashboard({ session }) {
  const [tab, setTab] = useState('confirmacoes')
  const [confirmacoes, setConfirmacoes] = useState([])
  const [compras, setCompras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoading(true)
      setError('')

      const [rsvpRes, comprasRes] = await Promise.all([
        supabase.from('rsvp_confirmations').select('*').order('criado_em', { ascending: false }),
        supabase
          .from('compras')
          .select('*, presentes(nome)')
          .order('created_at', { ascending: false }),
      ])

      if (cancelled) return

      if (rsvpRes.error || comprasRes.error) {
        console.error('[admin] falha ao carregar dados:', rsvpRes.error || comprasRes.error)
        setError('Não conseguimos carregar os dados. Tenta recarregar a página.')
      } else {
        setConfirmacoes(rsvpRes.data)
        setCompras(comprasRes.data)
      }
      setLoading(false)
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  function handleLogout() {
    supabase.auth.signOut()
  }

  const totalDependentes = confirmacoes.reduce((sum, r) => sum + (r.dependentes?.length || 0), 0)
  const totalPago = compras.filter((c) => c.status === 'pago').reduce((sum, c) => sum + Number(c.valor_total), 0)

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Painel admin</h1>
          <span className="admin-user">{session.user.email}</span>
        </div>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="admin-tabs">
        <button
          type="button"
          className={tab === 'confirmacoes' ? 'active' : ''}
          onClick={() => setTab('confirmacoes')}
        >
          Confirmações ({confirmacoes.length})
        </button>
        <button type="button" className={tab === 'compras' ? 'active' : ''} onClick={() => setTab('compras')}>
          Compras ({compras.length})
        </button>
      </div>

      {loading && <p className="admin-status">Carregando...</p>}
      {!loading && error && <p className="admin-status">{error}</p>}

      {!loading && !error && tab === 'confirmacoes' && (
        <>
          <p className="admin-summary">
            {confirmacoes.length} confirmação(ões) · {totalDependentes} dependente(s)
          </p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Dependentes</th>
                  <th>Confirmado em</th>
                </tr>
              </thead>
              <tbody>
                {confirmacoes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nome}</td>
                    <td>{r.telefone}</td>
                    <td>
                      {r.dependentes && r.dependentes.length > 0
                        ? r.dependentes.map((d) => `${d.nome}${d.idade != null ? ` (${d.idade})` : ''}`).join(', ')
                        : '—'}
                    </td>
                    <td>{formatDate(r.criado_em)}</td>
                  </tr>
                ))}
                {confirmacoes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="admin-empty">
                      Nenhuma confirmação ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && tab === 'compras' && (
        <>
          <p className="admin-summary">
            {compras.length} compra(s) · {currency.format(totalPago)} confirmado(s)
          </p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Presente</th>
                  <th>Comprador</th>
                  <th>Cotas</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Criado em</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.id}>
                    <td>{c.presentes?.nome || '—'}</td>
                    <td>{c.comprador_nome}</td>
                    <td>{c.quantidade_cotas}</td>
                    <td>{currency.format(c.valor_total)}</td>
                    <td>
                      <span className={`admin-status-badge admin-status-${c.status}`}>{c.status}</span>
                    </td>
                    <td>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
                {compras.length === 0 && (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      Nenhuma compra ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
