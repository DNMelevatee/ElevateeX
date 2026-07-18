import fs from 'fs'
import path from 'path'
import type { Course, Customer } from './types'

const DATA = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true })
}

function r<T>(file: string, def: T): T {
  ensureDir()
  const fp = path.join(DATA, file)
  if (!fs.existsSync(fp)) { w(file, def); return def }
  try { return JSON.parse(fs.readFileSync(fp, 'utf-8')) } catch { return def }
}

function w<T>(file: string, d: T) {
  ensureDir()
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(d, null, 2), 'utf-8')
}

const DEFAULT_COURSES: Course[] = [
  { id: 'generative-ai', title: 'Generative AI', description: 'Prompt engineering, LLMs, RAG pipelines, and building AI-powered apps from scratch.', icon: '🤖', tag: 'AI & ML', tagColor: 'rgba(192,132,252,.75)', iconBg: 'rgba(192,132,252,.08)', borderColor: 'rgba(192,132,252,.12)', price1: 399, price3: 699, price6: 999, published: true, parts: [], createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'web-development', title: 'Web Development', description: 'HTML, CSS, JavaScript, React & Node.js. Build and deploy full-stack web apps.', icon: '🌐', tag: 'Dev', tagColor: 'rgba(52,211,153,.75)', iconBg: 'rgba(52,211,153,.06)', borderColor: 'rgba(52,211,153,.1)', price1: 399, price3: 699, price6: 999, published: true, parts: [], createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'digital-marketing', title: 'Digital Marketing', description: 'SEO, social media, content strategy, and analytics to grow brands online.', icon: '📈', tag: 'Marketing', tagColor: 'rgba(251,191,36,.75)', iconBg: 'rgba(251,191,36,.06)', borderColor: 'rgba(251,191,36,.1)', price1: 399, price3: 699, price6: 999, published: true, parts: [], createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'java-programming', title: 'Java Programming', description: 'Core Java, OOP, data structures, Spring Boot basics and backend development.', icon: '☕', tag: 'Backend', tagColor: 'rgba(96,165,250,.75)', iconBg: 'rgba(96,165,250,.06)', borderColor: 'rgba(96,165,250,.1)', price1: 399, price3: 699, price6: 999, published: true, parts: [], createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'cpp-fundamentals', title: 'C++ Fundamentals', description: 'Pointers, memory, STL, algorithms and competitive programming preparation.', icon: '⚡', tag: 'Systems', tagColor: 'rgba(248,113,113,.75)', iconBg: 'rgba(248,113,113,.06)', borderColor: 'rgba(248,113,113,.1)', price1: 399, price3: 699, price6: 999, published: true, parts: [], createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
]

export const getCourses = (): Course[] => r('courses.json', DEFAULT_COURSES)
export const saveCourses = (d: Course[]) => w('courses.json', d)
export const getCustomers = (): Customer[] => r('customers.json', [])
export const saveCustomers = (d: Customer[]) => w('customers.json', d)
