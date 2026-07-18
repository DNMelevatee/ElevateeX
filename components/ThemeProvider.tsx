'use client'
import { createContext, useContext } from 'react'

// ── Single light theme. Theme switching has been removed. ──
type Theme = 'light'

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

export const useTheme = () => useContext(ThemeCtx)

// Toggle removed — renders nothing so existing usages stay harmless.
export function ThemeToggle() {
  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeCtx.Provider value={{ theme: 'light', toggle: () => {} }}>
      <div data-theme="light">{children}</div>
    </ThemeCtx.Provider>
  )
}
