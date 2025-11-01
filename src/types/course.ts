export type ContentType = 'video' | 'survey' | 'quiz' | 'text' | 'games' | 'activities';

export interface VideoContent {
  type: 'video';
  title: string;
  embed_link: string;
}

export interface SurveyContent {
  type: 'survey';
  title: string;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  input_type: 'text' | 'radio' | 'checkbox' | 'textarea' | 'range';
  options?: string[];
}

export interface QuizContent {
  type: 'quiz';
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    correct: boolean;
  }[];
}

export interface TextContent {
  type: 'text';
  title: string;
  content: string; // HTML content from TinyMCE
}

export interface GameContent {
  type: 'games';
  title: string;
  game_id: string;
  description: string;
}

export interface ActivityContent {
  type: 'activities';
  title: string;
  activity_type: 'hydration' | 'mcq' | 'single_choice';
  description: string;
  options?: string[];
}

export type CourseContent = 
  | VideoContent 
  | SurveyContent 
  | QuizContent 
  | TextContent 
  | GameContent 
  | ActivityContent;

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: CourseContent;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  modules: Module[];
}
