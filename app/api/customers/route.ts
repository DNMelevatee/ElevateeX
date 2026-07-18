import { NextResponse } from 'next/server'
import { getCustomers } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getCustomers())
}
