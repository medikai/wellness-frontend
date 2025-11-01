import React from 'react'
import SeniorFriendlyCourseModules from '@/components/course/SeniorFriendlyCourseModules'
import { dummyCourse } from '@/data/dummyCourseData'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  // For now, we'll use the dummy course. In production, fetch by courseId
  const course = dummyCourse;

  return (
    <SeniorFriendlyCourseModules 
      modules={course.modules}
      courseTitle={course.title}
      courseId={resolvedParams.courseId}
    />
  )
}
