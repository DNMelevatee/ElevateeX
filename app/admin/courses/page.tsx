'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/lib/types'

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => { setCourses(d); setLoading(false) })
  }, [])

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/courses/${id}`, { method: 'DELETE' })
    setCourses(prev => prev.filter(c => c.id !== id))
    setDeleting(null)
  }

  async function togglePublish(course: Course) {
    const updated = { ...course, published: !course.published }
    await fetch(`/api/courses/${course.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setCourses(prev => prev.map(c => c.id === course.id ? updated : c))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: 'var(--text)', marginBottom: 4 }}>Courses</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/courses/new">
          <button className="btn-primary">+ New Course</button>
        </Link>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
      ) : courses.length === 0 ? (
        <div className="lg" style={{ borderRadius: 18, padding: 48, textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 15, color: 'var(--text)', marginBottom: 8, fontWeight: 500 }}>No courses yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first course to get started</div>
          <Link href="/admin/courses/new"><button className="btn-primary">+ Create Course</button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {courses.map(c => (
            <div key={c.id} className="lg" style={{ borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: c.iconBg, border: `1px solid ${c.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{c.parts.length}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Parts</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>₹{c.price3}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>3mo price</div>
                </div>
                <button
                  onClick={() => togglePublish(c)}
                  style={{ fontSize: 10, padding: '4px 12px', borderRadius: 100, background: c.published ? 'rgba(52,211,153,.1)' : 'var(--glass-bg)', color: c.published ? '#34d399' : 'var(--text-muted)', border: `1px solid ${c.published ? 'rgba(52,211,153,.25)' : 'var(--border-light)'}`, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {c.published ? '● Live' : '○ Draft'}
                </button>
                <Link href={`/admin/courses/${c.id}`}>
                  <button className="btn-ghost" style={{ borderRadius: 10, padding: '7px 14px' }}>Edit</button>
                </Link>
                <Link href={`/course/${c.id}?preview=1`} target="_blank">
                  <button className="btn-ghost" style={{ borderRadius: 10, padding: '7px 14px' }}>Preview</button>
                </Link>
                <button className="btn-danger" style={{ borderRadius: 10 }}
                  onClick={() => deleteCourse(c.id)}
                  disabled={deleting === c.id}>
                  {deleting === c.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
