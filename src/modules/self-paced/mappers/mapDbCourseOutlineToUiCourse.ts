// src/modules/self-paced/mappers/mapDbCourseOutlineToUiCourse.ts
import type { Course } from '@/types/course'

// Raw shape coming from get_course_outline
interface DbCourseOutline {
    course: {
        id: string
        title: string
        description?: string | null
        [key: string]: unknown
    }
    modules?: DbModule[] | null
}

interface DbModule {
    id: string
    title: string
    description?: string | null
    sections?: DbSection[] | null
}

interface DbSection {
    id: string
    title: string
    description?: string | null
    chapters?: DbChapter[] | null
}

interface DbChapter {
    id: string
    title: string
    overview?: string | null
    duration_minutes?: number | null
    content?: DbCourseContent[] | null
}

interface DbCourseContent {
    id: string
    content_type: string | null
    content_data: unknown
}

// interface UiContent {
//     id: string
//     type: string
//     [key: string]: unknown
// }


// Map DB content_type → UI type
// function mapContentType(dbType: string | null): string {
//     if (!dbType) return 'text'

//     switch (dbType.toUpperCase()) {
//         case 'VIDEO': return 'video'
//         case 'SURVEY': return 'survey'
//         case 'QUIZ': return 'quiz'
//         case 'TEXT': return 'text'
//         case 'GAME':
//         case 'GAMES': return 'games'
//         case 'ACTIVITY':
//         case 'ACTIVITIES': return 'activities'
//         default: return 'text'
//     }
// }

// Map DB content row → UI CourseContent
// function mapDbContentToUiContent(dbContent: DbCourseContent | null, chapter: DbChapter): UiContent {
//     if (!dbContent) {
//         // fallback simple text content
//         return {
//             id: chapter.id,
//             type: 'text',
//             title: chapter.title,
//             body: chapter.overview || ''
//         }
//     }

//     const uiType = mapContentType(dbContent.content_type)

//     const raw = dbContent.content_data && typeof dbContent.content_data === 'object'
//         ? dbContent.content_data
//         : {}

//     return {
//         id: dbContent.id,
//         type: uiType,
//         ...raw
//     }
// }

// ---- MAIN MAPPER ----
export function mapDbCourseOutlineToUiCourse(raw: DbCourseOutline): Course {
    const modules =
        raw.modules?.map((m) => {
            const sections =
                m.sections?.map((s) => {
                    let chapters =
                        s.chapters?.map((ch) => {
                            // const contentArr = ch.content || [];
                            // const firstContent = contentArr.length > 0 ? contentArr[0] : null;

                            return {
                                id: ch.id,
                                title: ch.title,
                                description: ch.overview || "",
                                // content: mapDbContentToUiContent(firstContent, ch),
                                content: ch.content ?? [],
                            };
                        }) || [];

                    // 🔥 FIX: Guarantee minimum 1 chapter
                    if (chapters.length === 0) {
                        chapters = [
                            {
                                id: `placeholder-${s.id}`,
                                title: s.title,
                                description: s.description || "",
                                content: [
                                    {
                                        id: `${s.id}`,
                                        content_type: "text",
                                        content_data: {
                                            title: s.title,
                                            body: s.description || "No content available.",
                                        }
                                    }
                                ],
                            },
                        ];
                    }

                    return {
                        id: s.id,
                        title: s.title,
                        description: s.description || "",
                        chapters,
                    };
                }) || [];


            return {
                id: m.id,
                title: m.title,
                description: m.description || '',
                sections
            }
        }) || []

    const uiCourse = {
        id: raw.course.id,
        title: raw.course.title,
        description: raw.course.description || '',
        modules
    }

    return uiCourse as unknown as Course
}

export type { DbCourseOutline }