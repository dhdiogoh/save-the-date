import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AdminLogin from '../components/admin/AdminLogin'
import AdminDashboard from '../components/admin/AdminDashboard'

export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
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
