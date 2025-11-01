'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Module } from '@/types/course'

interface CourseModulesProps {
  modules: Module[]
  courseId: string
}

export default function CourseModules({ modules, courseId }: CourseModulesProps) {
  const router = useRouter()

  const handleModuleClick = (moduleId: string) => {
    router.push(`/course/${courseId}/module/${moduleId}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            onClick={() => handleModuleClick(module.id)}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-blue-300 group"
          >
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">📚</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {module.sections.length} section{module.sections.length !== 1 ? 's' : ''}
              </span>
              <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
