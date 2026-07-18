'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_PASSWORD = 'admin123'

export default function AdminLogin() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem('elevate_admin', '1')
      router.push('/admin')
    } else {
      setErr('Incorrect password')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div className="lg" style={{ borderRadius: 24, padding: '40px 36px', maxWidth: 380, width: '100%', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div className="lm">E</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>ElevateEx Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sign in to continue</div>
          </div>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              className="admin-input"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr('') }}
              placeholder="Enter admin password"
              autoFocus
            />
            {err && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{err}</div>}
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: 12, marginTop: 4 }}>
            Sign In →
          </button>
        </form>
        <div style={{ marginTop: 20, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
          Default password: admin123
        </div>
      </div>
    </div>
  )
}
