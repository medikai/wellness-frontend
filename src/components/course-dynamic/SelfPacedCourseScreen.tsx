// src/components/course-dynamic/SelfPacedCourseScreen.tsx
'use client'

import React from 'react'
import UnifiedCourseLayout from '@/components/course/UnifiedCourseLayout'
import { useSelfPacedCourse } from '@/modules/self-paced/hooks/useSelfPacedCourse'

interface Props {
  courseId: string
}

export default function SelfPacedCourseScreen({ courseId }: Props) {
  const {
    course,
    loading,
    error,
    initialModuleId,
    initialSectionId
  } = useSelfPacedCourse(courseId)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-medium text-lg">Loading course…</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">
          Failed to load course: {error ?? 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <UnifiedCourseLayout
      course={course}
      courseId={courseId}
      initialModuleId={initialModuleId}
      initialSectionId={initialSectionId}
    />
  )
}
