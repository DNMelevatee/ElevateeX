'use client'
import { useState } from 'react'
import Link from 'next/link'

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 60 }}>
    <defs>
      <linearGradient id="sg1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#43C6AC"/><stop offset="100%" stopColor="#4F8EF7"/></linearGradient>
      <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4F8EF7"/><stop offset="50%" stopColor="#7B5EA7"/><stop offset="100%" stopColor="#43C6AC"/></linearGradient>
    </defs>
    <rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="url(#sg1)" strokeWidth="2.5"/>
    <rect x="25" y="25" width="50" height="50" rx="6" fill="url(#sg1)" opacity="0.1"/>
    <line x1="15" y1="32" x2="5" y2="32" stroke="#43C6AC" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="50" x2="5" y2="50" stroke="#43C6AC" strokeWidth="2" strokeLinecap="round"/>
    <line x1="15" y1="68" x2="5" y2="68" stroke="#43C6AC" strokeWidth="2" strokeLinecap="round"/>
    <line x1="85" y1="32" x2="95" y2="32" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="85" y1="50" x2="95" y2="50" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="85" y1="68" x2="95" y2="68" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="35" y1="15" x2="35" y2="5" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="65" y1="15" x2="65" y2="5" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="35" y1="85" x2="35" y2="95" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="65" y1="85" x2="65" y2="95" stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round"/>
    <line x1="50" y1="65" x2="50" y2="36" stroke="url(#sg2)" strokeWidth="4" strokeLinecap="round"/>
    <polyline points="37,50 50,33 63,50" fill="none" stroke="url(#sg2)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="35" cy="66" r="3" fill="#43C6AC"/>
    <circle cx="65" cy="66" r="3" fill="#4F8EF7"/>
  </svg>
)

function getPwdStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (pwd.length >= 12) score = Math.min(score + 1, 3)
  if (pwd.length === 0) return { score: 0, label: '', color: '' }
  if (score === 1) return { score: 1, label: 'Weak', color: '#f87171' }
  if (score === 2) return { score: 2, label: 'Medium', color: '#fbbf24' }
  return { score: 3, label: 'Strong', color: '#43C6AC' }
}

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [cpwd, setCpwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showCpwd, setShowCpwd] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const strength = getPwdStrength(pwd)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (name.trim().length < 2) errs.name = 'Please enter your full name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address'
    if (!/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd)) errs.pwd = 'Min 8 chars with 1 number & 1 special character'
    if (pwd !== cpwd || !cpwd) errs.cpwd = 'Passwords do not match'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) setSuccess(true)
  }

  const clearErr = (key: string) => setErrors(p => { const n = { ...p }; delete n[key]; return n })

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { min-height: 100vh; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .bg-canvas { position: fixed; inset: 0; z-index: 0; background: linear-gradient(135deg, #e0f2fe, #ddd6fe, #d1fae5, #fce7f3, #ede9fe, #cffafe); background-size: 400% 400%; animation: gradShift 12s ease infinite; }
        .orb { position: fixed; border-radius: 50%; filter: blur(60px); opacity: 0.45; z-index: 0; animation: orbFloat 18s ease-in-out infinite; }
        .orb1 { width: 400px; height: 400px; background: radial-gradient(circle, #a5f3fc, #818cf8); top: -100px; left: -100px; }
        .orb2 { width: 350px; height: 350px; background: radial-gradient(circle, #f0abfc, #60a5fa); bottom: -80px; right: -80px; animation-delay: -6s; }
        .orb3 { width: 250px; height: 250px; background: radial-gradient(circle, #6ee7b7, #c4b5fd); top: 50%; left: 50%; animation-delay: -12s; }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,30px) scale(0.95)} }
        @keyframes cardIn { from{opacity:0;transform:translateY(30px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes iconPulse { 0%,100%{box-shadow:0 4px 24px rgba(79,142,247,0.3),0 0 0 1px rgba(67,198,172,0.3)} 50%{box-shadow:0 4px 40px rgba(79,142,247,0.55),0 0 0 2px rgba(67,198,172,0.5)} }
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .sp-container { position:relative;z-index:1;display:flex;width:min(960px,96vw);min-height:600px;border-radius:28px;overflow:hidden;box-shadow:0 8px 60px rgba(79,142,247,0.18),0 2px 20px rgba(123,94,167,0.12);animation:cardIn 0.7s cubic-bezier(.22,1,.36,1) both; }
        .sp-brand { flex:0 0 42%;background:linear-gradient(145deg,rgba(79,142,247,0.18),rgba(123,94,167,0.22),rgba(67,198,172,0.18));backdrop-filter:blur(24px);border-right:1px solid rgba(255,255,255,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 36px;gap:28px;position:relative;overflow:hidden; }
        .sp-brand::before { content:'';position:absolute;inset:0;background:rgba(255,255,255,0.35);backdrop-filter:blur(20px);z-index:-1; }
        .sp-logo-icon { width:90px;height:90px;background:linear-gradient(135deg,#0a0e1a 60%,#1e293b);border-radius:22px;display:flex;align-items:center;justify-content:center;animation:iconPulse 4s ease-in-out infinite; }
        .sp-logo-text { font-family:'Orbitron',monospace;font-size:26px;font-weight:900;background:linear-gradient(135deg,#4F8EF7,#7B5EA7,#43C6AC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px;text-align:center; }
        .sp-logo-text span { color:#43C6AC;-webkit-text-fill-color:#43C6AC; }
        .sp-tagline { font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#7B5EA7;opacity:0.8;text-align:center; }
        .sp-divider { width:60px;height:2px;background:linear-gradient(90deg,#4F8EF7,#43C6AC);border-radius:2px; }
        .sp-desc { font-size:14px;line-height:1.7;color:#475569;text-align:center;max-width:220px; }
        .sp-badges { display:flex;gap:8px;flex-wrap:wrap;justify-content:center; }
        .sp-badge { background:rgba(255,255,255,0.7);border:1px solid rgba(79,142,247,0.25);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;color:#4F8EF7;letter-spacing:0.5px; }
        .sp-form { flex:1;background:rgba(255,255,255,0.72);backdrop-filter:blur(30px);padding:40px 44px;display:flex;flex-direction:column;justify-content:center;gap:4px; }
        .sp-title { font-family:'Orbitron',monospace;font-size:22px;font-weight:700;background:linear-gradient(135deg,#4F8EF7,#7B5EA7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:2px; }
        .sp-sub { font-size:13.5px;color:#94a3b8;margin-bottom:16px; }
        .sp-field { display:flex;flex-direction:column;gap:4px;margin-bottom:12px; }
        .sp-label { font-size:12px;font-weight:600;color:#475569;letter-spacing:0.5px;text-transform:uppercase; }
        .sp-wrap { position:relative; }
        .sp-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none; }
        .sp-input { width:100%;padding:12px 14px 12px 42px;border-radius:12px;border:1.5px solid rgba(203,213,225,0.7);background:rgba(255,255,255,0.8);font-family:'DM Sans',sans-serif;font-size:14px;color:#1e293b;outline:none;transition:border-color 0.25s,box-shadow 0.25s; }
        .sp-input:focus { border-color:#4F8EF7;background:rgba(255,255,255,0.95);box-shadow:0 0 0 3px rgba(79,142,247,0.12); }
        .sp-input.err { border-color:#e53e6d;box-shadow:0 0 0 3px rgba(229,62,109,0.1); }
        .sp-input.ok { border-color:#43C6AC;box-shadow:0 0 0 3px rgba(67,198,172,0.1); }
        .sp-eye { position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;padding:2px;display:flex;transition:color 0.2s; }
        .sp-eye:hover { color:#4F8EF7; }
        .sp-err { font-size:11.5px;color:#e53e6d;min-height:15px;display:flex;align-items:center;gap:4px; }
        .sp-ok { font-size:11.5px;color:#43C6AC;min-height:15px;display:flex;align-items:center;gap:4px; }
        .sp-bars { display:flex;gap:4px;margin-top:3px; }
        .sp-bar { flex:1;height:3px;border-radius:3px;background:#e2e8f0;transition:background 0.3s; }
        .sp-btn { width:100%;padding:14px;border-radius:12px;border:none;cursor:pointer;font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:linear-gradient(135deg,#4F8EF7,#7B5EA7,#43C6AC);color:#fff;margin-top:6px;transition:transform 0.15s,box-shadow 0.25s;box-shadow:0 4px 20px rgba(79,142,247,0.3); }
        .sp-btn:hover { transform:translateY(-1px);box-shadow:0 8px 30px rgba(79,142,247,0.4); }
        .sp-login-link { text-align:center;margin-top:14px;font-size:13px;color:#94a3b8; }
        .sp-login-link a { color:#4F8EF7;font-weight:600;text-decoration:none; }
        .sp-login-link a:hover { color:#7B5EA7; }
        .sp-success { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center; }
        .sp-success-icon { font-size:52px;animation:popIn 0.5s cubic-bezier(.22,1,.36,1); }
        .sp-success-title { font-family:'Orbitron',monospace;font-size:20px;background:linear-gradient(135deg,#4F8EF7,#43C6AC);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        @media(max-width:700px){ .sp-brand{display:none} .sp-form{padding:36px 28px} }
      `}</style>

      <div className="bg-canvas" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="sp-container">
        {/* BRAND */}
        <div className="sp-brand">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="sp-logo-icon"><LogoIcon /></div>
            <div className="sp-logo-text">elevate<span>eX</span></div>
            <div className="sp-tagline">Learn · Build · Elevate</div>
          </div>
          <div className="sp-divider" />
          <p className="sp-desc">Your launchpad for tech skills, IT solutions & career elevation. Join a growing community of builders.</p>
          <div className="sp-badges">
            <span className="sp-badge">🎓 EdTech</span>
            <span className="sp-badge">⚡ IT Solutions</span>
            <span className="sp-badge">🚀 Career Growth</span>
          </div>
        </div>

        {/* FORM */}
        <div className="sp-form">
          {success ? (
            <div className="sp-success">
              <div className="sp-success-icon">🎉</div>
              <div className="sp-success-title">Welcome to ElevateeX!</div>
              <p style={{ color: '#475569', fontSize: 14 }}>Account created successfully. Redirecting…</p>
            </div>
          ) : (
            <>
              <div className="sp-title">Create Account</div>
              <div className="sp-sub">Start your journey with ElevateeX today</div>
              <form onSubmit={handleSubmit} noValidate>

                {/* Full Name */}
                <div className="sp-field">
                  <label className="sp-label">Full Name</label>
                  <div className="sp-wrap">
                    <span className="sp-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                    <input className={`sp-input${errors.name ? ' err' : name.trim().length >= 2 ? ' ok' : ''}`}
                      type="text" placeholder="Your full name" value={name}
                      onChange={e => { setName(e.target.value); clearErr('name') }} />
                  </div>
                  {errors.name && <span className="sp-err">⚠ {errors.name}</span>}
                </div>

                {/* Email */}
                <div className="sp-field">
                  <label className="sp-label">Email Address</label>
                  <div className="sp-wrap">
                    <span className="sp-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg></span>
                    <input className={`sp-input${errors.email ? ' err' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? ' ok' : ''}`}
                      type="email" placeholder="you@example.com" value={email}
                      onChange={e => { setEmail(e.target.value); clearErr('email') }} />
                  </div>
                  {errors.email && <span className="sp-err">⚠ {errors.email}</span>}
                </div>

                {/* Password */}
                <div className="sp-field">
                  <label className="sp-label">Password</label>
                  <div className="sp-wrap">
                    <span className="sp-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                    <input className={`sp-input${errors.pwd ? ' err' : /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(pwd) ? ' ok' : ''}`}
                      type={showPwd ? 'text' : 'password'} placeholder="Min 8 chars, 1 number, 1 symbol" value={pwd}
                      onChange={e => { setPwd(e.target.value); clearErr('pwd') }} />
                    <button type="button" className="sp-eye" onClick={() => setShowPwd(s => !s)}>
                      {showPwd
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {/* Strength bars */}
                  {pwd && (
                    <div className="sp-bars">
                      {[1,2,3].map(i => (
                        <div key={i} className="sp-bar" style={{ background: i <= strength.score ? strength.color : '#e2e8f0' }} />
                      ))}
                    </div>
                  )}
                  {pwd && <span style={{ fontSize: 11, color: strength.color }}>{strength.label}</span>}
                  {errors.pwd && <span className="sp-err">⚠ {errors.pwd}</span>}
                </div>

                {/* Confirm Password */}
                <div className="sp-field">
                  <label className="sp-label">Confirm Password</label>
                  <div className="sp-wrap">
                    <span className="sp-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                    <input className={`sp-input${errors.cpwd ? ' err' : cpwd && cpwd === pwd ? ' ok' : ''}`}
                      type={showCpwd ? 'text' : 'password'} placeholder="Re-enter your password" value={cpwd}
                      onChange={e => { setCpwd(e.target.value); clearErr('cpwd') }} />
                    <button type="button" className="sp-eye" onClick={() => setShowCpwd(s => !s)}>
                      {showCpwd
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.cpwd && <span className="sp-err">⚠ {errors.cpwd}</span>}
                  {!errors.cpwd && cpwd && cpwd === pwd && <span className="sp-ok">✓ Passwords match!</span>}
                </div>

                <button type="submit" className="sp-btn">Create My Account →</button>
              </form>
              <div className="sp-login-link">
                Already have an account? <Link href="/login">Sign In</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
