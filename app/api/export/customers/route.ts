import * as XLSX from 'xlsx'
import { getCustomers } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const customers = getCustomers()

  // Sheet 1 — one row per customer
  const customerRows = customers.map(c => {
    const paid = c.enrollments.filter(e => !e.isDummy)
    const spent = paid.reduce((s, e) => s + e.amount, 0)
    return {
      Name: c.name,
      Email: c.email,
      Enrollments: c.enrollments.length,
      'Paid Enrollments': paid.length,
      'Total Spent (INR)': spent,
      Joined: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '',
    }
  })

  // Sheet 2 — one row per enrollment
  const enrollmentRows = customers.flatMap(c =>
    c.enrollments.map(e => ({
      Customer: c.name,
      Email: c.email,
      Course: e.courseName,
      'Duration (months)': e.duration,
      'Amount (INR)': e.amount,
      Type: e.isDummy ? 'Test' : 'Paid',
      'Enrolled On': e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-IN') : '',
    }))
  )

  const wb = XLSX.utils.book_new()

  const ws1 = XLSX.utils.json_to_sheet(
    customerRows.length ? customerRows : [{ Name: '', Email: '', Enrollments: '', 'Paid Enrollments': '', 'Total Spent (INR)': '', Joined: '' }]
  )
  ws1['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Customers')

  const ws2 = XLSX.utils.json_to_sheet(
    enrollmentRows.length ? enrollmentRows : [{ Customer: '', Email: '', Course: '', 'Duration (months)': '', 'Amount (INR)': '', Type: '', 'Enrolled On': '' }]
  )
  ws2['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 8 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Enrollments')

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  const date = new Date().toISOString().slice(0, 10)

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="elevateeX-customers-${date}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
