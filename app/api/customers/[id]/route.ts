import { NextRequest, NextResponse } from 'next/server'
import { getCustomers, saveCustomers } from '@/lib/store'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = getCustomers().find(c => c.id === id)
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(customer)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  saveCustomers(getCustomers().filter(c => c.id !== id))
  return NextResponse.json({ success: true })
}
