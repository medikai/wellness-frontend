// src/types/course.ts

// What kinds of content we render in the player
export type ContentType =
  | 'video'
  | 'survey'
  | 'quiz'
  | 'text'
  | 'games'
  | 'activities'

// ---------------- Static course content types (your original) ----------------

export interface VideoContent {
  type: 'video'
  title: string
  // original field used by your static component
  embed_link: string

  // extra optional fields to support dynamic API / normalization
  embedUrl?: string
  embed_url?: string
  url?: string
}

export interface SurveyQuestion {
  id: string
  question: string
  input_type: 'text' | 'radio' | 'checkbox' | 'textarea' | 'range'
  options?: string[]
}

export interface SurveyContent {
  type: 'survey'
  title: string
  questions: SurveyQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: {
    id: string
    label: string
    correct: boolean
  }[]
}

export interface QuizContent {
  type: 'quiz'
  title: string
  questions: QuizQuestion[]
}

export interface TextContent {
  type: 'text'
  title: string
  // original field used by your static component
  content: string // HTML or plain text

  // extra optional fields for dynamic API
  html?: string
  body?: string
}

export interface GameContent {
  type: 'games'
  title: string
  game_id: string
  description: string
}

export interface ActivityContent {
  type: 'activities'
  title: string
  activity_type: 'hydration' | 'mcq' | 'single_choice'
  description: string
  options?: string[]
}

// union for what the player can render
export type CourseContent =
  | VideoContent
  | SurveyContent
  | QuizContent
  | TextContent
  | GameContent
  | ActivityContent

// ---------------- Dynamic outline content (from /outline API) ----------------

export interface VideoData {
  embedUrl?: string
  embed_url?: string
  embed_link?: string
  url?: string
  title?: string
}

export interface TextData {
  html?: string
  body?: string
  title?: string
}

export interface SurveyData {
  title?: string
  questions?: Array<{
    id: string | number
    q?: string
    question?: string
    type?: string
    input_type?: 'text' | 'radio' | 'checkbox' | 'textarea' | 'range'
    options?: string[]
  }>
}

export interface QuizData {
  title?: string
  questions?: Array<{
    id: string | number
    q?: string
    question?: string
    options?: string[]
    answer?: number
  }>
}

export interface ActivityData {
  title?: string
  activity_type?: string
  description?: string
  options?: string[]
  config?: {
    goal?: string
  }
}

export interface GameData {
  title?: string
  game_id?: string
  description?: string
}

// export type DynamicContentData =
//   | VideoData
//   | TextData
//   | SurveyData
//   | QuizData
//   | ActivityData
//   | GameData

export interface DynamicContentData {
  // common
  title?: string

  // video
  embed_link?: string
  embedUrl?: string
  embed_url?: string
  url?: string

  // text
  html?: string
  body?: string
  content?: string

  // survey
  questions?: Array<{
    id?: string | number
    q?: string
    question?: string
    type?: string
    input_type?: 'text' | 'radio' | 'checkbox' | 'textarea' | 'range'
    options?: string[]
    answer?: number
  }>

  // quiz
  options?: string[]

  // activity
  activity_type?: string
  description?: string
  config?: { goal?: string }

  // game
  game_id?: string
}


export type NormalizedContent =
  | VideoContent
  | SurveyContent
  | QuizContent
  | TextContent
  | GameContent
  | ActivityContent


// shape from `outline.course.modules[].sections[].chapters[].content[]`
export interface RawChapterContent {
  id: string
  content_type: string
  content_data: DynamicContentData
}

// ---------------- Core course structure ----------------

export interface Chapter {
  id: string
  title: string
  // your original
  description: string

  // sometimes present in outline
  overview?: string

  /**
   * For static course:
   *   content: CourseContent
   *
   * For dynamic self-paced outline:
   *   content: RawChapterContent[]
   */
  content: CourseContent | RawChapterContent[]
}

export interface Section {
  id: string
  title: string
  description: string
  // in self-paced some sections have no chapters (null) → keep optional
  chapters?: Chapter[] | null
}

export interface Module {
  id: string
  title: string
  description: string
  sections: Section[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  modules: Module[]
}
