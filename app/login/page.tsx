'use client'
import { useState } from 'react'
import Link from 'next/link'

const LogoIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 60 }}>
    <defs>
      <linearGradient id="lg3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#43C6AC"/><stop offset="100%" stopColor="#4F8EF7"/></linearGradient>
      <linearGradient id="lg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#43C6AC"/><stop offset="50%" stopColor="#7B5EA7"/><stop offset="100%" stopColor="#4F8EF7"/></linearGradient>
    </defs>
    <rect x="15" y="15" width="70" height="70" rx="12" ry="12" fill="none" stroke="url(#lg3)" strokeWidth="2.5"/>
    <rect x="25" y="25" width="50" height="50" rx="6" ry="6" fill="url(#lg3)" opacity="0.1"/>
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
    <line x1="50" y1="65" x2="50" y2="36" stroke="url(#lg4)" strokeWidth="4" strokeLinecap="round"/>
    <polyline points="37,50 50,33 63,50" fill="none" stroke="url(#lg4)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="35" cy="66" r="3" fill="#43C6AC"/>
    <circle cx="65" cy="66" r="3" fill="#4F8EF7"/>
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; pwd?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const errs: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address'
    if (pwd.length < 8) errs.pwd = 'Password must be at least 8 characters'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      // Simulate auth — replace with real API call
      setTimeout(() => setSuccess(true), 400)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { min-height: 100vh; font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .bg-canvas { position: fixed; inset: 0; z-index: 0; background: linear-gradient(135deg, #cffafe, #ede9fe, #d1fae5, #fce7f3, #e0f2fe, #ddd6fe); background-size: 400% 400%; animation: gradShift 14s ease infinite; }
        .orb { position: fixed; border-radius: 50%; filter: blur(60px); opacity: 0.4; z-index: 0; animation: orbFloat 20s ease-in-out infinite; }
        .orb1 { width: 380px; height: 380px; background: radial-gradient(circle, #6ee7b7, #818cf8); bottom: -80px; left: -80px; }
        .orb2 { width: 320px; height: 320px; background: radial-gradient(circle, #a5f3fc, #f0abfc); top: -60px; right: -60px; animation-delay: -7s; }
        .orb3 { width: 220px; height: 220px; background: radial-gradient(circle, #fde68a, #93c5fd); top: 40%; right: 30%; animation-delay: -14s; }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-30px,40px) scale(1.05)} 66%{transform:translate(20px,-30px) scale(0.95)} }
        @keyframes cardIn { from{opacity:0;transform:translateY(30px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes iconPulse { 0%,100%{box-shadow:0 4px 24px rgba(67,198,172,0.3),0 0 0 1px rgba(79,142,247,0.3)} 50%{box-shadow:0 4px 40px rgba(67,198,172,0.55),0 0 0 2px rgba(79,142,247,0.5)} }
        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .lp-container { position:relative;z-index:1;display:flex;width:min(880px,96vw);min-height:520px;border-radius:28px;overflow:hidden;box-shadow:0 8px 60px rgba(67,198,172,0.18),0 2px 20px rgba(123,94,167,0.12);animation:cardIn 0.7s cubic-bezier(.22,1,.36,1) both; }
        .lp-form-panel { flex:1;order:1;background:rgba(255,255,255,0.72);backdrop-filter:blur(30px);padding:52px 48px;display:flex;flex-direction:column;justify-content:center;gap:6px; }
        .lp-brand-panel { flex:0 0 42%;order:2;background:linear-gradient(145deg,rgba(67,198,172,0.18),rgba(123,94,167,0.2),rgba(79,142,247,0.18));backdrop-filter:blur(24px);border-left:1px solid rgba(255,255,255,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 36px;gap:28px;position:relative;overflow:hidden; }
        .lp-brand-panel::before { content:'';position:absolute;inset:0;background:rgba(255,255,255,0.35);backdrop-filter:blur(20px);z-index:-1; }
        .lp-logo-icon { width:90px;height:90px;background:linear-gradient(135deg,#0a0e1a 60%,#1e293b);border-radius:22px;display:flex;align-items:center;justify-content:center;animation:iconPulse 4s ease-in-out infinite; }
        .lp-logo-text { font-family:'Orbitron',monospace;font-size:26px;font-weight:900;background:linear-gradient(135deg,#43C6AC,#7B5EA7,#4F8EF7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px;text-align:center; }
        .lp-logo-text span { color:#4F8EF7;-webkit-text-fill-color:#4F8EF7; }
        .lp-tagline { font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#7B5EA7;opacity:0.8;text-align:center; }
        .lp-divider { width:60px;height:2px;background:linear-gradient(90deg,#43C6AC,#4F8EF7);border-radius:2px; }
        .lp-welcome { background:rgba(255,255,255,0.7);border:1px solid rgba(67,198,172,0.3);border-radius:16px;padding:16px 20px;text-align:center; }
        .lp-welcome-icon { font-size:28px;margin-bottom:6px; }
        .lp-welcome p { font-size:13px;color:#475569;line-height:1.6; }
        .lp-desc { font-size:14px;line-height:1.7;color:#475569;text-align:center;max-width:220px; }
        .lp-title { font-family:'Orbitron',monospace;font-size:22px;font-weight:700;background:linear-gradient(135deg,#43C6AC,#7B5EA7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px; }
        .lp-sub { font-size:13.5px;color:#94a3b8;margin-bottom:28px; }
        .lp-field { display:flex;flex-direction:column;gap:5px;margin-bottom:16px; }
        .lp-label { font-size:12px;font-weight:600;color:#475569;letter-spacing:0.5px;text-transform:uppercase; }
        .lp-input-wrap { position:relative; }
        .lp-input-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;pointer-events:none; }
        .lp-input { width:100%;padding:13px 14px 13px 42px;border-radius:12px;border:1.5px solid rgba(203,213,225,0.7);background:rgba(255,255,255,0.8);font-family:'DM Sans',sans-serif;font-size:14px;color:#1e293b;outline:none;transition:border-color 0.25s,box-shadow 0.25s; }
        .lp-input:focus { border-color:#43C6AC;background:rgba(255,255,255,0.95);box-shadow:0 0 0 3px rgba(67,198,172,0.12); }
        .lp-input.err { border-color:#e53e6d;box-shadow:0 0 0 3px rgba(229,62,109,0.1); }
        .lp-input.ok { border-color:#43C6AC;box-shadow:0 0 0 3px rgba(67,198,172,0.1); }
        .lp-eye { position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94a3b8;padding:2px;display:flex;transition:color 0.2s; }
        .lp-eye:hover { color:#43C6AC; }
        .lp-err { font-size:11.5px;color:#e53e6d;min-height:16px;display:flex;align-items:center;gap:4px; }
        .lp-forgot { display:flex;justify-content:flex-end;margin-top:-8px;margin-bottom:6px; }
        .lp-forgot a { font-size:12px;color:#43C6AC;text-decoration:none;font-weight:500; }
        .lp-forgot a:hover { color:#7B5EA7; }
        .lp-btn { width:100%;padding:14px;border-radius:12px;border:none;cursor:pointer;font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:linear-gradient(135deg,#43C6AC,#7B5EA7,#4F8EF7);background-size:200% 200%;color:#fff;margin-top:10px;transition:transform 0.15s,box-shadow 0.25s;box-shadow:0 4px 20px rgba(67,198,172,0.3); }
        .lp-btn:hover { transform:translateY(-1px);box-shadow:0 8px 30px rgba(67,198,172,0.4); }
        .lp-general-err { background:rgba(229,62,109,0.08);border:1px solid rgba(229,62,109,0.25);border-radius:10px;padding:10px 14px;font-size:13px;color:#e53e6d;display:flex;align-items:center;gap:8px;margin-top:10px; }
        .lp-signup-link { text-align:center;margin-top:20px;font-size:13px;color:#94a3b8; }
        .lp-signup-link a { color:#43C6AC;font-weight:600;text-decoration:none; }
        .lp-signup-link a:hover { color:#4F8EF7; }
        .lp-success { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center; }
        .lp-success-icon { font-size:52px;animation:popIn 0.5s cubic-bezier(.22,1,.36,1); }
        .lp-success-title { font-family:'Orbitron',monospace;font-size:20px;background:linear-gradient(135deg,#43C6AC,#4F8EF7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
        @media(max-width:700px){ .lp-brand-panel{display:none} .lp-form-panel{padding:36px 28px} }
      `}</style>

      <div className="bg-canvas" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <div className="lp-container">
        {/* FORM */}
        <div className="lp-form-panel">
          {success ? (
            <div className="lp-success">
              <div className="lp-success-icon">✅</div>
              <div className="lp-success-title">Signed In!</div>
              <p style={{ color: '#475569', fontSize: 14 }}>Welcome back. Redirecting to your dashboard…</p>
            </div>
          ) : (
            <>
              <div className="lp-title">Welcome Back</div>
              <div className="lp-sub">Sign in to continue your ElevateeX journey</div>
              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="lp-field">
                  <label className="lp-label">Email Address</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                    </span>
                    <input className={`lp-input${errors.email ? ' err' : email && !errors.email ? ' ok' : ''}`}
                      type="email" placeholder="you@example.com" value={email}
                      onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }} />
                  </div>
                  {errors.email && <span className="lp-err">⚠ {errors.email}</span>}
                </div>
                {/* Password */}
                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-input-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input className={`lp-input${errors.pwd ? ' err' : pwd.length >= 8 ? ' ok' : ''}`}
                      type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={pwd}
                      onChange={e => { setPwd(e.target.value); setErrors(p => ({ ...p, pwd: undefined })) }} />
                    <button type="button" className="lp-eye" onClick={() => setShowPwd(s => !s)}>
                      {showPwd
                        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.pwd && <span className="lp-err">⚠ {errors.pwd}</span>}
                </div>
                <div className="lp-forgot"><a href="#">Forgot password?</a></div>
                <button type="submit" className="lp-btn">Sign In →</button>
                {errors.general && <div className="lp-general-err">⚠ {errors.general}</div>}
              </form>
              <div className="lp-signup-link">
                New to ElevateeX? <Link href="/signup">Create an account</Link>
              </div>
            </>
          )}
        </div>

        {/* BRAND */}
        <div className="lp-brand-panel">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="lp-logo-icon"><LogoIcon /></div>
            <div className="lp-logo-text">elevate<span>eX</span></div>
            <div className="lp-tagline">Learn · Build · Elevate</div>
          </div>
          <div className="lp-divider" />
          <div className="lp-welcome">
            <div className="lp-welcome-icon">👋</div>
            <p>Good to see you back!<br />Your skills, courses & progress are waiting.</p>
          </div>
          <p className="lp-desc">Continue from where you left off and keep building towards your goals.</p>
        </div>
      </div>
    </>
  )
}
