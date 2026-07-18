'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Course, CoursePart, ContentItem } from '@/lib/types'

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

function VideoPlayer({ url }: { url: string }) {
  const ytId = getYouTubeId(url)
  const vmId = getVimeoId(url)
  if (ytId) return <iframe className="video-embed" src={`https://www.youtube.com/embed/${ytId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ border: 'none' }} />
  if (vmId) return <iframe className="video-embed" src={`https://player.vimeo.com/video/${vmId}`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ border: 'none' }} />
  return <video className="video-embed" controls src={url} style={{ borderRadius: 8 }} />
}

function ContentRenderer({ item }: { item: ContentItem }) {
  const typeInfo: Record<string, { icon: string; label: string }> = {
    video: { icon: '🎬', label: 'Video' },
    image: { icon: '🖼️', label: 'Image' },
    pdf: { icon: '📄', label: 'PDF' },
    ppt: { icon: '📊', label: 'Presentation' },
    docx: { icon: '📝', label: 'Document' },
    link: { icon: '🔗', label: 'Link' },
    text: { icon: '✏️', label: 'Notes' },
  }
  const info = typeInfo[item.type] || { icon: '📎', label: item.type }

  return (
    <div className="content-block" style={{ marginBottom: 16 }}>
      <div className="content-block-header">
        <span style={{ fontSize: 16 }}>{info.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{info.label}</div>
        </div>
      </div>
      <div className="content-block-body">
        {item.type === 'video' && item.url && <VideoPlayer url={item.url} />}
        {item.type === 'image' && item.url && <img src={item.url} alt={item.title} style={{ width: '100%', borderRadius: 8, maxHeight: 480, objectFit: 'contain' }} />}
        {item.type === 'pdf' && item.url && (
          <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(item.url)}&embedded=true`} className="pdf-embed" title={item.title} />
        )}
        {(item.type === 'ppt' || item.type === 'docx') && item.url && (
          <div>
            <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.url)}`} className="pdf-embed" title={item.title} />
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#a78bfa', textDecoration: 'none' }}>
              ↓ Download {item.type === 'ppt' ? 'Presentation' : 'Document'}
            </a>
          </div>
        )}
        {item.type === 'link' && item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-block">
            <span style={{ fontSize: 20 }}>🔗</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>{item.url}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>↗</span>
          </a>
        )}
        {item.type === 'text' && item.text && (
          <div className="text-content">{item.text}</div>
        )}
      </div>
    </div>
  )
}

export default function CoursePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const isPreview = searchParams.get('preview') === '1'

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activePart, setActivePart] = useState(0)
  const [completedParts, setCompletedParts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(r => { if (!r.ok) { setNotFound(true); setLoading(false); return null } return r.json() })
      .then(d => { if (d) { setCourse(d); setLoading(false) } })
  }, [id])

  useEffect(() => {
    if (!id) return
    try {
      const saved = localStorage.getItem(`elevate_progress_${id}`)
      if (saved) setCompletedParts(new Set(JSON.parse(saved)))
    } catch {}
  }, [id])

  function completePart(partId: string, nextIdx: number) {
    setCompletedParts(prev => {
      const next = new Set([...prev, partId])
      try { localStorage.setItem(`elevate_progress_${id}`, JSON.stringify([...next])) } catch {}
      return next
    })
    if (course && nextIdx < course.parts.length) {
      setTimeout(() => setActivePart(nextIdx), 300)
    }
  }

  function isPartLocked(idx: number): boolean {
    if (idx === 0) return false
    const prev = course!.parts[idx - 1]
    return !completedParts.has(prev.id)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading course...</div>
    </div>
  )

  if (notFound || !course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 18, color: 'var(--text)', fontWeight: 600, marginBottom: 8 }}>Course not found</div>
        <Link href="/" style={{ fontSize: 13, color: '#a78bfa' }}>← Back to home</Link>
      </div>
    </div>
  )

  const currentPart = course.parts[activePart]
  const locked = currentPart ? isPartLocked(activePart) : false

  return (
    <div className="player-layout">
      {/* Sidebar */}
      <div className="player-sidebar" style={{ background: 'var(--bg)', borderRight: '1px solid var(--border-subtle)' }}>
        {/* Course Header */}
        <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href="/" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>← Home</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: course.iconBg, border: `1px solid ${course.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{course.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{course.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{course.parts.length} parts</div>
            </div>
          </div>
          {/* Progress bar */}
          {course.parts.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 5 }}>
                <span>Progress</span>
                <span>{completedParts.size} / {course.parts.length}</span>
              </div>
              <div style={{ height: 4, background: 'var(--glass-bg)', borderRadius: 2, border: '1px solid var(--border-subtle)' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #34d399)', borderRadius: 2, width: `${(completedParts.size / course.parts.length) * 100}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Parts Navigation */}
        <div style={{ padding: '8px 0', overflowY: 'auto' }}>
          {course.parts.length === 0 ? (
            <div style={{ padding: '20px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>No content yet</div>
          ) : (
            course.parts.map((part, idx) => {
              const done = completedParts.has(part.id)
              const active = idx === activePart
              const lockd = isPartLocked(idx)
              return (
                <div key={part.id}
                  className={`part-nav-item${active ? ' active' : ''}${lockd ? ' locked' : ''}`}
                  onClick={() => { if (!lockd) setActivePart(idx) }}>
                  <div className={`part-num ${done ? 'done' : active ? 'active' : lockd ? 'locked' : 'unlocked'}`}>
                    {done ? '✓' : lockd ? '🔒' : idx + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: lockd ? 'var(--text-muted)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{part.content.length} item{part.content.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {isPreview && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 10, background: 'rgba(251,146,60,.1)', color: '#fb923c', border: '1px solid rgba(251,146,60,.2)', borderRadius: 100, padding: '4px 12px', textAlign: 'center', fontWeight: 700, letterSpacing: '0.08em' }}>PREVIEW MODE</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="player-main">
        {!currentPart ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{course.icon}</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>{course.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.8 }}>{course.description}</p>
            {course.parts.length === 0 && (
              <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 24px', display: 'inline-block' }}>
                Content is being prepared. Check back soon!
              </div>
            )}
          </div>
        ) : locked ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: 'var(--text)', marginBottom: 10 }}>Part Locked</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
              Complete the previous part to unlock <strong style={{ color: 'var(--text)' }}>{currentPart.title}</strong>.
            </p>
            <button className="btn-primary" style={{ borderRadius: 12 }} onClick={() => setActivePart(activePart - 1)}>
              ← Go to Previous Part
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, background: course.iconBg, color: course.tagColor, border: `1px solid ${course.borderColor}`, borderRadius: 100, padding: '2px 10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Part {activePart + 1}</span>
                {completedParts.has(currentPart.id) && <span style={{ fontSize: 10, background: 'rgba(52,211,153,.1)', color: '#34d399', border: '1px solid rgba(52,211,153,.2)', borderRadius: 100, padding: '2px 10px', fontWeight: 700 }}>✓ Completed</span>}
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>{currentPart.title}</h1>
              {currentPart.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{currentPart.description}</p>}
            </div>

            {currentPart.content.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px dashed var(--border-light)', borderRadius: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No content in this part yet</div>
              </div>
            ) : (
              <>
                {currentPart.content.map(item => (
                  <ContentRenderer key={item.id} item={item} />
                ))}
              </>
            )}

            {/* Complete Button */}
            {!completedParts.has(currentPart.id) ? (
              <div style={{ marginTop: 32, padding: '20px', background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.15)', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Done with this part? Mark it complete to unlock the next one.
                </div>
                <button className="btn-primary" style={{ borderRadius: 12, padding: '12px 32px' }}
                  onClick={() => completePart(currentPart.id, activePart + 1)}>
                  {activePart < course.parts.length - 1 ? 'Complete & Continue →' : 'Complete Course ✓'}
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 32, display: 'flex', gap: 10, justifyContent: 'space-between' }}>
                {activePart > 0 && (
                  <button className="btn-ghost" style={{ borderRadius: 12 }} onClick={() => setActivePart(activePart - 1)}>← Previous Part</button>
                )}
                {activePart < course.parts.length - 1 && (
                  <button className="btn-primary" style={{ borderRadius: 12, marginLeft: 'auto' }} onClick={() => setActivePart(activePart + 1)}>Next Part →</button>
                )}
                {activePart === course.parts.length - 1 && (
                  <div style={{ marginLeft: 'auto', fontSize: 13, color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span>
                    Course Complete!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
