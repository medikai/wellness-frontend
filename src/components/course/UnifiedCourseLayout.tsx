'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Course,
  Section,
  Chapter,
} from '@/types/course'
import { courseService } from '@/services/courseService'

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
  activeChapterId?: string
  activeContentId?: string
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

export default function UnifiedCourseLayout({
  courseId,
  course: initialCourse,
  initialModuleId,
  initialSectionId,
}: {
  courseId: string
  course?: Course
  initialModuleId?: string
  initialSectionId?: string
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // State for course data
  const [course, setCourse] = useState<Course | null>(initialCourse || null)
  const [loading, setLoading] = useState(!initialCourse)
  const [error, setError] = useState<string | null>(null)

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [selectedSection, setSelectedSection] = useState<SelectedSectionState | null>(null)

  // Fetch course outline
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true)
        const response = await courseService.getOutline(courseId)
        if (response.ok) {
          // Map API response to internal Course type if needed, or just use as is if compatible
          // The API returns `outline: { course: ..., modules: ... }`.
          // We need to merge them to match the `Course` interface which has `modules` inside it.
          const { course: courseMeta, modules } = response.outline
          setCourse({ ...courseMeta, modules })
        } else {
          setError('Failed to load course')
        }
      } catch (err) {
        console.error(err)
        setError('Error loading course')
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId])

  // Initial content load (resume point or first content)
  useEffect(() => {
    // Only load content if course is loaded and no section selected yet
    if (!course || selectedSection) return

    async function loadInitial() {
      try {
        // Try fetching resume point first
        // Note: API for resume point returns "content". We need to find which section/module it belongs to.
        // This might require scanning the course modules.
        // For now, let's just pick the first one if nothing selected.
        if (course && course.modules.length > 0 && course.modules[0].sections.length > 0) {
          const firstModule = course.modules[0]
          const firstSection = firstModule.sections[0]
          setExpandedModules(new Set([firstModule.id]))
          // We need to fetch the actual content for this section/chapter
          // For now, we just set the selection state. Use logic to fetch content below.
          handleSectionClick(firstModule.id, firstSection)
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadInitial()
  }, [course])

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
    // For navbar: only one dropdown open at a time
    const newSet = new Set<string>()
    if (!expandedModules.has(moduleId)) {
      newSet.add(moduleId)
    }
    setExpandedModules(newSet)
  }

  // ----------------------------------------------------------
  // Section click: fetch real chapters from API (Option A)
  // ----------------------------------------------------------
  const handleSectionClick = async (moduleId: string, section: Section) => {
    // Assume section has chapters from outline
    const sectionWithChapters = section as SectionWithChapters

    if (!sectionWithChapters.chapters || sectionWithChapters.chapters.length === 0) {
      setSectionError('This section has no chapters.')
      return
    }

    const firstChapter = sectionWithChapters.chapters[0]

    let activeContentId: string | undefined
    if (Array.isArray(firstChapter.content) && firstChapter.content.length > 0) {
      // Cast to any to safely access id if types differ slightly, but Api types say content is array of RawChapterContent
      activeContentId = (firstChapter.content[0] as any).id
    }

    setSelectedSection({
      moduleId,
      sectionId: section.id,
      section: sectionWithChapters,
      activeChapterId: firstChapter.id,
      activeContentId
    })

    setExpandedModules(new Set([moduleId]))
  }

  const handleNext = async () => {
    if (!selectedSection?.activeContentId) return
    try {
      const nextContent = await courseService.getNextContent(selectedSection.activeContentId)
      if (nextContent) {
        if (!course) return

        let foundModuleId = ''
        let foundSection: SectionWithChapters | undefined

        // Find module/section for this chapter_id
        for (const m of course.modules) {
          for (const s of m.sections) {
            if (s.chapters?.some(c => c.id === nextContent.chapter_id)) {
              foundModuleId = m.id
              foundSection = s as SectionWithChapters
              break
            }
          }
          if (foundModuleId) break
        }

        if (foundModuleId && foundSection) {
          setSelectedSection({
            moduleId: foundModuleId,
            sectionId: foundSection.id,
            section: foundSection,
            activeChapterId: nextContent.chapter_id,
            activeContentId: nextContent.id
          })
          setExpandedModules(new Set([foundModuleId]))
        }
      } else {
        alert("You have completed the course!")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handlePrevious = async () => {
    if (!selectedSection?.activeContentId) return
    try {
      const prevContent = await courseService.getPreviousContent(selectedSection.activeContentId)
      if (prevContent) {
        if (!course) return
        let foundModuleId = ''
        let foundSection: SectionWithChapters | undefined

        for (const m of course.modules) {
          for (const s of m.sections) {
            if (s.chapters?.some(c => c.id === prevContent.chapter_id)) {
              foundModuleId = m.id
              foundSection = s as SectionWithChapters
              break
            }
          }
          if (foundModuleId) break
        }

        if (foundModuleId && foundSection) {
          setSelectedSection({
            moduleId: foundModuleId,
            sectionId: foundSection.id,
            section: foundSection,
            activeChapterId: prevContent.chapter_id,
            activeContentId: prevContent.id
          })
          setExpandedModules(new Set([foundModuleId]))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleComplete = async () => {
    if (!selectedSection?.activeContentId) return
    try {
      await courseService.completeContent(selectedSection.activeContentId, courseId)
      await handleNext()
    } catch (e) {
      console.error(e)
    }
  }

  const renderRightPanel = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <p className="text-neutral-medium text-sm">Loading course...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center bg-background">
          <h3 className="text-xl font-bold mb-2 text-neutral-dark">Error</h3>
          <p className="text-xs text-red-500">{error}</p>
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
            <p className="text-neutral-medium max-w-md mx-auto">
              Choose a module from the top navigation to start learning.
            </p>
          </div>
        </div>
      )
    }

    const activeChapter = selectedSection.section.chapters.find(c => c.id === selectedSection.activeChapterId)

    if (!activeChapter) return <div>Chapter not found</div>

    let activeContent: any = null
    if (Array.isArray(activeChapter.content)) {
      activeContent = activeChapter.content.find((c: any) => c.id === selectedSection.activeContentId)
    } else {
      activeContent = activeChapter.content
    }

    if (!activeContent) return (
      <div className="h-full flex items-center justify-center">
        <p>Content not found. Please try another section.</p>
      </div>
    )

    return (
      <div className="flex-1 h-full overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-dark">{activeChapter.title}</h1>
            <div className="flex gap-2 shrink-0">
              <button onClick={handlePrevious} className="px-4 py-2 border rounded-lg hover:bg-neutral-light transition-colors text-sm font-medium">Previous</button>
              <button onClick={handleNext} className="px-4 py-2 border rounded-lg hover:bg-neutral-light transition-colors text-sm font-medium">Next</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-light/50 p-4 lg:p-8 min-h-[400px]">
            {activeContent.content_type === 'video' && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={(activeContent.content_data as any).embed_url}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video Player"
                />
              </div>
            )}

            {activeContent.content_type === 'text' && (
              <div className="prose max-w-none prose-teal" dangerouslySetInnerHTML={{ __html: (activeContent.content_data as any).html || '' }} />
            )}

            {activeContent.content_type === 'quiz' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Quiz</h2>
                {(activeContent.content_data as any).questions?.map((q: any, i: number) => (
                  <div key={i} className="mb-6 p-4 border rounded-xl bg-neutral-light/10">
                    <p className="font-semibold mb-3 text-lg">{q.q}</p>
                    <div className="space-y-3">
                      {q.options?.map((opt: string, j: number) => (
                        <label key={j} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white border border-transparent hover:border-neutral-light transition-all cursor-pointer">
                          <input type="radio" name={`q-${i}`} className="w-4 h-4 text-teal-primary focus:ring-teal-primary" />
                          <span className="text-neutral-dark">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!['video', 'text', 'quiz'].includes(activeContent.content_type) && (
              <div className="text-center py-10">
                <p className="font-semibold mb-2">Content Type: {activeContent.content_type}</p>
                <p className="text-sm text-neutral-medium">This content type is not yet fully supported in this preview.</p>
              </div>
            )}

          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleComplete}
              className="bg-teal-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Mark as Complete & Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <div className="bg-gradient-to-r from-teal-primary to-teal-dark border-b border-neutral-light/50 shadow-sm sticky top-0 z-40 flex items-center justify-between px-6 py-3">
        {/* Left: Branding & Back */}
        <div className="flex items-center gap-4 text-white shrink-0 mr-8">
          <button
            onClick={() => router.push('/classes')}
            className="flex items-center space-x-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Icon name="chevronLeft" size="sm" color="white" />
            <span>Back to Classes</span>
          </button>
          <div className="h-6 w-px bg-white/20"></div>
          <h2 className="font-bold text-lg whitespace-nowrap">{course?.title || 'Loading...'}</h2>
        </div>

        {/* Right: Navigation Modules */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {course?.modules.map((module) => {
            const isExpanded = expandedModules.has(module.id)
            const hasActiveSection = selectedSection?.moduleId === module.id

            return (
              <div key={module.id} className="relative">
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${hasActiveSection || isExpanded
                      ? 'bg-white text-teal-dark shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white border border-transparent'
                    }
                  `}
                >
                  <span>{module.title}</span>
                  <Icon
                    name={isExpanded ? 'chevronUp' : 'chevronDown'}
                    size="sm"
                    color={hasActiveSection || isExpanded ? '#2D7D6B' : 'white'}
                  />
                </button>

                {isExpanded && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-neutral-light/50 overflow-hidden z-50 animate-fade-in-up origin-top-right text-neutral-dark">
                    <div className="max-h-[60vh] overflow-y-auto py-1">
                      {module.sections.map((sec) => {
                        const selected = selectedSection?.sectionId === sec.id

                        return (
                          <button
                            key={sec.id}
                            onClick={() => {
                              handleSectionClick(module.id, sec)
                              setExpandedModules(new Set())
                            }}
                            className={`w-full text-left px-4 py-3 block transition-colors border-l-4
                              ${selected
                                ? 'bg-teal-light/10 border-teal-primary'
                                : 'border-transparent hover:bg-neutral-light/30'
                              }`}
                          >
                            <div className={`font-semibold text-sm ${selected ? 'text-teal-primary' : 'text-neutral-dark'}`}>
                              {sec.title}
                            </div>
                            {sec.description && (
                              <div className="text-xs text-neutral-medium line-clamp-1 mt-0.5">
                                {sec.description}
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {renderRightPanel()}
      </div>
    </div>
  )
}
