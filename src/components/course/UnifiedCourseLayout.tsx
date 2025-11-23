// src/components/course/UnifiedCourseLayout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Course, Section } from '@/types/course'
import { Icon } from '@/components/ui'
import { colors } from '@/design-tokens'
import CourseraStyleLayout from './CourseraStyleLayout'

// Type definitions for vendor-specific fullscreen APIs
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface HTMLElementWithFullscreen extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface UnifiedCourseLayoutProps {
  course: Course
  courseId: string
  initialModuleId?: string
  initialSectionId?: string
}

export default function UnifiedCourseLayout({ 
  course, 
  initialModuleId,
  initialSectionId 
}: UnifiedCourseLayoutProps) {
  const router = useRouter()
  
  // Initialize state from props
  const getInitialState = (): {
    expandedModules: Set<string>
    selectedSection: { moduleId: string; sectionId: string; section: Section } | null
  } => {
    if (initialModuleId && initialSectionId) {
      const foundModule = course.modules.find(m => m.id === initialModuleId)
      const section = foundModule?.sections.find(s => s.id === initialSectionId)
      if (section) {
        return {
          expandedModules: new Set<string>([initialModuleId]),
          selectedSection: { moduleId: initialModuleId, sectionId: initialSectionId, section }
        }
      }
    }
    
    return {
      expandedModules: initialModuleId ? new Set<string>([initialModuleId]) : new Set<string>(),
      selectedSection: null
    }
  }

  const initialState = getInitialState()
  
  // State for accordion - track which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Set<string>>(initialState.expandedModules)
  
  // State for selected section
  const [selectedSection, setSelectedSection] = useState<{
    moduleId: string
    sectionId: string
    section: Section
  } | null>(initialState.selectedSection)

  // State for fullscreen mode
  const [isContentFullscreen, setIsContentFullscreen] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Check if fullscreen is active
  const checkFullscreen = () => {
    const doc = document as DocumentWithFullscreen
    return !!(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = checkFullscreen()
      setIsContentFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  // Handle section click
  const handleSectionClick = (moduleId: string, section: Section) => {
    setSelectedSection({
      moduleId,
      sectionId: section.id,
      section
    })
    // Expand the module if not already expanded
    if (!expandedModules.has(moduleId)) {
      setExpandedModules(new Set([...expandedModules, moduleId]))
    }
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('module', moduleId)
    url.searchParams.set('section', section.id)
    window.history.pushState({}, '', url.toString())
  }

  // Get module icon
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
    const defaultIcons = ['fileText', 'heart', 'gamepad', 'chart', 'users', 'helpCircle']
    return defaultIcons[index % defaultIcons.length]
  }

  // Get section icon
  const getSectionIcon = (title: string, index: number) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('hydration') || titleLower.includes('nutrition')) {
      return 'fileText'
    }
    if (titleLower.includes('movement') || titleLower.includes('physical') || titleLower.includes('exercise')) {
      return 'heart'
    }
    if (titleLower.includes('breathing') || titleLower.includes('mental')) {
      return 'heart'
    }
    if (titleLower.includes('brain') || titleLower.includes('cognitive') || titleLower.includes('game')) {
      return 'gamepad'
    }
    const defaultIcons = ['fileText', 'heart', 'gamepad', 'chart', 'users', 'helpCircle']
    return defaultIcons[index % defaultIcons.length]
  }

  // Gradient colors
  const gradientColors = [
    'from-teal-primary to-teal-dark',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-indigo-500 to-indigo-600',
  ]

  const handleBackClick = () => {
    router.push('/classes')
  }

  const handleToggleFullscreen = async () => {
    try {
      if (!containerRef.current) return

      const isCurrentlyFullscreen = checkFullscreen()
      const doc = document as DocumentWithFullscreen
      const element = containerRef.current as HTMLElementWithFullscreen

      if (isCurrentlyFullscreen) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen()
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen()
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen()
        }
      } else {
        // Enter fullscreen - make the entire layout fullscreen (including sidebar)
        if (element.requestFullscreen) {
          await element.requestFullscreen()
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen()
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen()
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex">
      {/* Left Sidebar - Modules with Accordion Sections */}
      <div className="w-80 bg-white border-r border-neutral-light/50 shadow-sm flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b border-neutral-light/50 bg-gradient-to-br from-teal-primary to-teal-dark">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-white hover:text-teal-light font-semibold text-sm mb-4 group transition-colors duration-200"
          >
            <Icon name="chevronLeft" size="sm" color="white" className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Course</span>
          </button>
          <h2 className="text-lg font-bold text-white mb-1">{course.title}</h2>
          <p className="text-teal-light text-xs">Self-paced Course</p>
        </div>

        {/* Scrollable Module List with Accordion */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {course.modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id)
              const moduleIcon = getModuleIcon(module.title, moduleIndex)
              const moduleGradient = gradientColors[moduleIndex % gradientColors.length]
              
              return (
                <div key={module.id} className="border border-neutral-light/50 rounded-2xl overflow-hidden">
                  {/* Module Header - Clickable to expand/collapse */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full text-left p-4 bg-white hover:bg-teal-light/20 transition-all duration-200 flex items-center space-x-3 group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${moduleGradient}`}>
                      <Icon name={moduleIcon} size="sm" color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <span className="text-xs font-semibold text-teal-primary">Module {moduleIndex + 1}</span>
                      </div>
                      <h3 className="font-bold text-sm text-neutral-dark">
                        {module.title}
                      </h3>
                    </div>
                    <Icon 
                      name={isExpanded ? "chevronUp" : "chevronDown"} 
                      size="sm" 
                      color={colors.neutral.medium}
                      className="transition-transform duration-200"
                    />
                  </button>

                  {/* Sections - Accordion Content */}
                  {isExpanded && (
                    <div className="bg-neutral-light/30 p-2 space-y-1">
                      <p className="text-xs font-semibold text-neutral-medium px-2 mb-2">Choose a section to learn</p>
                      {module.sections.map((section, sectionIndex) => {
                        const isSelected = selectedSection?.sectionId === section.id
                        const sectionIcon = getSectionIcon(section.title, sectionIndex)
                        const sectionGradient = gradientColors[sectionIndex % gradientColors.length]
                        
                        return (
                          <button
                            key={section.id}
                            onClick={() => handleSectionClick(module.id, section)}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start space-x-3 group ${
                              isSelected
                                ? 'bg-gradient-to-r from-teal-primary to-teal-dark text-white shadow-md border-2 border-teal-dark'
                                : 'bg-white hover:bg-teal-light/30 border-2 border-transparent hover:border-teal-light'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected 
                                ? 'bg-white/20' 
                                : `bg-gradient-to-br ${sectionGradient}`
                            }`}>
                              <Icon 
                                name={sectionIcon} 
                                size="sm" 
                                color={isSelected ? 'white' : 'white'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-light' : 'text-neutral-medium'}`}>
                                  Section {sectionIndex + 1}
                                </span>
                                {isSelected && (
                                  <span className="text-xs bg-white text-teal-primary px-2 py-0.5 rounded-full font-semibold">
                                    Current
                                  </span>
                                )}
                              </div>
                              <h3 className={`font-bold text-sm mb-1 ${isSelected ? 'text-white' : 'text-neutral-dark'}`}>
                                {section.title}
                              </h3>
                              <p className={`text-xs line-clamp-2 ${isSelected ? 'text-teal-light' : 'text-neutral-medium'}`}>
                                {section.description}
                              </p>
                              {!isSelected && (
                                <div className="flex items-center text-teal-primary font-semibold text-xs mt-2">
                                  <span>Start Learning</span>
                                  <Icon name="chevronRight" size="sm" color={colors.teal.primary} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Section Content */}
      <div className="flex-1 overflow-hidden">
        {selectedSection ? (
          <CourseraStyleLayout
            chapters={selectedSection.section.chapters}
            sectionTitle={selectedSection.section.title}
            sectionDescription={selectedSection.section.description}
            onFullscreenChange={setIsContentFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isContentFullscreen}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-background">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <Icon name="heart" size="lg" color="white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-dark mb-2">Welcome to {course.title}</h3>
              <p className="text-neutral-medium mb-6">Select a section from the left sidebar to start learning</p>
              <p className="text-sm text-teal-primary">Click on a module to expand and see available sections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

