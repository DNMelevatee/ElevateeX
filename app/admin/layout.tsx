'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeProvider'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/revenue', label: 'Revenue', icon: '₹' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') { setReady(true); return }
    if (!localStorage.getItem('elevate_admin')) {
      router.replace('/admin/login')
    } else {
      setReady(true)
    }
  }, [pathname, router])

  if (!ready) return null
  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div style={{ padding: '22px 20px 20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 8 }}>
          <div className="nav-logo" style={{ marginBottom: 2 }}>
            <div className="lm">E</div>ElevateEx
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 35, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Admin Portal</div>
        </div>

        <div style={{ padding: '8px 10px', flex: 1 }}>
          {NAV.map(item => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}
                className={`admin-nav-item${active ? ' active' : ''}`}
                style={{ borderRadius: 10, marginBottom: 2 }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div style={{ padding: '16px 10px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '0 10px' }}><ThemeToggle /></div>
          <button className="btn-ghost" style={{ width: '100%', borderRadius: 10 }}
            onClick={() => { localStorage.removeItem('elevate_admin'); router.push('/admin/login') }}>
            Sign out
          </button>
        </div>
      </nav>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
