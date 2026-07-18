import * as XLSX from 'xlsx'
import { getCustomers, getCourses } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const customers = getCustomers()
  const courses = getCourses()
  const courseName = (id: string) => courses.find(c => c.id === id)?.title || id

  // Paid transactions only (real revenue)
  const paid = customers.flatMap(c =>
    c.enrollments.filter(e => !e.isDummy).map(e => ({ ...e, customerName: c.name, customerEmail: c.email }))
  ).sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())

  const totalRevenue = paid.reduce((s, e) => s + e.amount, 0)

  // Breakdown by duration
  const byDuration: Record<number, number> = { 1: 0, 3: 0, 6: 0 }
  paid.forEach(e => { byDuration[e.duration] = (byDuration[e.duration] || 0) + e.amount })

  // Breakdown by course
  const byCourse: Record<string, { revenue: number; count: number }> = {}
  paid.forEach(e => {
    byCourse[e.courseId] = byCourse[e.courseId] || { revenue: 0, count: 0 }
    byCourse[e.courseId].revenue += e.amount
    byCourse[e.courseId].count += 1
  })

  // Sheet 1 — Summary
  const summaryRows: Record<string, string | number>[] = [
    { Metric: 'Total Revenue (INR)', Value: totalRevenue },
    { Metric: 'Paid Enrollments', Value: paid.length },
    { Metric: 'Report Generated', Value: new Date().toLocaleString('en-IN') },
    { Metric: '', Value: '' },
    { Metric: '— Revenue by Duration —', Value: '' },
    { Metric: '1 Month', Value: byDuration[1] || 0 },
    { Metric: '3 Months', Value: byDuration[3] || 0 },
    { Metric: '6 Months', Value: byDuration[6] || 0 },
    { Metric: '', Value: '' },
    { Metric: '— Revenue by Course —', Value: '' },
    ...Object.entries(byCourse).map(([id, v]) => ({ Metric: `${courseName(id)} (${v.count} sales)`, Value: v.revenue })),
  ]

  // Sheet 2 — Transactions
  const txRows = paid.map(e => ({
    Date: e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('en-IN') : '',
    Customer: e.customerName,
    Email: e.customerEmail,
    Course: e.courseName,
    'Duration (months)': e.duration,
    'Amount (INR)': e.amount,
  }))

  const wb = XLSX.utils.book_new()

  const ws1 = XLSX.utils.json_to_sheet(summaryRows)
  ws1['!cols'] = [{ wch: 34 }, { wch: 22 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary')

  const ws2 = XLSX.utils.json_to_sheet(
    txRows.length ? txRows : [{ Date: '', Customer: '', Email: '', Course: '', 'Duration (months)': '', 'Amount (INR)': '' }]
  )
  ws2['!cols'] = [{ wch: 14 }, { wch: 22 }, { wch: 30 }, { wch: 22 }, { wch: 16 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Transactions')

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  const date = new Date().toISOString().slice(0, 10)

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="elevateeX-revenue-${date}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
