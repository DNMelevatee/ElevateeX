'use client'
import { useEffect, useState } from 'react'
import type { Customer } from '@/lib/types'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Customer | null>(null)

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(d => { setCustomers(d); setLoading(false) })
  }, [])

  async function deleteCustomer(id: string) {
    if (!confirm('Remove this customer? Their enrollment data will be deleted.')) return
    await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    setCustomers(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const totalRevenue = customers.flatMap(c => c.enrollments).filter(e => !e.isDummy).reduce((s, e) => s + e.amount, 0)

  return (
    <div>
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Customers</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{customers.length} customer{customers.length !== 1 ? 's' : ''} · ₹{totalRevenue.toLocaleString('en-IN')} total revenue</p>
        </div>
        <a href="/api/export/customers" download className="btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
          Export to Excel
        </a>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      ) : customers.length === 0 ? (
        <div className="lg" style={{ borderRadius: 18, padding: 48, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 15, color: 'var(--text)', marginBottom: 6, fontWeight: 500 }}>No customers yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Customers will appear here after enrolling in a course</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16, alignItems: 'start' }}>
          <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Enrollments</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => {
                  const paid = c.enrollments.filter(e => !e.isDummy)
                  const spent = paid.reduce((s, e) => s + e.amount, 0)
                  return (
                    <tr key={c.id} style={{ cursor: 'pointer', background: selected?.id === c.id ? 'rgba(167,139,250,.06)' : 'transparent' }}
                      onClick={() => setSelected(s => s?.id === c.id ? null : c)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{c.enrollments.length}</span>
                        {c.enrollments.some(e => e.isDummy) && (
                          <span style={{ fontSize: 9, marginLeft: 6, background: 'rgba(251,146,60,.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,.2)', borderRadius: 100, padding: '1px 6px', fontWeight: 700 }}>+TEST</span>
                        )}
                      </td>
                      <td style={{ fontSize: 13, color: spent > 0 ? '#34d399' : 'var(--text-muted)', fontWeight: spent > 0 ? 600 : 400 }}>
                        {spent > 0 ? `₹${spent.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button className="btn-danger" style={{ borderRadius: 8, fontSize: 11 }} onClick={e => { e.stopPropagation(); deleteCustomer(c.id) }}>Remove</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Customer Detail Panel */}
          {selected && (
            <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', position: 'sticky', top: 20 }}>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Enrollments</div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#fff', fontWeight: 700 }}>
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selected.email}</div>
                  </div>
                </div>
              </div>
              {selected.enrollments.length === 0 ? (
                <div style={{ padding: 20, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>No enrollments</div>
              ) : (
                selected.enrollments.map(e => (
                  <div key={e.id} style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{e.courseName}</div>
                      {e.isDummy ? (
                        <span style={{ fontSize: 9, background: 'rgba(251,146,60,.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,.2)', borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>TEST</span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>₹{e.amount}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                      <span>{e.duration} month{e.duration > 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{new Date(e.enrolledAt).toLocaleDateString('en-IN')}</span>
                      <span>·</span>
                      <span>{e.completedParts.length} parts done</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
