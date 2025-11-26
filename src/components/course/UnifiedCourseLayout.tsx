'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Course,
  Section,
  Chapter,
} from '@/types/course'

// import { Icon, Button } from '@/components/ui'
import { Icon } from '@/components/ui'
// import { colors } from '@/design-tokens'
import CourseraStyleLayout from './CourseraStyleLayout'

interface SectionWithChapters extends Section {
  chapters: Chapter[]
}

interface SelectedSectionState {
  moduleId: string
  sectionId: string
  section: SectionWithChapters
}

interface DocumentWithFS extends Document {
  webkitFullscreenElement?: Element | null
  mozFullScreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface HTMLElementWithFS extends HTMLElement {
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
  initialSectionId,
}: UnifiedCourseLayoutProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const computeInitialState = () => {
    if (initialModuleId && initialSectionId) {
      const mod = course.modules.find((m) => m.id === initialModuleId)
      const sec = mod?.sections.find((s) => s.id === initialSectionId)

      if (sec && Array.isArray(sec.chapters)) {
        return {
          expandedModules: new Set([initialModuleId]),
          selectedSection: {
            moduleId: initialModuleId,
            sectionId: initialSectionId,
            section: sec as SectionWithChapters,
          } as SelectedSectionState,
        }
      }
    }

    return {
      expandedModules: new Set<string>(),
      selectedSection: null as SelectedSectionState | null,
    }
  }

  const {
    expandedModules: initExpanded,
    selectedSection: initSel,
  } = computeInitialState()

  const [expandedModules, setExpandedModules] = useState<Set<string>>(initExpanded)
  const [selectedSection, setSelectedSection] = useState<SelectedSectionState | null>(initSel)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sectionLoading, setSectionLoading] = useState(false)
  const [sectionError, setSectionError] = useState<string | null>(null)

  const checkFullscreen = (): boolean => {
    const doc = document as DocumentWithFS
    return Boolean(
      document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement,
    )
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(checkFullscreen())

    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    document.addEventListener('mozfullscreenchange', handler)
    document.addEventListener('MSFullscreenChange', handler)

    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
      document.removeEventListener('mozfullscreenchange', handler)
      document.removeEventListener('MSFullscreenChange', handler)
    }
  }, [])

  const toggleFullscreen = async () => {
    const el = containerRef.current as HTMLElementWithFS | null
    if (!el) return

    const doc = document as DocumentWithFS

    if (checkFullscreen()) {
      if (document.exitFullscreen) await document.exitFullscreen()
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen()
      else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen()
      else if (doc.msExitFullscreen) await doc.msExitFullscreen()
    } else {
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
      else if (el.mozRequestFullScreen) await el.mozRequestFullScreen()
      else if (el.msRequestFullscreen) await el.msRequestFullscreen()
    }
  }

  const toggleModule = (moduleId: string) => {
    const newSet = new Set(expandedModules)
    if (newSet.has(moduleId)) newSet.delete(moduleId)
    else newSet.add(moduleId)
    setExpandedModules(newSet)
  }

  // ----------------------------------------------------------
  // Section click: fetch real chapters from API (Option A)
  // ----------------------------------------------------------
  const handleSectionClick = async (moduleId: string, section: Section) => {
    setSectionLoading(true)
    setSectionError(null)
    setSelectedSection(null)

    try {
      const res = await fetch(`/api/section/${section.id}/contents`, {
        cache: 'no-store',
      })
      const json = await res.json()

      if (!json.ok) {
        setSectionError(json.error || 'Failed to load section contents.')
        return
      }

      const chaptersFromApi = (json.chapters || []) as Chapter[]

      const typedSection: SectionWithChapters = {
        ...section,
        chapters: chaptersFromApi,
      }

      setSelectedSection({
        moduleId,
        sectionId: section.id,
        section: typedSection,
      })

      setExpandedModules((prev) => {
        const next = new Set(prev)
        next.add(moduleId)
        return next
      })

      const url = new URL(window.location.href)
      url.searchParams.set('module', moduleId)
      url.searchParams.set('section', section.id)
      window.history.pushState({}, '', url.toString())
    } catch (err) {
      console.error('Error loading section contents', err)
      setSectionError('Failed to load section contents.')
    } finally {
      setSectionLoading(false)
    }
  }

  const renderRightPanel = () => {
    if (sectionLoading) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <p className="text-neutral-medium text-sm">Loading section…</p>
        </div>
      )
    }

    if (sectionError) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-neutral-dark">
              Could not load section
            </h3>
            <p className="text-xs text-red-500">{sectionError}</p>
          </div>
        </div>
      )
    }

    if (!selectedSection) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-neutral-dark">
              Select a section to begin
            </h3>
            <p className="text-neutral-medium text-sm">
              Choose a section from the left sidebar
            </p>
          </div>
        </div>
      )
    }

    const hasChapters =
      Array.isArray(selectedSection.section.chapters) &&
      selectedSection.section.chapters.length > 0

    if (!hasChapters) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-neutral-dark">
              Content coming soon
            </h3>
            <p className="text-neutral-medium text-sm">
              This section has no chapters yet.
            </p>
          </div>
        </div>
      )
    }

    return (
      <CourseraStyleLayout
        chapters={selectedSection.section.chapters}
        sectionTitle={selectedSection.section.title}
        sectionDescription={selectedSection.section.description || ''}
        onFullscreenChange={setIsFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-neutral-light/50 shadow-sm">
        <div className="p-4 border-b bg-gradient-to-br from-teal-primary to-teal-dark text-white">
          <button
            onClick={() => router.push('/classes')}
            className="flex items-center space-x-2 text-sm mb-1"
          >
            <Icon name="chevronLeft" size="sm" color="white" />
            <span>Back</span>
          </button>
          <h2 className="font-bold">{course.title}</h2>
        </div>

        <div className="p-2 overflow-y-auto">
          {course.modules.map((module) => {
            const isExpanded = expandedModules.has(module.id)

            return (
              <div key={module.id} className="mb-3 border rounded-xl">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full text-left p-3 flex items-center justify-between"
                >
                  <span className="font-semibold">{module.title}</span>
                  <Icon
                    name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    size="sm"
                  />
                </button>

                {isExpanded && (
                  <div className="border-t bg-neutral-light/20">
                    {module.sections.map((sec) => {
                      const selected = selectedSection?.sectionId === sec.id

                      return (
                        <button
                          key={sec.id}
                          onClick={() => void handleSectionClick(module.id, sec)}
                          className={`w-full text-left p-3 block ${
                            selected
                              ? 'bg-teal-light/30'
                              : 'hover:bg-neutral-light/40'
                          }`}
                        >
                          <div className="font-semibold text-sm">
                            {sec.title}
                          </div>
                          <div className="text-xs text-neutral-medium line-clamp-1">
                            {sec.description}
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

      {/* Right Content Panel */}
      <div className="flex-1 overflow-hidden">{renderRightPanel()}</div>
    </div>
  )
}
