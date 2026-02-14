import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            alert(error.message)
        }
        setLoading(false)
    }

    const handleSignUp = async (event) => {
        event.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

    return (
        <div>
            <h2>Login</h2>
            <p>Sign in to access your dashboard</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={loading}
                    style={{ marginTop: '10px', background: '#666' }}
                >
                    Sign Up
                </button>
            </form>
        </div>
    )
}