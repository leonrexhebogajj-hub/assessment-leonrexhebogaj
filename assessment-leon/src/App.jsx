import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer' // Import the new component
import './App.css'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="container login-container">
        <Auth />
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Video Lab Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#ef4444', width: 'auto' }}>
          Sign Out
        </button>
      </header>

      <main>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#64748b' }}>Logged in as: <strong>{session.user.email}</strong></p>
        </div>

        {/* Pass a key to force re-render if needed, or just let components handle their state */}
        <VideoUpload session={session} onUploadComplete={() => window.location.reload()} />

        <div style={{ marginTop: '4rem' }}>
          <VideoPlayer session={session} />
        </div>
      </main>
    </div>
  )
}

export default App