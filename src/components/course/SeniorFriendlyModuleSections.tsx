'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/types/course'

interface SeniorFriendlyModuleSectionsProps {
  sections: Section[]
  moduleTitle: string
  courseId: string
  moduleId: string
}

export default function SeniorFriendlyModuleSections({ sections, moduleTitle, courseId, moduleId }: SeniorFriendlyModuleSectionsProps) {
  const router = useRouter()

  const icons = ['📚', '💪', '🧘', '🎓', '🏥', '💊']
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-indigo-500 to-indigo-600'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{moduleTitle}</h1>
          <p className="text-2xl text-gray-600 mb-6">Choose a section to learn</p>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 text-2xl font-semibold flex items-center space-x-3"
          >
            <span className="text-3xl">←</span>
            <span>Back to Course</span>
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const icon = icons[index % icons.length]
            const color = colors[index % colors.length]
            
            return (
              <button
                key={section.id}
                onClick={() => {
                  const sectionPath = `/course/${courseId}/module/${moduleId}/section/${section.id}`
                  router.push(sectionPath)
                }}
                className="w-full bg-white rounded-3xl shadow-xl p-8 border-4 border-transparent hover:border-blue-300 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-24 h-24 bg-gradient-to-r ${color} rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className="text-5xl">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-2xl font-semibold text-gray-500">Section {index + 1}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">{section.title}</h3>
                    <p className="text-xl text-gray-600 mb-4">{section.description}</p>
                    <div className="flex items-center text-blue-600 text-2xl font-semibold mt-4">
                      <span>Start Learning</span>
                      <span className="ml-3 text-3xl">→</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
