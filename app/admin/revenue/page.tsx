'use client'
import { useEffect, useState } from 'react'
import type { Customer, Course } from '@/lib/types'

export default function AdminRevenue() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/customers').then(r => r.json()),
      fetch('/api/courses').then(r => r.json()),
    ]).then(([cu, co]) => { setCustomers(cu); setCourses(co); setLoading(false) })
  }, [])

  const paidEnrollments = customers.flatMap(c =>
    c.enrollments.filter(e => !e.isDummy).map(e => ({ ...e, customerName: c.name }))
  ).sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())

  const totalRevenue = paidEnrollments.reduce((s, e) => s + e.amount, 0)

  const revenueByDuration = { 1: 0, 3: 0, 6: 0 } as Record<number, number>
  paidEnrollments.forEach(e => { revenueByDuration[e.duration] = (revenueByDuration[e.duration] || 0) + e.amount })

  const revenueByCourse = paidEnrollments.reduce((acc, e) => {
    acc[e.courseId] = (acc[e.courseId] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const maxCourseRevenue = Math.max(...Object.values(revenueByCourse), 1)

  // Monthly revenue (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('default', { month: 'short' }), revenue: 0 }
  })
  paidEnrollments.forEach(e => {
    const key = e.enrolledAt.slice(0, 7)
    const m = months.find(m => m.key === key)
    if (m) m.revenue += e.amount
  })
  const maxMonthRevenue = Math.max(...months.map(m => m.revenue), 1)

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Revenue</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{paidEnrollments.length} paid enrollment{paidEnrollments.length !== 1 ? 's' : ''}</p>
        </div>
        <a href="/api/export/revenue" download className="btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
          Export to Excel
        </a>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      ) : (
        <>
          {/* Top Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#a78bfa' },
              { label: '1-Month Plans', value: `₹${revenueByDuration[1].toLocaleString('en-IN')}`, color: '#60a5fa' },
              { label: '3-Month Plans', value: `₹${revenueByDuration[3].toLocaleString('en-IN')}`, color: '#34d399' },
              { label: '6-Month Plans', value: `₹${revenueByDuration[6].toLocaleString('en-IN')}`, color: '#fbbf24' },
            ].map(s => (
              <div key={s.label} className="stat-card lg" style={{ borderRadius: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, marginBottom: 14 }} />
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Monthly Chart */}
            <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Monthly Revenue (Last 6 Months)</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
                {months.map(m => (
                  <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {m.revenue > 0 ? `₹${(m.revenue / 1000).toFixed(0)}k` : ''}
                    </div>
                    <div style={{ width: '100%', background: m.revenue > 0 ? 'linear-gradient(180deg, #a78bfa, #7c3aed)' : 'var(--glass-bg)', borderRadius: '4px 4px 0 0', height: `${Math.max((m.revenue / maxMonthRevenue) * 80, m.revenue > 0 ? 8 : 4)}px`, border: '1px solid var(--border-subtle)', transition: 'height 0.3s ease' }} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Course */}
            <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Revenue by Course</div>
              {courses.length === 0 || Object.keys(revenueByCourse).length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No revenue data yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {courses.map(c => {
                    const rev = revenueByCourse[c.id] || 0
                    return (
                      <div key={c.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{c.icon}</span>
                            <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{c.title}</span>
                          </div>
                          <span style={{ fontSize: 12, color: rev > 0 ? '#34d399' : 'var(--text-muted)', fontWeight: 600 }}>₹{rev.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--glass-bg)', borderRadius: 2 }}>
                          <div style={{ height: '100%', background: rev > 0 ? `linear-gradient(90deg, ${c.tagColor}, ${c.tagColor.replace('.75', '.4')})` : 'transparent', borderRadius: 2, width: `${(rev / maxCourseRevenue) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Transactions */}
          <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
              Transactions ({paidEnrollments.length})
            </div>
            {paidEnrollments.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>No paid enrollments yet</div>
            ) : (
              <table className="admin-table" style={{ width: '100%' }}>
                <thead><tr><th>Customer</th><th>Course</th><th>Duration</th><th>Amount</th><th>Date</th></tr></thead>
                <tbody>
                  {paidEnrollments.slice(0, 50).map(e => (
                    <tr key={e.id}>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{e.customerName}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.courseName}</td>
                      <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 500 }}>{e.duration} mo</span></td>
                      <td style={{ fontSize: 13, color: '#34d399', fontWeight: 700 }}>₹{e.amount.toLocaleString('en-IN')}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(e.enrolledAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
