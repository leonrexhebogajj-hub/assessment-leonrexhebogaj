import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import VideoUpload from './components/VideoUpload'
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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Video Lab Dashboard</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#dc3545' }}>
          Sign Out
        </button>
      </header>

      <main>
        <p>Welcome, {session.user.email}!</p>
        <hr />

        <VideoUpload session={session} onUploadComplete={() => console.log('Upload refreshed')} />

        {/* We will add the VideoPlayer component here next */}
        <div style={{ marginTop: '40px' }}>
          <h2>Your Videos</h2>
          <p>Video list coming soon...</p>
        </div>
      </main>
    </div>
  )
}

export default App