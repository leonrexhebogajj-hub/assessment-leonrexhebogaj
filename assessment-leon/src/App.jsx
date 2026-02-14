import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Kontrollon nëse ka një sesion aktiv kur hapet faqja
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Dëgjon për ndryshime (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for confirmation!')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  if (!session) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Video Lab - Login</h1>
        <form>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
          <button onClick={handleLogin}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {session.user.email}</h1>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      <hr />
      {/* Këtu do të shtoni pjesën e Upload-it të videove më vonë */}
      <p>You are now authenticated. You can start building the video features!</p>
    </div>
  )
}

export default App