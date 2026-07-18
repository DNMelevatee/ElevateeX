import { NextRequest, NextResponse } from 'next/server'
import { getCourses, saveCourses } from '@/lib/store'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = getCourses().find(c => c.id === id)
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(course)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const courses = getCourses()
  const idx = courses.findIndex(c => c.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  courses[idx] = { ...courses[idx], ...body, id, updatedAt: new Date().toISOString() }
  saveCourses(courses)
  return NextResponse.json(courses[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const courses = getCourses()
  saveCourses(courses.filter(c => c.id !== id))
  return NextResponse.json({ success: true })
}
