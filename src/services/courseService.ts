import {
    ApiOutlineResponse,
    ApiContentResponse,
    ApiProgressResponse,
    ApiNextResponse,
    RawChapterContent,
    Course,
    Module
} from '@/types/course'

const API_BASE_URL = '/api'

// Helper to get cookies - usually handled by browser automatically for same-origin requests
// If specific header needed as in example 'Cookie: student_cookies.txt', we might need to handle it,
// but for localhost web app, credentials: 'include' or default browser behavior is usually enough.

const MOCK_COURSE_ID = 'mock-course-1'

const MOCK_COURSE: Course = {
    id: MOCK_COURSE_ID,
    title: 'Ultimate Wellness Mastery',
    description: 'A comprehensive guide to physical and mental well-being.',
    instructor: 'Dr. Sarah Smith',
    category: 'Health',
    modules: [
        {
            id: 'mod-1',
            title: 'Module 1: Foundations',
            description: 'Basics of wellness.',
            sections: [
                {
                    id: 'sec-1',
                    title: 'Section 1: Introduction',
                    description: 'Getting started.',
                    chapters: [
                        {
                            id: 'chap-1',
                            title: 'Welcome Video',
                            description: 'Introduction to the course.',
                            content: [
                                {
                                    id: 'cont-1',
                                    chapter_id: 'chap-1',
                                    content_type: 'video',
                                    content_data: {
                                        embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Rick Roll placeholder or generic
                                    }
                                }
                            ]
                        },
                        {
                            id: 'chap-2',
                            title: 'Course Overview',
                            description: 'What you will learn.',
                            content: [
                                {
                                    id: 'cont-2',
                                    chapter_id: 'chap-2',
                                    content_type: 'text',
                                    content_data: {
                                        html: '<h2>Course Goals</h2><p>In this course you will learn...</p><ul><li>Sleep hygiene</li><li>Dietary basics</li></ul>'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'sec-2',
                    title: 'Section 2: Knowledge Check',
                    description: 'Test your understanding.',
                    chapters: [
                        {
                            id: 'chap-3',
                            title: 'Basics Quiz',
                            description: 'Quick quiz.',
                            content: [
                                {
                                    id: 'cont-3',
                                    chapter_id: 'chap-3',
                                    content_type: 'quiz',
                                    content_data: {
                                        questions: [
                                            {
                                                q: 'How many hours of sleep are recommended?',
                                                options: ['4-5', '7-9', '10-12']
                                            },
                                            {
                                                q: 'Which is a macronutrient?',
                                                options: ['Vitamin C', 'Protein', 'Iron']
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

// Helper to find content
const findContent = (contentId: string): { content: RawChapterContent, index: number, allContents: RawChapterContent[] } | null => {
    const allContents: RawChapterContent[] = []

    // Flatten all content for easy linear navigation simulation
    MOCK_COURSE.modules.forEach(m => {
        m.sections.forEach(s => {
            s.chapters?.forEach(c => {
                if (Array.isArray(c.content)) {
                    allContents.push(...c.content)
                }
            })
        })
    })

    const index = allContents.findIndex(c => c.id === contentId)
    if (index === -1) return null
    return { content: allContents[index], index, allContents }
}

export const courseService = {
    async getOutline(courseId: string): Promise<ApiOutlineResponse> {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800))

        return {
            ok: true,
            outline: {
                course: {
                    ...MOCK_COURSE,
                    cost: 0,
                    logo: '/images/logo.png',
                    slug: 'wellness-mastery',
                    type: 'self-paced',
                    status: 'published',
                    version: '1.0',
                    currency: 'USD',
                    group_id: 'grp-1',
                    metadata: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_template: false,
                    banner_image: null,
                    is_published: true
                },
                modules: MOCK_COURSE.modules
            }
        }
    },

    async getFirstContent(courseId: string): Promise<RawChapterContent> {
        return (MOCK_COURSE.modules[0].sections[0].chapters![0].content as RawChapterContent[])[0]
    },

    async getResumePoint(courseId: string): Promise<RawChapterContent> {
        // Default to first for mock
        return this.getFirstContent(courseId)
    },

    async getProgress(courseId: string): Promise<ApiProgressResponse['progress']> {
        return {
            percent: 30,
            course_id: courseId,
            profile_id: 'user-1',
            total_items: 3,
            completed_items: 1
        }
    },

    async getNextContent(contentId: string): Promise<RawChapterContent | null> {
        const found = findContent(contentId)
        if (!found) return null
        const { index, allContents } = found
        if (index < allContents.length - 1) {
            return allContents[index + 1]
        }
        return null
    },

    async getPreviousContent(contentId: string): Promise<RawChapterContent | null> {
        const found = findContent(contentId)
        if (!found) return null
        const { index, allContents } = found
        if (index > 0) {
            return allContents[index - 1]
        }
        return null
    },

    async completeContent(contentId: string, courseId: string): Promise<void> {
        console.log(`[Mock API] Content ${contentId} completed for course ${courseId}`)
        await new Promise(resolve => setTimeout(resolve, 500))
    },

    async uncompleteContent(contentId: string, courseId: string): Promise<void> {
        console.log(`[Mock API] Content ${contentId} uncompleted`)
    }
}
