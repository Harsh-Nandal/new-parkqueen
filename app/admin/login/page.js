'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#1a1c2e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 40,
        width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,.4)',
      }}>
        <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>🏨</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', color: '#1a1c2e', margin: '0 0 4px' }}>
          The ParkQueen Hotel
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 13, marginBottom: 28 }}>
          Admin Panel — Sign in to continue
        </p>

        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
            borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="pw" style={{ fontWeight: 600, fontSize: 13, color: '#374151', display: 'block', marginBottom: 6 }}>
              Admin Password
            </label>
            <input
              id="pw"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              style={{
                display: 'block', width: '100%', padding: '11px 14px', fontSize: 14,
                border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#b8912a' : '#cda434',
              color: '#fff', border: 'none', borderRadius: 8, padding: 12,
              fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
