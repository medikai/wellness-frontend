import { CognitiveTestConfig, InteractionMode } from '@/types/cognitive-test'
import { QuizContent } from '@/types/course'

/**
 * Converts existing QuizContent to CognitiveTestConfig
 * This allows backward compatibility with existing quiz data
 */
export function quizToCognitiveTest(
  quiz: QuizContent,
  interactionMode: InteractionMode = 'single-tap'
): CognitiveTestConfig {
  // Convert quiz questions to practice and test items
  const practiceItems = quiz.questions.slice(0, Math.min(2, quiz.questions.length)).map((q) => ({
    id: `practice-${q.id}`,
    stimulus: q.question,
    correctAnswer: q.options.findIndex(opt => opt.correct),
    feedback: {
      correct: 'Correct! Well done!',
      incorrect: 'Incorrect. Try again.'
    },
    metadata: {
      options: q.options.map(opt => opt.label),
      type: 'multiple-choice'
    } as Record<string, unknown>
  }))

  const testItems = quiz.questions.map((q) => ({
    id: q.id,
    stimulus: q.question,
    correctAnswer: q.options.findIndex(opt => opt.correct),
    metadata: {
      options: q.options.map(opt => opt.label),
      type: 'multiple-choice'
    } as Record<string, unknown>
  }))

  return {
    id: `quiz-${Date.now()}`,
    title: quiz.title,
    description: 'Complete all questions to finish the quiz',
    interactionMode,
    instruction: {
      text: `Welcome to ${quiz.title}!\n\nYou will answer ${quiz.questions.length} questions. First, you'll practice with ${practiceItems.length} example questions, then complete the full test.\n\nTap "Start Practice" when you're ready.`,
    },
    practice: {
      enabled: practiceItems.length > 0,
      items: practiceItems,
      requiredPass: false // Can be made configurable
    },
    test: {
      items: testItems,
      duration: quiz.questions.length * 60, // 60 seconds per question
    },
    stimulus: {
      type: 'text',
    }
  }
}

/**
 * Creates a cognitive test config for memory match game
 */
export function createMemoryMatchTest(): CognitiveTestConfig {
  return {
    id: 'memory-match',
    title: 'Memory Match Game',
    description: 'Find matching pairs',
    interactionMode: 'grid-tap',
    instruction: {
      text: 'Welcome to Memory Match!\n\nYou will see a grid of cards. Tap cards to reveal them and find matching pairs.\n\nPractice first to learn how to play!',
    },
    practice: {
      enabled: true,
      items: [
        {
          id: 'practice-1',
          stimulus: 'Find the matching apple',
          correctAnswer: [1], // Position in grid
          feedback: {
            correct: 'Great! You found the match!',
            incorrect: 'Not a match. Try again!'
          }
        }
      ],
      requiredPass: false
    },
    test: {
      items: [
        {
          id: 'test-1',
          stimulus: 'Find all matching pairs',
          metadata: {
            gridSize: { rows: 2, cols: 4 },
            pairs: ['🍎', '🐘', '❤️', '⭐']
          }
        }
      ],
      duration: 300 // 5 minutes
    },
    stimulus: {
      type: 'grid',
      gridConfig: {
        rows: 2,
        cols: 4,
        items: [
          { id: '1', content: '🍎', position: { row: 0, col: 0 }, isTarget: true },
          { id: '2', content: '🍎', position: { row: 0, col: 1 }, isTarget: true },
          { id: '3', content: '🐘', position: { row: 0, col: 2 }, isTarget: true },
          { id: '4', content: '🐘', position: { row: 0, col: 3 }, isTarget: true },
          { id: '5', content: '❤️', position: { row: 1, col: 0 }, isTarget: true },
          { id: '6', content: '❤️', position: { row: 1, col: 1 }, isTarget: true },
          { id: '7', content: '⭐', position: { row: 1, col: 2 }, isTarget: true },
          { id: '8', content: '⭐', position: { row: 1, col: 3 }, isTarget: true },
        ]
      }
    }
  }
}

