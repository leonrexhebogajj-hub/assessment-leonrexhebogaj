import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Attempting login with:', email)
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            console.log('Login response:', { data, error })

            if (error) {
                alert(error.message)
            } else {
                console.log('Login successful!')
            }
        } catch (err) {
            console.error('Unexpected login error:', err)
            alert('An unexpected error occurred. Check browser console.')
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
        <div className="auth-form-container">
            <div className="auth-logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V12" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 7L12 12L2 7" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h2>Video Lab</h2>
            <p>Access your video analysis workspace below.</p>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={loading}
                    className="btn-secondary"
                >
                    Don't have an account? Sign Up
                </button>
            </form>
        </div>
    )
}