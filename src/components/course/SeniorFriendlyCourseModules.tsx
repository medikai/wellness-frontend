'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Module } from '@/types/course'
import { Icon } from '@/components/ui'
import { colors } from '@/design-tokens'

interface SeniorFriendlyCourseModulesProps {
  modules: Module[]
  courseTitle: string
  courseId: string
}

export default function SeniorFriendlyCourseModules({ modules, courseTitle, courseId }: SeniorFriendlyCourseModulesProps) {
  const router = useRouter()

  // Map modules to appropriate icons
  const getModuleIcon = (title: string, index: number) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('fundamental') || titleLower.includes('health')) {
      return 'fileText'
    }
    if (titleLower.includes('mental') || titleLower.includes('wellness') || titleLower.includes('waylness')) {
      return 'heart'
    }
    if (titleLower.includes('cognitive') || titleLower.includes('brain')) {
      return 'gamepad'
    }
    // Default icons based on index
    const defaultIcons = ['fileText', 'heart', 'gamepad', 'chart', 'users', 'helpCircle']
    return defaultIcons[index % defaultIcons.length]
  }

  // Gradient colors matching the design system
  const gradientColors = [
    'from-teal-primary to-teal-dark',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-indigo-500 to-indigo-600',
  ]

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6 border border-neutral-light/50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon name="heart" size="lg" color="white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-dark mb-1">{courseTitle}</h1>
              <p className="text-base lg:text-lg text-teal-primary font-medium">Self-paced Course</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((module, index) => {
            const iconName = getModuleIcon(module.title, index)
            const gradientColor = gradientColors[index % gradientColors.length]
            
            return (
              <button
                key={module.id}
                onClick={() => {
                  const modulePath = `/course/${courseId}/module/${module.id}`
                  router.push(modulePath)
                }}
                className="w-full bg-white rounded-2xl shadow-md p-6 border-2 border-transparent hover:border-teal-light hover:shadow-lg transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradientColor} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                    <Icon name={iconName} size="lg" color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <span className="text-sm font-semibold text-teal-primary">Module {index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-dark mb-2 group-hover:text-teal-primary transition-colors duration-200">
                      {module.title}
                    </h3>
                    <p className="text-sm text-neutral-medium mb-3 line-clamp-2">{module.description}</p>
                    <div className="flex items-center text-teal-primary font-semibold text-sm mt-2">
                      <span>Start Module</span>
                      <Icon name="chevronRight" size="sm" color={colors.teal.primary} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
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
