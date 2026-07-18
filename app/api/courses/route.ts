import { NextRequest, NextResponse } from 'next/server'
import { getCourses, saveCourses } from '@/lib/store'
import type { Course } from '@/lib/types'

export async function GET() {
  return NextResponse.json(getCourses())
}

export async function POST(req: NextRequest) {
  const body: Course = await req.json()
  const courses = getCourses()
  if (courses.find(c => c.id === body.id)) {
    return NextResponse.json({ error: 'Course ID already exists' }, { status: 409 })
  }
  courses.push({ ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  saveCourses(courses)
  return NextResponse.json(body, { status: 201 })
}
