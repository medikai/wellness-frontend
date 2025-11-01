import React from 'react'
import SeniorFriendlyModuleSections from '@/components/course/SeniorFriendlyModuleSections'
import { dummyCourse } from '@/data/dummyCourseData'

interface ModulePageProps {
  params: Promise<{
    courseId: string
    moduleId: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = await params;
  const course = dummyCourse
  const moduleData = course.modules.find(m => m.id === resolvedParams.moduleId)

  if (!moduleData) {
    return <div>Module not found</div>
  }

  return (
    <SeniorFriendlyModuleSections 
      sections={moduleData.sections}
      moduleTitle={moduleData.title}
      courseId={resolvedParams.courseId}
      moduleId={resolvedParams.moduleId}
    />
  )
}
