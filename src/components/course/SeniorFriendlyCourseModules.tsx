'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Module } from '@/types/course'

interface SeniorFriendlyCourseModulesProps {
  modules: Module[]
  courseTitle: string
  courseId: string
}

export default function SeniorFriendlyCourseModules({ modules, courseTitle, courseId }: SeniorFriendlyCourseModulesProps) {
  const router = useRouter()

  const icons = ['📚', '💪', '🧘', '🎓', '🏥', '💊', '🎯', '💡']
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-orange-500 to-orange-600'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-5xl">🏥</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{courseTitle}</h1>
              <p className="text-2xl text-gray-600">Self-paced Course</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((module, index) => {
            const icon = icons[index % icons.length]
            const color = colors[index % colors.length]
            
            return (
              <button
                key={module.id}
                onClick={() => {
                  const modulePath = `/course/${courseId}/module/${module.id}`
                  router.push(modulePath)
                }}
                className="w-full bg-white rounded-3xl shadow-xl p-8 border-4 border-transparent hover:border-blue-300 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-6">
                  <div className={`w-24 h-24 bg-gradient-to-r ${color} rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className="text-5xl">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-2xl font-semibold text-gray-500">Module {index + 1}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">{module.title}</h3>
                    <p className="text-xl text-gray-600 mb-4">{module.description}</p>
                    <div className="flex items-center text-blue-600 text-2xl font-semibold mt-4">
                      <span>Start Module</span>
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
