import { NextRequest, NextResponse } from 'next/server'
import { getCustomers, saveCustomers } from '@/lib/store'
import type { Customer, Enrollment } from '@/lib/types'

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function POST(req: NextRequest) {
  const { courseId, courseName, duration, amount, isDummy, name, email } = await req.json()

  const customers = getCustomers()
  let customer = customers.find(c => c.email === email)

  const enrollment: Enrollment = {
    id: genId(),
    courseId,
    courseName,
    duration,
    amount: isDummy ? 0 : amount,
    isDummy: !!isDummy,
    enrolledAt: new Date().toISOString(),
    completedParts: [],
  }

  if (customer) {
    customer.enrollments.push(enrollment)
  } else {
    customer = {
      id: genId(),
      name: name || 'Test User',
      email: email || 'test@test.com',
      enrollments: [enrollment],
      createdAt: new Date().toISOString(),
    } as Customer
    customers.push(customer)
  }

  saveCustomers(customers)
  return NextResponse.json({ enrollmentId: enrollment.id, customerId: customer.id })
}
