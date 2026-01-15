'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
  Chapter,
  RawChapterContent,
  VideoContent as VideoContentType,
  SurveyContent as SurveyContentType,
  QuizContent as QuizContentType,
  TextContent as TextContentType,
  GameContent as GameContentType,
  ActivityContent as ActivityContentType,
  DynamicContentData,
} from '@/types/course'

import VideoContent from './content/VideoContent'
import SurveyContent from './content/SurveyContent'
import QuizContent from './content/QuizContent'
import TextContent from './content/TextContent'
import GameContent from './content/GameContent'
import ActivityContent from './content/ActivityContent'

import { Button, Icon } from '@/components/ui'
import { colors } from '@/design-tokens'
import FeedbackModal from '@/components/FeedbackModal'

interface ApiContentResponse {
  content_type?: string
  content_data?: DynamicContentData
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
function getFirstContentIdFromChapter(chapter: Chapter | undefined): string | undefined {
  if (!chapter) return undefined
  const c = (chapter as unknown as { content?: unknown }).content

  if (Array.isArray(c) && c.length > 0) {
    const first = c[0] as RawChapterContent
    return first.id
  }

  return undefined
}

export type NormalizedContent =
  | VideoContentType
  | SurveyContentType
  | QuizContentType
  | TextContentType
  | GameContentType
  | ActivityContentType


type ContentIconType =
  | 'video'
  | 'survey'
  | 'quiz'
  | 'text'
  | 'games'
  | 'activities'

function getOutlineContentType(chapter: Chapter | undefined): ContentIconType {
  const c = (chapter as unknown as { content?: unknown }).content

  let t: string | undefined

  if (Array.isArray(c) && c.length > 0) {
    const first = c[0] as RawChapterContent
    t = first.content_type
  } else if (c && typeof c === 'object') {
    const obj = c as { type?: string }
    t = obj.type
  }

  const normalized = (t || 'text').toLowerCase()

  if (
    normalized === 'video' ||
    normalized === 'survey' ||
    normalized === 'quiz' ||
    normalized === 'games' ||
    normalized === 'activities'
  ) {
    return normalized as ContentIconType
  }

  return 'text'
}

function getChapterIcon(contentType: ContentIconType) {
  switch (contentType) {
    case 'video':
      return 'video'
    case 'quiz':
      return 'helpCircle'
    case 'survey':
      return 'fileText'
    case 'games':
      return 'gamepad'
    case 'activities':
      return 'heart'
    case 'text':
    default:
      return 'fileText'
  }
}

function getContentTabLabel(item: RawChapterContent, index: number): string {
  const t = (item.content_type || '').toLowerCase()
  if (t === 'video') return 'Video'
  if (t === 'text') return 'Text'
  if (t === 'survey') return 'Survey'
  if (t === 'quiz') return 'Quiz'
  if (t === 'activity') return 'Activity'
  if (t === 'game') return 'Game'
  return `Item ${index + 1}`
}

function isVideoData(data: DynamicContentData): boolean {
  return (
    typeof data === 'object' &&
    ('embed_link' in data ||
      'embedUrl' in data ||
      'embed_url' in data ||
      'url' in data)
  )
}


// Normalize backend /show result
export function normalizeDynamicContent(apiContent: ApiContentResponse | null): NormalizedContent {
  if (!apiContent || typeof apiContent !== 'object') {
    const fallback: TextContentType = {
      type: 'text',
      title: '',
      body: 'Content not available yet.',
      html: 'Content not available yet.',
      content: 'Content not available yet.',
    }
    return fallback
  }

  const rawType = (apiContent.content_type || 'text').toLowerCase()
  const data = apiContent.content_data || {}

  // ---------------- VIDEO ----------------
  if (rawType === 'video' && isVideoData(data)) {
    const embedLink =
      data.embed_link ||
      data.embedUrl ||
      data.embed_url ||
      data.url ||
      ''

    const content: VideoContentType = {
      type: 'video',
      title: data.title || '',
      embed_link: embedLink,
      embedUrl: data.embedUrl,
      embed_url: data.embed_url,
      url: data.url,
    }

    return content
  }

  // ---------------- SURVEY ----------------
  if (rawType === 'survey') {
    const questions = Array.isArray(data.questions)
      ? data.questions.map((q, idx) => ({
        id: String(q.id ?? idx + 1),
        question: q.q ?? q.question ?? '',
        input_type: q.input_type ?? (q.type as SurveyContentType['questions'][number]['input_type']) ?? 'radio',
        options: q.options ?? [],
      }))
      : []

    const content: SurveyContentType = {
      type: 'survey',
      title: data.title || '',
      questions,
    }

    return content
  }


  // ---------------- QUIZ ----------------
  if (rawType === 'quiz') {
    const questions = Array.isArray(data.questions)
      ? data.questions.map((q, idx) => ({
        id: String(q.id ?? idx + 1),
        question: q.q ?? q.question ?? '',
        options: (q.options ?? []).map((opt, optIdx) => ({
          id: String(optIdx + 1),
          label: opt,
          correct: typeof q.answer === 'number' ? q.answer === optIdx : false,
        })),
      }))
      : []

    const content: QuizContentType = {
      type: 'quiz',
      title: data.title || '',
      questions,
    }

    return content
  }


  // ---------------- ACTIVITIES ----------------
  if (rawType === 'activity' || rawType === 'activities') {
    const content: ActivityContentType = {
      type: 'activities',
      title: data.title || '',
      activity_type: (data.activity_type || 'single_choice') as ActivityContentType['activity_type'],
      description: data.description || data.config?.goal || '',
      options: data.options,
    }
    return content
  }


  // ---------------- GAMES ----------------
  if (rawType === 'game' || rawType === 'games') {
    const content: GameContentType = {
      type: 'games',
      title: data.title || '',
      game_id: data.game_id || '',
      description: data.description || '',
    }
    return content
  }


  // ---------------- TEXT (default) ----------------
  const html = data.html || data.body || ''
  const body = data.body || data.html || ''
  const contentField = html || body || ''

  const textContent: TextContentType = {
    type: 'text',
    title: data.title || '',
    html,
    body,
    content: contentField,
  }

  return textContent
}


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

interface CourseraStyleLayoutProps {
  chapters: Chapter[]
  sectionTitle: string
  sectionDescription: string
  onFullscreenChange?: (isFullscreen: boolean) => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
}

export default function CourseraStyleLayout({
  chapters,
  sectionTitle,
  sectionDescription,
  onFullscreenChange,
  onToggleFullscreen,
  isFullscreen: externalIsFullscreen,
}: CourseraStyleLayoutProps) {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    chapters[0]?.id || '',
  )

  const [activeContentId, setActiveContentId] = useState<string | null>(null)
  // const [activeContent, setActiveContent] = useState<any | null>(null)
  const [activeContent, setActiveContent] = useState<NormalizedContent | null>(null)
  const [contentLoading, setContentLoading] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)

  const [internalFullscreen, setInternalFullscreen] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chapters && chapters.length > 0) {
      setActiveChapterId(chapters[0].id)
    }
  }, [chapters])

  const isFullscreen =
    externalIsFullscreen !== undefined
      ? externalIsFullscreen
      : internalFullscreen

  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) || chapters[0]

  const headerDescription =
    (activeChapter as unknown as { overview?: string }).overview ||
    (activeChapter as unknown as { description?: string }).description ||
    sectionDescription

  const chapterContents: RawChapterContent[] = useMemo(() => {
    if (!activeChapter) return []
    const c = (activeChapter as unknown as { content?: unknown }).content
    if (Array.isArray(c)) {
      return c as RawChapterContent[]
    }
    return []
  }, [activeChapter])

  const isStaticChapter = useMemo(() => {
    if (!activeChapter) return false
    const c = (activeChapter as unknown as { content?: unknown }).content
    return Boolean(c && !Array.isArray(c))
  }, [activeChapter])

  useEffect(() => {
    if (!activeChapter) {
      setActiveContent(null)
      setActiveContentId(null)
      return
    }

    const c = (activeChapter as unknown as { content?: unknown }).content

    // if (c && !Array.isArray(c)) {
    //   setActiveContent(c)
    //   setActiveContentId(null)
    //   setContentError(null)
    //   setContentLoading(false)
    //   return
    // }

    if (c && !Array.isArray(c)) {
      setActiveContent(
        normalizeDynamicContent({
          content_type: (c as { type: string }).type ?? 'text',
          content_data: c as DynamicContentData,
        })
      )

      setActiveContentId(null)
      setContentError(null)
      setContentLoading(false)
      return
    }


    if (Array.isArray(c) && c.length > 0) {
      const firstId = getFirstContentIdFromChapter(activeChapter)
      setActiveContentId(firstId || null)
      setActiveContent(null)
      setContentError(null)
      setContentLoading(false)
      return
    }

    setActiveContent({
      type: 'text',
      title: '',
      body: 'Unable to load content. Please try again later.',
      html: 'Unable to load content. Please try again later.',
      content: 'Unable to load content. Please try again later.',
    })

    setActiveContentId(null)
    setContentError(null)
    setContentLoading(false)
  }, [activeChapterId, chapters, activeChapter])

  useEffect(() => {
    if (!activeContentId) return

    let cancelled = false
    setContentLoading(true)
    setContentError(null)

      ; (async () => {
        try {
          const res = await fetch(`/api/content/${activeContentId}/show`)
          const json = await res.json()

          if (cancelled) return

          if (!json.ok) {
            setContentError(json.error || 'Failed to load content.')
            setActiveContent({
              type: 'text',
              title: '',
              body: 'Unable to load content. Please try again later.',
              html: 'Unable to load content. Please try again later.',
              content: 'Unable to load content. Please try again later.',
            })

          } else {
            setActiveContent(normalizeDynamicContent(json.content))
          }
        } catch (e) {
          if (cancelled) return
          console.error('Error loading content', e)
          setContentError('Failed to load content.')
          setActiveContent({
            type: 'text',
            title: '',
            body: 'Unable to load content. Please try again later.',
            html: 'Unable to load content. Please try again later.',
            content: 'Unable to load content. Please try again later.',
          })

        } finally {
          if (!cancelled) setContentLoading(false)
        }
      })()

    return () => {
      cancelled = true
    }
  }, [activeContentId])

  const renderContent = () => {
    if (chapters.length === 0) {
      return (
        <TextContent
          content={{
            type: 'text',
            title: '',
            content: 'This section does not have any chapters yet.',
          }}
        />
      )
    }

    if (contentLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <p className="text-neutral-medium text-sm">Loading content…</p>
        </div>
      )
    }

    if (!activeContent) {
      return (
        <TextContent
          content={{
            type: 'text',
            title: '',
            content: 'Content not available yet.',
          }}
        />
      )
    }

    switch (activeContent.type) {
      case 'video':
        return <VideoContent content={activeContent} />
      case 'survey':
        return <SurveyContent content={activeContent} />
      case 'quiz':
        return <QuizContent content={activeContent} />
      case 'games':
        // case 'game':
        return <GameContent content={activeContent} />
      case 'activities':
        // case 'activity':
        return <ActivityContent content={activeContent} />
      case 'text':
      default:
        return <TextContent content={activeContent} />
    }
  }

  const checkFullscreen = () => {
    const doc = document as DocumentWithFullscreen
    return !!(
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )
  }

  useEffect(() => {
    if (externalIsFullscreen !== undefined) return

    const handleFSChange = () => {
      const isFS = checkFullscreen()
      setInternalFullscreen(isFS)
      onFullscreenChange?.(isFS)
    }

    document.addEventListener('fullscreenchange', handleFSChange)
    document.addEventListener('webkitfullscreenchange', handleFSChange)
    document.addEventListener('mozfullscreenchange', handleFSChange)
    document.addEventListener('MSFullscreenChange', handleFSChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange)
      document.removeEventListener('webkitfullscreenchange', handleFSChange)
      document.removeEventListener('mozfullscreenchange', handleFSChange)
      document.removeEventListener('MSFullscreenChange', handleFSChange)
    }
  }, [externalIsFullscreen, onFullscreenChange])

  const handleLocalFullscreen = async () => {
    try {
      if (!containerRef.current) return

      const isFS = checkFullscreen()
      const doc = document as DocumentWithFullscreen
      const el = containerRef.current as HTMLElementWithFullscreen

      if (isFS) {
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
    } catch (err) {
      console.error('Error toggling fullscreen', err)
    }
  }

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) onToggleFullscreen()
    else handleLocalFullscreen()
  }

  const currentChapterIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeChapterId),
  )

  // const activeContentIndex =
  //   activeContentId && chapterContents.length > 0
  //     ? chapterContents.findIndex((c) => c.id === activeContentId)
  //     : -1

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background flex flex-col h-full"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-light/50 sticky top-0 z-30">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="heart" size="md" color="white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-neutral-dark">
                  {activeChapter?.title || sectionTitle}
                </h1>
                <p className="text-sm text-teal-primary font-medium">
                  {headerDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleToggleFullscreen}
                className="flex items-center space-x-2 text-neutral-dark hover:bg-teal-light border-teal-light"
                title={isFullscreen ? 'Exit Fullscreen' : 'Maximize Screen'}
              >
                <Icon
                  name={isFullscreen ? 'x' : 'maximize'}
                  size="sm"
                  color={colors.neutral.dark}
                />
                <span className="text-sm">
                  {isFullscreen ? 'Exit' : 'Maximize'}
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowFeedbackModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl"
              >
                Leave Session
              </Button>
            </div>
          </div>

          {/* Chapter Tabs */}
          {!isFullscreen && chapters.length > 0 && (
            <div className="border-t border-neutral-light/50 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2 flex-1 overflow-x-auto pb-2 scrollbar-hide">
                  {chapters.map((chapter, index) => {
                    const isActive = chapter.id === activeChapterId
                    const outlineType = getOutlineContentType(chapter)
                    const iconName = getChapterIcon(outlineType)

                    return (
                      <button
                        key={chapter.id}
                        onClick={() => {
                          setActiveChapterId(chapter.id)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${isActive
                          ? 'bg-gradient-to-r from-teal-primary to-teal-dark text-white shadow-md'
                          : 'bg-teal-light/30 hover:bg-teal-light/50 text-neutral-dark border-2 border-teal-light'
                          }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20' : 'bg-white'
                            }`}
                        >
                          <Icon
                            name={iconName}
                            size="sm"
                            color={
                              isActive ? 'white' : colors.neutral.medium
                            }
                          />
                        </div>
                        <span
                          className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-neutral-dark'
                            }`}
                        >
                          Chapter {index + 1}
                        </span>
                        {isActive && (
                          <span className="text-xs bg-white text-teal-primary px-2 py-0.5 rounded-full font-semibold">
                            Current
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex-shrink-0 w-full min-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-medium">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-teal-primary">
                      {chapters.length === 0
                        ? '0 / 0'
                        : `${currentChapterIndex + 1} / ${chapters.length}`}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-light rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-primary to-teal-dark h-2 rounded-full transition-all duration-300"
                      style={{
                        width:
                          chapters.length === 0
                            ? '0%'
                            : `${((currentChapterIndex + 1) /
                              chapters.length) *
                            100
                            }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div
          className={
            isFullscreen
              ? 'w-full max-w-full px-6 lg:px-12 py-6 lg:py-8'
              : 'max-w-5xl mx-auto p-6 lg:p-8'
          }
        >
          <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 border border-neutral-light/50">
            {/* Content tabs (Coursera style) */}
            {!isStaticChapter && chapterContents.length > 0 && (
              <div className="mb-4 border-b border-neutral-light/60 pb-2 flex flex-wrap gap-2">
                {chapterContents.map((item, idx) => {
                  const isActive = item.id === activeContentId
                  const label = getContentTabLabel(item, idx)
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveContentId(item.id)}
                      className={
                        'text-xs px-3 py-1.5 rounded-full border transition-all ' +
                        (isActive
                          ? 'bg-teal-primary text-white border-teal-primary shadow-sm'
                          : 'bg-neutral-light/40 text-neutral-dark border-neutral-light hover:bg-neutral-light')
                      }
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            )}

            {contentError && (
              <p className="text-xs text-red-500 mb-3">{contentError}</p>
            )}

            {renderContent()}
          </div>

          {/* Prev / Next chapter buttons (same as before) */}
          <div className="flex justify-between mt-6 gap-4">
            <Button
              onClick={() => {
                if (currentChapterIndex > 0) {
                  setActiveChapterId(chapters[currentChapterIndex - 1].id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              disabled={currentChapterIndex === 0 || chapters.length === 0}
              variant="outline"
              className="flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="chevronLeft" size="sm" color={colors.neutral.dark} />
              <span>Previous Chapter</span>
            </Button>

            <Button
              onClick={() => {
                if (
                  chapters.length > 0 &&
                  currentChapterIndex < chapters.length - 1
                ) {
                  setActiveChapterId(chapters[currentChapterIndex + 1].id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              disabled={
                chapters.length === 0 ||
                currentChapterIndex === chapters.length - 1
              }
              variant="default"
              className="flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Chapter</span>
              <Icon name="chevronRight" size="sm" color="white" />
            </Button>
          </div>
        </div>
      </div>

      {showFeedbackModal && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onSubmit={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  )
}
