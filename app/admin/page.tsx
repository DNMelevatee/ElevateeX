'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Course, Customer } from '@/lib/types'

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/customers').then(r => r.json()),
    ]).then(([c, cu]) => {
      setCourses(c)
      setCustomers(cu)
      setLoading(false)
    })
  }, [])

  const allEnrollments = customers.flatMap(c => c.enrollments)
  const paidEnrollments = allEnrollments.filter(e => !e.isDummy)
  const totalRevenue = paidEnrollments.reduce((s, e) => s + e.amount, 0)
  const recentEnrollments = [...allEnrollments]
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 8)

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${paidEnrollments.length} paid enrollments`, color: '#a78bfa' },
    { label: 'Customers', value: customers.length.toString(), sub: `${allEnrollments.length} total enrollments`, color: '#34d399' },
    { label: 'Active Courses', value: courses.filter(c => c.published).length.toString(), sub: `${courses.length} total courses`, color: '#60a5fa' },
    { label: 'Test Enrollments', value: allEnrollments.filter(e => e.isDummy).length.toString(), sub: 'demo access', color: '#fb923c' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Overview of your platform</p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card lg" style={{ borderRadius: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, marginBottom: 16 }} />
                <div className="stat-value">{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{s.label}</div>
                <div className="stat-label">{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Recent Enrollments */}
            <div className="lg" style={{ borderRadius: 18, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Recent Enrollments</div>
                <Link href="/admin/customers" style={{ fontSize: 11, color: '#a78bfa', textDecoration: 'none' }}>View all →</Link>
              </div>
              {recentEnrollments.length === 0 ? (
                <div style={{ padding: 24, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>No enrollments yet</div>
              ) : (
                <div>
                  {recentEnrollments.map(e => {
                    const cust = customers.find(c => c.enrollments.some(en => en.id === e.id))
                    return (
                      <div key={e.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{cust?.name || 'Unknown'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.courseName} · {e.duration}mo</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {e.isDummy ? (
                            <span style={{ fontSize: 10, background: 'rgba(251,146,60,.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,.2)', borderRadius: 100, padding: '2px 8px', fontWeight: 600 }}>TEST</span>
                          ) : (
                            <span style={{ fontSize: 13, color: '#34d399', fontWeight: 600 }}>₹{e.amount}</span>
                          )}
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(e.enrolledAt).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Courses Overview */}
            <div className="lg" style={{ borderRadius: 18, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Courses</div>
                <Link href="/admin/courses" style={{ fontSize: 11, color: '#a78bfa', textDecoration: 'none' }}>Manage →</Link>
              </div>
              {courses.length === 0 ? (
                <div style={{ padding: 24, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>No courses yet</div>
              ) : (
                <div>
                  {courses.map(c => {
                    const enrollCount = allEnrollments.filter(e => e.courseId === c.id).length
                    return (
                      <Link key={c.id} href={`/admin/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-bg)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: c.iconBg, border: `1px solid ${c.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.parts.length} parts · {enrollCount} enrolled</div>
                          </div>
                          <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: c.published ? 'rgba(52,211,153,.1)' : 'var(--glass-bg)', color: c.published ? '#34d399' : 'var(--text-muted)', border: `1px solid ${c.published ? 'rgba(52,211,153,.2)' : 'var(--border-subtle)'}`, fontWeight: 600 }}>
                            {c.published ? 'Live' : 'Draft'}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
