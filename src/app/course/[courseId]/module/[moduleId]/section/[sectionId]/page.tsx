import React from 'react'
import CourseraStyleLayout from '@/components/course/CourseraStyleLayout'
import { dummyCourse } from '@/data/dummyCourseData'

interface SectionPageProps {
  params: Promise<{
    courseId: string
    moduleId: string
    sectionId: string
  }>
}

export default async function SectionPage({ params }: SectionPageProps) {
  const resolvedParams = await params
  const course = dummyCourse
  const moduleData = course.modules.find(m => m.id === resolvedParams.moduleId)
  const section = moduleData?.sections.find(s => s.id === resolvedParams.sectionId)

  if (!section) {
    return <div>Section not found</div>
  }

  return (
    // <CourseraStyleLayout 
    //   chapters={section.chapters}
    //   sectionTitle={section.title}
    //   sectionDescription={section.description}
    // />
    <CourseraStyleLayout
      chapters={section.chapters ?? []}
      sectionTitle={section.title}
      sectionDescription={section.description}
    />

  )
}
