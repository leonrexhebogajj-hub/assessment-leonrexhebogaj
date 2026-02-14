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
      <div className="login-wrapper">
        <div className="auth-card">
          <Auth />
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Video Lab</h1>
        <button onClick={() => supabase.auth.signOut()} className="btn-danger">
          Sign Out
        </button>
      </header>

      <main>
        <VideoUpload session={session} onUploadComplete={() => window.location.reload()} />

        <VideoPlayer session={session} />
      </main>
    </div>
  )
}

export default App