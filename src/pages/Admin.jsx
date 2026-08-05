import { useEffect, useState } from 'react'
import { supabaseAdmin } from '../lib/supabaseAdminClient'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabaseAdmin) {
      setSession(null)
      return undefined
    }

    supabaseAdmin.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabaseAdmin.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Carregando...</p>
      </div>
    )
  }

  return <div className="admin-page">{session ? <AdminDashboard session={session} /> : <AdminLogin />}</div>
}
