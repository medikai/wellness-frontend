// src/components/course/ModuleSections.tsx
'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/types/course'

interface ModuleSectionsProps {
  sections: Section[]
  courseId: string
  moduleId: string
}

export default function ModuleSections({ sections, courseId, moduleId }: ModuleSectionsProps) {
  const router = useRouter()

  const handleSectionClick = (sectionId: string) => {
    router.push(`/course/${courseId}/module/${moduleId}/section/${sectionId}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Sections</h2>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-green-300 group"
          >
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                <span className="text-2xl font-bold text-white">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {section.chapters.length} chapter{section.chapters.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-green-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                    View Chapters →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
