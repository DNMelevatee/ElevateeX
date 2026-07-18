export type ContentType = 'video' | 'image' | 'pdf' | 'ppt' | 'docx' | 'link' | 'text'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  url?: string
  text?: string
}

export interface CoursePart {
  id: string
  title: string
  description: string
  order: number
  content: ContentItem[]
}

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  tag: string
  tagColor: string
  iconBg: string
  borderColor: string
  price1: number
  price3: number
  price6: number
  published: boolean
  parts: CoursePart[]
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: string
  courseId: string
  courseName: string
  duration: 1 | 3 | 6
  amount: number
  isDummy: boolean
  enrolledAt: string
  completedParts: string[]
}

export interface Customer {
  id: string
  name: string
  email: string
  enrollments: Enrollment[]
  createdAt: string
}
