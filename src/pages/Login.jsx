import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Hexagon, LogIn, AlertCircle, Loader2 } from 'lucide-react'

export default function Login() {
    const { login, error, loading } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(username, password)
            navigate('/')
        } catch (err) {
            // Error is handled in context
        }
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)'
        }}>
            <div style={{
                padding: '2.5rem',
                backgroundColor: 'var(--color-bg-element)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                        <Hexagon size={48} fill="currentColor" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-text-main)' }}>Regalis Flow</h1>
                    <p style={{ color: 'var(--color-text-dim)', marginTop: '0.5rem' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-danger)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-danger)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="username" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-primary)',
                                color: 'var(--color-text-main)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s',
                            border: 'none',
                            marginTop: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <LogIn size={20} />
                        )}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-dim)', textAlign: 'center' }}>
                    Need access? Contact your system administrator.
                </p>
            </div>
        </div>
    )
}
