export interface QuizQuestion {
  id: string;
  question: string;
  answerType: 'multiple-choice' | 'true-false' | 'text' | 'number';
  options?: string[]; // For multiple choice questions
  correctAnswer: string | number | boolean; // Answer or index for multiple choice
  explanation?: string;
  points: number;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'fitness' | 'nutrition' | 'wellness' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // in minutes, optional
  maxAttempts?: number; // optional
  questions: QuizQuestion[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string; // user ID
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, string | number | boolean>; // questionId -> answer
  score?: number;
  totalPoints?: number;
  percentage?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface QuizResult {
  id: string;
  attemptId: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: string;
}