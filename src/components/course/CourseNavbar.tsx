'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Course, Section } from '@/types/course'
import { Icon } from '@/components/ui'

interface CourseNavbarProps {
  course: Course
  selectedModuleId?: string
  selectedSectionId?: string
  onSectionSelect: (moduleId: string, section: Section) => void
  canGoBack: boolean
  onBack: () => void
}

export default function CourseNavbar({
  course,
  selectedModuleId,
  selectedSectionId,
  onSectionSelect,
  canGoBack,
  onBack,
}: CourseNavbarProps) {
  const router = useRouter()

  // Flatten all modules and sections for navbar display
  const allSections: Array<{ moduleId: string; moduleTitle: string; section: Section; index: number }> = []
  
  course.modules.forEach((module) => {
    module.sections.forEach((section, sectionIndex) => {
      allSections.push({
        moduleId: module.id,
        moduleTitle: module.title,
        section,
        index: allSections.length,
      })
    })
  })

  const currentIndex = allSections.findIndex(
    (item) => item.moduleId === selectedModuleId && item.section.id === selectedSectionId
  )

  const handleBack = () => {
    if (canGoBack && currentIndex > 0) {
      const prevItem = allSections[currentIndex - 1]
      onSectionSelect(prevItem.moduleId, prevItem.section)
    } else {
      onBack()
    }
  }

  const getBreadcrumbPath = () => {
    if (!selectedModuleId || !selectedSectionId) return []
    
    const module = course.modules.find(m => m.id === selectedModuleId)
    if (!module) return []
    
    const section = module.sections.find(s => s.id === selectedSectionId)
    if (!section) return []
    
    return [
      { label: course.title, href: null },
      { label: module.title, href: null },
      { label: section.title, href: null },
    ]
  }

  const breadcrumbs = getBreadcrumbPath()

  return (
    <nav className="bg-white border-2 border-neutral-light/80 border-b-4 border-b-neutral-light shadow-lg sticky top-0 z-50">
      {/* Top Bar with Back Button and Course Title */}
      <div className="px-4 py-3 bg-white border-b-2 border-neutral-light/70 border-x-2 border-x-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/classes')}
              className="flex items-center space-x-2 text-sm text-neutral-dark hover:text-teal-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-neutral-light/30 border border-transparent hover:border-neutral-light"
            >
              <Icon name="chevronLeft" size="sm" color="currentColor" />
              <span>Back to Classes</span>
            </button>
            <div className="h-6 w-px bg-neutral-light/60"></div>
            <h1 className="font-bold text-lg text-neutral-dark">{course.title}</h1>
          </div>
          
          {/* Manual Back Button (only for navigation within course) */}
          {canGoBack && currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-3 py-1.5 bg-teal-light/30 hover:bg-teal-light/50 rounded-lg text-sm text-neutral-dark transition-colors border border-teal-light/50 hover:border-teal-light/70"
            >
              <Icon name="chevronLeft" size="sm" color="currentColor" />
              <span>Previous Section</span>
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <div className="px-4 py-2.5 bg-white border-b-2 border-neutral-light/70 border-x-2 border-x-transparent">
          <div className="flex items-center space-x-2 text-sm text-neutral-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <span className={idx === breadcrumbs.length - 1 ? 'text-neutral-dark font-semibold' : 'text-neutral-medium'}>
                  {crumb.label}
                </span>
                {idx < breadcrumbs.length - 1 && (
                  <Icon name="chevronRight" size="xs" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal Navigation Bar */}
      <div className="px-4 py-3 overflow-x-auto bg-white border-b-2 border-neutral-light/70">
        <div className="flex items-center space-x-2 min-w-max">
          {allSections.map((item, idx) => {
            const isSelected = item.moduleId === selectedModuleId && item.section.id === selectedSectionId
            const isCompleted = idx < currentIndex
            const isClickable = idx <= currentIndex // Can only go to current or previous sections (backward navigation only)

            return (
              <button
                key={`${item.moduleId}-${item.section.id}`}
                onClick={() => {
                  if (isClickable) {
                    onSectionSelect(item.moduleId, item.section)
                  }
                }}
                disabled={!isClickable}
                className={`
                  flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border-2
                  ${isSelected
                    ? 'bg-teal-600 text-white shadow-lg scale-105 border-teal-700'
                    : isCompleted
                    ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 border-teal-300 hover:border-teal-400'
                    : isClickable
                    ? 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200 hover:border-teal-300'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50 border-gray-200'
                  }
                `}
                title={!isClickable ? 'Complete previous sections first' : item.section.title}
              >
                {isCompleted && (
                  <Icon name="check" size="sm" color={isSelected ? 'white' : 'teal-primary'} />
                )}
                <span>{item.section.title}</span>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

