// src/app/course/[courseId]/page.tsx
import React from 'react'
import UnifiedCourseLayout from '@/components/course/UnifiedCourseLayout'
import { dummyCourse } from '@/data/dummyCourseData'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
  searchParams: Promise<{
    module?: string
    section?: string
  }>
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  // For now, we'll use the dummy course. In production, fetch by courseId
  const course = dummyCourse;

  return (
    <UnifiedCourseLayout 
      course={course}
      courseId={resolvedParams.courseId}
      initialModuleId={resolvedSearchParams.module}
      initialSectionId={resolvedSearchParams.section}
    />
  )
}
