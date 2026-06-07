'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
})

export const useTheme = () => useContext(ThemeCtx)

// ── Toggle Button ──────────────────────────────────────────────
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        border: isDark
          ? '1px solid rgba(255,255,255,0.15)'
          : '1px solid rgba(0,0,0,0.12)',
        background: isDark
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.9)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.25s ease',
        boxShadow: isDark
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.transform = 'scale(1.1) rotate(12deg)'
        b.style.background = isDark
          ? 'rgba(255,255,255,0.18)'
          : 'rgba(255,255,255,1)'
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.transform = 'scale(1) rotate(0deg)'
        b.style.background = isDark
          ? 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.9)'
      }}
    >
      {isDark ? (
        /* Sun — shown in dark mode to switch to light */
        <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.5" />
          <line x1="12" y1="2"   x2="12" y2="5" />
          <line x1="12" y1="19"  x2="12" y2="22" />
          <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="2"  y1="12" x2="5"  y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22" />
        </svg>
      ) : (
        /* Moon — shown in light mode to switch to dark */
        <svg width="17" height="17" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

// ── Provider ───────────────────────────────────────────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('elevateeX-theme') as Theme | null
    if (saved === 'light' || saved === 'dark') setTheme(saved)
    setMounted(true)
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('elevateeX-theme', next)
      return next
    })
  }

  // Prevent flash of wrong theme on first render
  if (!mounted) {
    return (
      <ThemeCtx.Provider value={{ theme, toggle }}>
        <div data-theme="dark" style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeCtx.Provider>
    )
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeCtx.Provider>
  )
}
