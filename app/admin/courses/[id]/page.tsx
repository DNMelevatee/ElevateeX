'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Course, CoursePart, ContentItem, ContentType } from '@/lib/types'

function genId() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }

const CONTENT_TYPES: { value: ContentType; label: string; icon: string; placeholder: string }[] = [
  { value: 'video', label: 'Video', icon: '🎬', placeholder: 'YouTube/Vimeo URL or direct .mp4 link' },
  { value: 'image', label: 'Image', icon: '🖼️', placeholder: 'Image URL (jpg, png, webp, gif)' },
  { value: 'pdf', label: 'PDF', icon: '📄', placeholder: 'PDF file URL' },
  { value: 'ppt', label: 'PowerPoint', icon: '📊', placeholder: 'PPT/PPTX URL (Google Slides or OneDrive link)' },
  { value: 'docx', label: 'Document', icon: '📝', placeholder: 'DOCX/DOC file URL' },
  { value: 'link', label: 'Link', icon: '🔗', placeholder: 'https://...' },
  { value: 'text', label: 'Text / Notes', icon: '✏️', placeholder: 'Write your notes, instructions or content here...' },
]

const COLOR_PRESETS = [
  { tagColor: 'rgba(192,132,252,.8)', iconBg: 'rgba(192,132,252,.1)', borderColor: 'rgba(192,132,252,.15)' },
  { tagColor: 'rgba(52,211,153,.8)', iconBg: 'rgba(52,211,153,.08)', borderColor: 'rgba(52,211,153,.12)' },
  { tagColor: 'rgba(251,191,36,.85)', iconBg: 'rgba(251,191,36,.08)', borderColor: 'rgba(251,191,36,.12)' },
  { tagColor: 'rgba(96,165,250,.8)', iconBg: 'rgba(96,165,250,.08)', borderColor: 'rgba(96,165,250,.12)' },
  { tagColor: 'rgba(248,113,113,.8)', iconBg: 'rgba(248,113,113,.08)', borderColor: 'rgba(248,113,113,.12)' },
  { tagColor: 'rgba(34,211,238,.8)', iconBg: 'rgba(34,211,238,.08)', borderColor: 'rgba(34,211,238,.12)' },
  { tagColor: 'rgba(251,146,60,.8)', iconBg: 'rgba(251,146,60,.08)', borderColor: 'rgba(251,146,60,.12)' },
  { tagColor: 'rgba(244,114,182,.8)', iconBg: 'rgba(244,114,182,.08)', borderColor: 'rgba(244,114,182,.12)' },
]

export default function CourseBuilder() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [expandedParts, setExpandedParts] = useState<Set<string>>(new Set())
  const [addingContentFor, setAddingContentFor] = useState<string | null>(null)
  const [editingContentFor, setEditingContentFor] = useState<{ partId: string; item: ContentItem } | null>(null)
  const [newContent, setNewContent] = useState<{ type: ContentType; title: string; url: string; text: string }>({ type: 'video', title: '', url: '', text: '' })
  const [previewPartIdx, setPreviewPartIdx] = useState(0)

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(r => { if (!r.ok) router.push('/admin/courses'); return r.json() })
      .then(d => { setCourse(d); setLoading(false) })
  }, [id, router])

  const saveCourse = useCallback(async (updated: Course) => {
    setSaving(true)
    await fetch(`/api/courses/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  function updateCourse(updates: Partial<Course>) {
    if (!course) return
    setCourse(c => ({ ...c!, ...updates }))
  }

  function addPart() {
    if (!course) return
    const newPart: CoursePart = {
      id: genId(), title: 'New Part', description: '',
      order: course.parts.length, content: [],
    }
    const updated = { ...course, parts: [...course.parts, newPart] }
    setCourse(updated)
    setExpandedParts(s => new Set([...s, newPart.id]))
  }

  function updatePart(partId: string, updates: Partial<CoursePart>) {
    if (!course) return
    setCourse(c => ({ ...c!, parts: c!.parts.map(p => p.id === partId ? { ...p, ...updates } : p) }))
  }

  function deletePart(partId: string) {
    if (!confirm('Delete this part?')) return
    if (!course) return
    setCourse(c => ({ ...c!, parts: c!.parts.filter(p => p.id !== partId).map((p, i) => ({ ...p, order: i })) }))
  }

  function movePart(partId: string, dir: -1 | 1) {
    if (!course) return
    const parts = [...course.parts]
    const idx = parts.findIndex(p => p.id === partId)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= parts.length) return
    ;[parts[idx], parts[newIdx]] = [parts[newIdx], parts[idx]]
    setCourse(c => ({ ...c!, parts: parts.map((p, i) => ({ ...p, order: i })) }))
  }

  function startAddContent(partId: string) {
    setAddingContentFor(partId)
    setEditingContentFor(null)
    setNewContent({ type: 'video', title: '', url: '', text: '' })
  }

  function cancelAddContent() {
    setAddingContentFor(null)
    setEditingContentFor(null)
  }

  function saveContent(partId: string) {
    const ct = CONTENT_TYPES.find(t => t.value === newContent.type)!
    if (!newContent.title.trim()) return
    const item: ContentItem = {
      id: genId(),
      type: newContent.type,
      title: newContent.title,
      ...(newContent.type === 'text' ? { text: newContent.text } : { url: newContent.url }),
    }
    if (editingContentFor) {
      updatePart(partId, {
        content: course!.parts.find(p => p.id === partId)!.content.map(c => c.id === editingContentFor.item.id ? item : c),
      })
      setEditingContentFor(null)
    } else {
      updatePart(partId, {
        content: [...(course!.parts.find(p => p.id === partId)?.content || []), item],
      })
      setAddingContentFor(null)
    }
    setNewContent({ type: 'video', title: '', url: '', text: '' })
  }

  function startEditContent(partId: string, item: ContentItem) {
    setEditingContentFor({ partId, item })
    setAddingContentFor(partId)
    setNewContent({ type: item.type, title: item.title, url: item.url || '', text: item.text || '' })
  }

  function deleteContent(partId: string, contentId: string) {
    updatePart(partId, {
      content: course!.parts.find(p => p.id === partId)!.content.filter(c => c.id !== contentId),
    })
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
  if (!course) return null

  const selectedType = CONTENT_TYPES.find(t => t.value === newContent.type)!

  return (
    <div style={{ display: showPreview ? 'grid' : 'block', gridTemplateColumns: showPreview ? '1fr 400px' : undefined, gap: 20, alignItems: 'start' }}>
      {/* EDITOR PANEL */}
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/admin/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13 }}>← Courses</Link>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{course.title}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowPreview(v => !v)} className="btn-ghost" style={{ borderRadius: 10, fontSize: 12 }}>
            {showPreview ? '◀ Hide Preview' : '▶ Show Preview'}
          </button>
          <Link href={`/course/${course.id}?preview=1`} target="_blank">
            <button className="btn-ghost" style={{ borderRadius: 10, fontSize: 12 }}>Open Preview ↗</button>
          </Link>
          <button className="btn-primary" onClick={() => saveCourse(course)} disabled={saving} style={{ borderRadius: 10, minWidth: 80 }}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>

        {/* Course Info */}
        <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', padding: '20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Course Info</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', gap: 10, marginBottom: 10 }}>
            <div>
              <label className="admin-label">Title</label>
              <input className="admin-input" value={course.title} onChange={e => updateCourse({ title: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Icon</label>
              <input className="admin-input" value={course.icon} onChange={e => updateCourse({ icon: e.target.value })} style={{ textAlign: 'center', fontSize: 18 }} />
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label className="admin-label">Description</label>
            <textarea className="admin-input" value={course.description} onChange={e => updateCourse({ description: e.target.value })} rows={2} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label className="admin-label">Category Tag</label>
              <input className="admin-input" value={course.tag} onChange={e => updateCourse({ tag: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label className="admin-label">Color</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {COLOR_PRESETS.map((p, i) => (
                  <button key={i} type="button" onClick={() => updateCourse(p)}
                    style={{ width: 22, height: 22, borderRadius: '50%', background: p.tagColor, border: course.tagColor === p.tagColor ? '2px solid var(--text)' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            {([['price1', '1mo'], ['price3', '3mo'], ['price6', '6mo']] as const).map(([k, l]) => (
              <div key={k}>
                <label className="admin-label">₹ {l}</label>
                <input className="admin-input" type="number" value={course[k]} onChange={e => updateCourse({ [k]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={course.published} onChange={e => updateCourse({ published: e.target.checked })} style={{ accentColor: '#a78bfa' }} />
            <span style={{ fontSize: 13, color: 'var(--text)' }}>Published (visible on homepage)</span>
          </label>
        </div>

        {/* Parts */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Course Parts ({course.parts.length})
          </div>

          {course.parts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '28px', border: '1px dashed var(--border-light)', borderRadius: 14, color: 'var(--text-muted)', fontSize: 13 }}>
              No parts yet. Add your first part below.
            </div>
          )}

          {course.parts.map((part, idx) => {
            const expanded = expandedParts.has(part.id)
            const isAddingHere = addingContentFor === part.id
            return (
              <div key={part.id} className="part-card" style={{ marginBottom: 10 }}>
                {/* Part Header */}
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(167,139,250,.15)', border: '1px solid rgba(167,139,250,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#a78bfa', flexShrink: 0 }}>{idx + 1}</div>
                  <input
                    className="admin-input"
                    value={part.title}
                    onChange={e => updatePart(part.id, { title: e.target.value })}
                    style={{ flex: 1, padding: '6px 10px', fontSize: 13, fontWeight: 600 }}
                    placeholder="Part title..."
                  />
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="btn-ghost" style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11 }} onClick={() => movePart(part.id, -1)} disabled={idx === 0}>↑</button>
                    <button className="btn-ghost" style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11 }} onClick={() => movePart(part.id, 1)} disabled={idx === course.parts.length - 1}>↓</button>
                    <button className="btn-ghost" style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11 }} onClick={() => setExpandedParts(s => { const n = new Set(s); n.has(part.id) ? n.delete(part.id) : n.add(part.id); return n })}>
                      {expanded ? '▲' : '▼'}
                    </button>
                    <button className="btn-danger" style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11 }} onClick={() => deletePart(part.id)}>✕</button>
                  </div>
                </div>

                {/* Part Body */}
                {expanded && (
                  <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ paddingTop: 12, marginBottom: 10 }}>
                      <label className="admin-label">Part Description (optional)</label>
                      <input className="admin-input" value={part.description} onChange={e => updatePart(part.id, { description: e.target.value })} placeholder="Brief description of this part..." style={{ fontSize: 12 }} />
                    </div>

                    {/* Content List */}
                    {part.content.length > 0 && (
                      <div style={{ marginBottom: 10, border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                        {part.content.map((item, ci) => {
                          const ct = CONTENT_TYPES.find(t => t.value === item.type)!
                          return (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderBottom: ci < part.content.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: 'var(--card-bg)' }}>
                              <span style={{ fontSize: 14 }}>{ct.icon}</span>
                              <span style={{ flex: 1, fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{item.title}</span>
                              <span className="type-badge">{ct.label}</span>
                              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }} onClick={() => startEditContent(part.id, item)}>Edit</button>
                              <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }} onClick={() => deleteContent(part.id, item.id)}>✕</button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add Content Form */}
                    {isAddingHere ? (
                      <div style={{ background: 'var(--glass-bg)', borderRadius: 12, padding: 14, border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                          {editingContentFor ? 'Edit Content' : 'Add Content'}
                        </div>
                        {/* Type Picker */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          {CONTENT_TYPES.map(t => (
                            <button key={t.value} type="button"
                              onClick={() => setNewContent(c => ({ ...c, type: t.value }))}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 100, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s', background: newContent.type === t.value ? 'rgba(167,139,250,.15)' : 'var(--card-bg)', border: `1px solid ${newContent.type === t.value ? 'rgba(167,139,250,.4)' : 'var(--border-subtle)'}`, color: newContent.type === t.value ? '#a78bfa' : 'var(--text-muted)' }}>
                              {t.icon} {t.label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div>
                            <label className="admin-label">Title *</label>
                            <input className="admin-input" value={newContent.title} onChange={e => setNewContent(c => ({ ...c, title: e.target.value }))} placeholder={`${selectedType.label} title (shown to student)`} style={{ fontSize: 12 }} />
                          </div>
                          {newContent.type === 'text' ? (
                            <div>
                              <label className="admin-label">Content</label>
                              <textarea className="admin-input" value={newContent.text} onChange={e => setNewContent(c => ({ ...c, text: e.target.value }))} placeholder={selectedType.placeholder} rows={4} style={{ resize: 'vertical', fontSize: 12 }} />
                            </div>
                          ) : (
                            <div>
                              <label className="admin-label">URL</label>
                              <input className="admin-input" value={newContent.url} onChange={e => setNewContent(c => ({ ...c, url: e.target.value }))} placeholder={selectedType.placeholder} style={{ fontSize: 12 }} />
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button className="btn-primary" style={{ borderRadius: 8, padding: '8px 16px', fontSize: 12 }} onClick={() => saveContent(part.id)} disabled={!newContent.title.trim()}>
                            {editingContentFor ? 'Update' : 'Add'}
                          </button>
                          <button className="btn-ghost" style={{ borderRadius: 8, padding: '8px 12px', fontSize: 12 }} onClick={cancelAddContent}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn-ghost" style={{ borderRadius: 8, fontSize: 12, padding: '7px 14px', width: '100%' }} onClick={() => startAddContent(part.id)}>
                        + Add Content
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          <button className="btn-primary" style={{ borderRadius: 12, width: '100%', padding: 12, marginTop: 4 }} onClick={addPart}>
            + Add Part
          </button>
        </div>
      </div>

      {/* PREVIEW PANEL */}
      {showPreview && (
        <div style={{ position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Live Preview</div>
          <div className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
            {/* Preview Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: course.iconBg, border: `1px solid ${course.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{course.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{course.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{course.parts.length} parts</div>
              </div>
            </div>

            {/* Parts List Preview */}
            {course.parts.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>No parts yet</div>
            ) : (
              <>
                <div style={{ padding: '8px 0' }}>
                  {course.parts.map((part, i) => (
                    <div key={part.id} onClick={() => setPreviewPartIdx(i)}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: previewPartIdx === i ? 'rgba(167,139,250,.08)' : 'transparent', borderLeft: `2px solid ${previewPartIdx === i ? '#a78bfa' : 'transparent'}` }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'rgba(52,211,153,.15)' : previewPartIdx === i ? 'rgba(167,139,250,.15)' : 'var(--glass-bg)', border: `1px solid ${i === 0 ? 'rgba(52,211,153,.3)' : previewPartIdx === i ? 'rgba(167,139,250,.3)' : 'var(--border-subtle)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: i === 0 ? '#34d399' : previewPartIdx === i ? '#a78bfa' : 'var(--text-muted)', flexShrink: 0 }}>
                        {i === 0 ? '▶' : i > 0 ? '🔒' : i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.title}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{part.content.length} item{part.content.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Part Content Preview */}
                {course.parts[previewPartIdx] && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', padding: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Part {previewPartIdx + 1} Content
                    </div>
                    {course.parts[previewPartIdx].content.length === 0 ? (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No content in this part</div>
                    ) : (
                      course.parts[previewPartIdx].content.map(item => {
                        const ct = CONTENT_TYPES.find(t => t.value === item.type)!
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'var(--glass-bg)', marginBottom: 6 }}>
                            <span>{ct.icon}</span>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{ct.label}</div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
