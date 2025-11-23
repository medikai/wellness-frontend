// src/app/course-dynamic/[courseId]/page.tsx
import React from 'react'
import SelfPacedCourseScreen from '@/components/course-dynamic/SelfPacedCourseScreen'

interface CourseDynamicPageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function CourseDynamicPage(props: CourseDynamicPageProps) {
  const { courseId } = await props.params

  return <SelfPacedCourseScreen courseId={courseId} />
}
