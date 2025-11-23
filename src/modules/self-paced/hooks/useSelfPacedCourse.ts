// src/modules/self-paced/hooks/useSelfPacedCourse.ts
'use client'

// import { useEffect, useState } from 'react'
// import type { Course } from '@/types/course'
// import type { DbCourseOutline } from '../mappers/mapDbCourseOutlineToUiCourse'
// import { mapDbCourseOutlineToUiCourse } from '../mappers/mapDbCourseOutlineToUiCourse'

import { useEffect, useState } from 'react'
import type { Course } from '@/types/course'
import { mapDbCourseOutlineToUiCourse } from '../mappers/mapDbCourseOutlineToUiCourse'
import type { DbCourseOutline } from '../mappers/mapDbCourseOutlineToUiCourse'

interface ResumePoint {
    course_id: string
    module_id: string | null
    section_id: string | null
    chapter_id: string | null
    content_id: string | null
}

// interface DbCourseOutline {
//     modules?: Array<{
//         id: string
//         sections?: Array<{
//             id: string
//         }>
//     }>
// }


interface OutlineResponse {
    ok: boolean
    outline?: DbCourseOutline
    error?: string
}

interface ResumeResponse {
    ok: boolean
    resume?: ResumePoint | null
    error?: string
}

export function useSelfPacedCourse(courseId: string) {
    const [course, setCourse] = useState<Course | null>(null)
    const [initialModuleId, setInitialModuleId] = useState<string | undefined>()
    const [initialSectionId, setInitialSectionId] = useState<string | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            try {
                setLoading(true)
                setError(null)

                const [outlineRes, resumeRes] = await Promise.all([
                    fetch(`/api/course/${courseId}/outline`, {
                        credentials: 'include'
                    }).then((r) => r.json() as Promise<OutlineResponse>),
                    fetch(`/api/course/${courseId}/resume-point`, {
                        credentials: 'include'
                    }).then((r) => r.json() as Promise<ResumeResponse>)
                ])

                if (!outlineRes.ok || !outlineRes.outline) {
                    throw new Error(outlineRes.error || 'Failed to load course outline')
                }

                const uiCourse = mapDbCourseOutlineToUiCourse(outlineRes.outline)

                let moduleId: string | undefined
                let sectionId: string | undefined

                if (resumeRes.ok && resumeRes.resume) {
                    moduleId = resumeRes.resume.module_id ?? undefined
                    sectionId = resumeRes.resume.section_id ?? undefined
                } else {
                    // fallback: first module / first section if available
                    const firstModule = uiCourse.modules?.[0]
                    const firstSection = firstModule?.sections?.[0]
                    moduleId = firstModule?.id
                    sectionId = firstSection?.id
                }

                if (!cancelled) {
                    setCourse(uiCourse)
                    setInitialModuleId(moduleId)
                    setInitialSectionId(sectionId)
                }
            } catch (e) {
                // if (!cancelled) {
                //   setError(e?.message || 'Unknown error')
                // }
                const msg = e instanceof Error ? e.message : 'Unknown error'
                setError(msg)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [courseId])

    return {
        course,
        loading,
        error,
        initialModuleId,
        initialSectionId
    }
}
