'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const COLOR_PRESETS = [
  { label: 'Purple', tagColor: 'rgba(192,132,252,.8)', iconBg: 'rgba(192,132,252,.1)', borderColor: 'rgba(192,132,252,.15)' },
  { label: 'Green', tagColor: 'rgba(52,211,153,.8)', iconBg: 'rgba(52,211,153,.08)', borderColor: 'rgba(52,211,153,.12)' },
  { label: 'Yellow', tagColor: 'rgba(251,191,36,.85)', iconBg: 'rgba(251,191,36,.08)', borderColor: 'rgba(251,191,36,.12)' },
  { label: 'Blue', tagColor: 'rgba(96,165,250,.8)', iconBg: 'rgba(96,165,250,.08)', borderColor: 'rgba(96,165,250,.12)' },
  { label: 'Red', tagColor: 'rgba(248,113,113,.8)', iconBg: 'rgba(248,113,113,.08)', borderColor: 'rgba(248,113,113,.12)' },
  { label: 'Cyan', tagColor: 'rgba(34,211,238,.8)', iconBg: 'rgba(34,211,238,.08)', borderColor: 'rgba(34,211,238,.12)' },
  { label: 'Orange', tagColor: 'rgba(251,146,60,.8)', iconBg: 'rgba(251,146,60,.08)', borderColor: 'rgba(251,146,60,.12)' },
  { label: 'Pink', tagColor: 'rgba(244,114,182,.8)', iconBg: 'rgba(244,114,182,.08)', borderColor: 'rgba(244,114,182,.12)' },
]

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewCourse() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [colorIdx, setColorIdx] = useState(0)
  const [form, setForm] = useState({
    title: '', description: '', icon: '📚', tag: '',
    price1: 399, price3: 699, price6: 999, published: true,
  })

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) { setErr('Title is required'); return }
    setSaving(true); setErr('')
    const preset = COLOR_PRESETS[colorIdx]
    const course = {
      id: toSlug(form.title),
      ...form,
      ...preset,
      parts: [],
    }
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    if (res.status === 409) { setErr('A course with this title already exists'); setSaving(false); return }
    if (!res.ok) { setErr('Failed to create course'); setSaving(false); return }
    router.push(`/admin/courses/${course.id}`)
  }

  const preset = COLOR_PRESETS[colorIdx]

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/admin/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>← Courses</Link>
        <span style={{ color: 'var(--border-light)' }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text)' }}>New Course</span>
      </div>

      <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, color: 'var(--text)', marginBottom: 24 }}>Create Course</h1>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Preview card */}
        <div className="lg" style={{ borderRadius: 20, padding: 20, border: `1px solid ${preset.borderColor}`, background: 'var(--card-bg)', marginBottom: 4 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>Card Preview</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: preset.iconBg, border: `1px solid ${preset.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{form.icon || '📚'}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: "'Instrument Serif', serif" }}>{form.title || 'Course Title'}</div>
              <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 100, color: preset.tagColor, background: preset.iconBg, border: `1px solid ${preset.borderColor}`, fontWeight: 600 }}>{form.tag || 'TAG'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
          <div>
            <label className="admin-label">Course Title *</label>
            <input className="admin-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Python for Data Science" />
          </div>
          <div>
            <label className="admin-label">Icon</label>
            <input className="admin-input" value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="🎯" style={{ textAlign: 'center', fontSize: 20 }} />
          </div>
        </div>

        <div>
          <label className="admin-label">Description</label>
          <textarea className="admin-input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description shown on the course card" rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
        </div>

        <div>
          <label className="admin-label">Category Tag</label>
          <input className="admin-input" value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="e.g. AI & ML, Dev, Marketing" />
        </div>

        <div>
          <label className="admin-label">Color Theme</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {COLOR_PRESETS.map((p, i) => (
              <button key={i} type="button"
                onClick={() => setColorIdx(i)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: p.tagColor, border: colorIdx === i ? '3px solid var(--text)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}
                title={p.label} />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {([['price1', '1 Month'], ['price3', '3 Months'], ['price6', '6 Months']] as const).map(([key, label]) => (
            <div key={key}>
              <label className="admin-label">Price — {label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>₹</span>
                <input className="admin-input" type="number" value={form[key]} onChange={e => set(key, Number(e.target.value))} style={{ paddingLeft: 26 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#a78bfa' }} />
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>Publish immediately</span>
          </label>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— visible on the homepage</span>
        </div>

        {err && <div style={{ fontSize: 13, color: '#ef4444', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '10px 14px' }}>{err}</div>}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button type="submit" className="btn-primary" disabled={saving} style={{ borderRadius: 12, padding: '11px 28px' }}>
            {saving ? 'Creating...' : 'Create & Edit Content →'}
          </button>
          <Link href="/admin/courses"><button type="button" className="btn-ghost" style={{ borderRadius: 12 }}>Cancel</button></Link>
        </div>
      </form>
    </div>
  )
}
