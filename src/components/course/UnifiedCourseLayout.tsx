'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Course,
  Section,
  Chapter,
} from '@/types/course'

import CourseraStyleLayout from './CourseraStyleLayout'
import CourseNavbar from './CourseNavbar'

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
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

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

  // Helper function to get next section
  const getNextSection = useCallback((currentModuleId: string, currentSectionId: string): { moduleId: string; section: Section } | null => {
    // Flatten all sections
    const allSections: Array<{ moduleId: string; section: Section }> = []
    course.modules.forEach((module) => {
      module.sections.forEach((section) => {
        allSections.push({ moduleId: module.id, section })
      })
    })

    const currentIndex = allSections.findIndex(
      (item) => item.moduleId === currentModuleId && item.section.id === currentSectionId
    )

    if (currentIndex >= 0 && currentIndex < allSections.length - 1) {
      return allSections[currentIndex + 1]
    }

    return null
  }, [course])

  // Handle auto-progression to next section
  const handleSectionComplete = useCallback(async () => {
    if (!selectedSection) return

    const nextSection = getNextSection(selectedSection.moduleId, selectedSection.sectionId)
    
    if (nextSection) {
      // Mark current section as completed
      setCompletedSections(prev => new Set(prev).add(selectedSection.sectionId))
      
      // Auto-progress to next section
      await handleSectionClick(nextSection.moduleId, nextSection.section)
    } else {
      // Mark current section as completed (last section)
      setCompletedSections(prev => new Set(prev).add(selectedSection.sectionId))
    }
  }, [selectedSection, getNextSection])

  // ----------------------------------------------------------
  // Section click: fetch real chapters from API (Option A)
  // ----------------------------------------------------------
  const handleSectionClick = async (moduleId: string, section: Section) => {
    setSectionLoading(true)
    setSectionError(null)
    setSelectedSection(null)

    try {
      // Clean section ID - remove any trailing commas or whitespace
      const cleanSectionId = section.id.trim().replace(/,$/, '')
      
      const res = await fetch(`/api/section/${encodeURIComponent(cleanSectionId)}/contents`, {
        cache: 'no-store',
        credentials: 'include',
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
        <div className="h-full flex items-center justify-center bg-transparent">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-teal-700 font-medium">Loading section…</p>
          </div>
        </div>
      )
    }

    if (sectionError) {
      return (
        <div className="h-full flex items-center justify-center bg-transparent ">
          <div className="mt-2 text-center max-w-5xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-red-200 ">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-700">
              Could not load section
            </h3>
            <p className="text-sm text-red-600 mb-4">{sectionError}</p>
            <button
              onClick={() => selectedSection && handleSectionClick(selectedSection.moduleId, selectedSection.section)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    if (!selectedSection) {
      return (
        <div className="h-full flex items-center justify-center bg-transparent">
          <div className="text-center max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-teal-200">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-teal-800">
              Select a section to begin
            </h3>
            <p className="text-teal-600 text-sm">
              Choose a section from the navigation bar above
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
        <div className="h-full flex items-center justify-center bg-transparent">
          <div className="text-center max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-teal-200">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-teal-800">
              Content coming soon
            </h3>
            <p className="text-teal-600 text-sm">
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
        courseId={courseId}
        onFullscreenChange={setIsFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onSectionComplete={handleSectionComplete}
      />
    )
  }

  // Auto-select first section if none selected
  useEffect(() => {
    if (!selectedSection && course.modules.length > 0) {
      const firstModule = course.modules[0]
      if (firstModule.sections.length > 0) {
        handleSectionClick(firstModule.id, firstModule.sections[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, course.modules.length])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      {/* Navbar Navigation */}
      <CourseNavbar
        course={course}
        selectedModuleId={selectedSection?.moduleId}
        selectedSectionId={selectedSection?.sectionId}
        onSectionSelect={handleSectionClick}
        canGoBack={!!selectedSection}
        onBack={() => router.push('/classes')}
      />

      {/* Main Content Panel */}
      <div className="flex-1 overflow-hidden">{renderRightPanel()}</div>
    </div>
  )
}
