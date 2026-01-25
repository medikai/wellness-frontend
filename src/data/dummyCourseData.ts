import { Course } from '@/types/course';

export const dummyCourse: Course = {
  id: 'hydrate-rejuvenate',
  title: 'Hydrate to Rejuvenate',
  description: 'Master the art of hydration for better health and memory.',
  instructor: 'Wellness Coach',
  category: 'Wellness',
  modules: [
    {
      id: 'module-1',
      title: 'Class 1: Awareness & Connection',
      description: 'Know Your Body’s River',
      sections: [
        {
          id: 'm1-s1',
          title: 'Course Content',
          description: 'Introduction to hydration',
          chapters: [
            {
              id: 'm1-c1',
              title: 'The Power of Water',
              description: 'Why water matters',
              content: {
                type: 'text',
                title: 'Water: Essential for Life',
                content: `
                  <div class="space-y-4">
                    <p class="text-lg">Water is essential for every organ and brain function.</p>
                    <p class="text-lg">Hydration improves energy, mood, and memory.</p>
                    <p class="text-lg font-bold text-teal-600">Remember the W.A.T.E.R. mnemonic to stay hydrated all day.</p>
                  </div>
                `
              }
            }
          ]
        },
        {
          id: 'm1-s2',
          title: 'Knowledge Check',
          description: 'Test your understanding',
          chapters: [
            {
              id: 'm1-c2',
              title: 'Quick Quiz',
              description: 'Single Choice Question',
              content: {
                type: 'quiz',
                title: 'Main Function of Water',
                questions: [
                  {
                    id: 'q1',
                    question: 'What is the main function of water in our body?',
                    options: [
                      { id: 'A', label: 'Only to quench thirst', correct: false },
                      { id: 'B', label: 'Helps digestion, brain, and mood', correct: true },
                      { id: 'C', label: 'Just cools the body', correct: false },
                      { id: 'D', label: 'Makes us sleepy', correct: false }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm1-c3',
              title: 'Hydration Rules',
              description: 'Multiple Choice Question',
              content: {
                type: 'quiz',
                title: 'W.A.T.E.R. Rule',
                questions: [
                  {
                    id: 'q2',
                    question: 'When should you drink water according to the W.A.T.E.R. rule? (Select all that apply)',
                    options: [
                      { id: 'A', label: 'After waking up', correct: true },
                      { id: 'B', label: 'Before meals', correct: true },
                      { id: 'C', label: 'Every two hours', correct: true },
                      { id: 'D', label: 'Only when thirsty', correct: false }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm1-c4',
              title: 'One-Word Recall',
              description: 'One-word Answer',
              content: {
                type: 'activities',
                title: 'Recall Challenge',
                activity_type: 'single_choice', // Re-using activity type/structure for text input simulation or adding new type support
                description: 'What does the letter "W" in W.A.T.E.R. stand for?',
                options: ['Wake'] // Using options to store correct answer for validation
              }
            }
          ]
        },

      ]
    },
    {
      id: 'module-2',
      title: 'Class 2: Habit Building',
      description: 'Hydration Hero Challenge',
      sections: [
        {
          id: 'm2-s1',
          title: 'Course Content',
          description: 'Building habits',
          chapters: [
            {
              id: 'm2-c1',
              title: 'Forming Habits',
              description: 'Core Content',
              content: {
                type: 'text',
                title: 'Become a Hydration Hero',
                content: `
                  <div class="space-y-4">
                    <p class="text-lg">Drinking water regularly forms a healthy habit.</p>
                    <p class="text-lg">Pair drinking with daily actions using <strong>anchor techniques</strong>.</p>
                    <p class="text-lg">Become a "Hydration Hero" through recall and routine.</p>
                  </div>
                `
              }
            }
          ]
        },
        {
          id: 'm2-s2',
          title: 'Knowledge Check',
          description: 'Test your memory',
          chapters: [
            {
              id: 'm2-c2',
              title: 'Habit Quiz',
              description: 'Single Choice Question',
              content: {
                type: 'quiz',
                title: 'Building Habits',
                questions: [
                  {
                    id: 'q3',
                    question: 'What helps in building a consistent water habit?',
                    options: [
                      { id: 'A', label: 'Drinking once a day', correct: false },
                      { id: 'B', label: 'Pairing it with routine activities', correct: true },
                      { id: 'C', label: 'Drinking only when reminded', correct: false },
                      { id: 'D', label: 'Avoiding it at night', correct: false }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm2-c3',
              title: 'Anchors Quiz',
              description: 'Multiple Choice Question',
              content: {
                type: 'quiz',
                title: 'Hydration Anchors',
                questions: [
                  {
                    id: 'q4',
                    question: 'Which of these are good hydration anchors? (Select all that apply)',
                    options: [
                      { id: 'A', label: 'After brushing teeth', correct: true },
                      { id: 'B', label: 'After phone calls', correct: true },
                      { id: 'C', label: 'Before lunch', correct: true },
                      { id: 'D', label: 'Watching TV', correct: false }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm2-c4',
              title: 'One-Word Recall',
              description: 'One-word Answer',
              content: {
                type: 'activities',
                title: 'Technique Name',
                activity_type: 'single_choice',
                description: 'What is the name of the technique that pairs water with daily tasks?',
                options: ['Anchor']
              }
            }
          ]
        },

      ]
    },
    {
      id: 'module-3',
      title: 'Class 3: Reinforcement',
      description: 'Water & Wisdom',
      sections: [
        {
          id: 'm3-s1',
          title: 'Course Content',
          description: 'Lifelong habits',
          chapters: [
            {
              id: 'm3-c1',
              title: 'Reinforcement',
              description: 'Core Content',
              content: {
                type: 'text',
                title: 'Staying on Track',
                content: `
                  <div class="space-y-4">
                    <p class="text-lg">Hydration is a lifelong habit powered by memory and repetition.</p>
                    <p class="text-lg">Recall W.A.T.E.R. and use daily reminders.</p>
                    <p class="text-lg text-teal-600 font-bold">Celebrate progress and make hydration joyful.</p>
                  </div>
                `
              }
            }
          ]
        },
        {
          id: 'm3-s2',
          title: 'Knowledge Check',
          description: 'Final Review',
          chapters: [
            {
              id: 'm3-c2',
              title: 'Memory Quiz',
              description: 'Single Choice Question',
              content: {
                type: 'quiz',
                title: 'Memory Strength',
                questions: [
                  {
                    id: 'q5',
                    question: 'What helps keep hydration memory strong?',
                    options: [
                      { id: 'A', label: 'Spaced repetition', correct: true },
                      { id: 'B', label: 'Ignoring water reminders', correct: false },
                      { id: 'C', label: 'Drinking only during meals', correct: false },
                      { id: 'D', label: 'Forgetting daily habits', correct: false }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm3-c3',
              title: 'Tools Quiz',
              description: 'Multiple Choice Question',
              content: {
                type: 'quiz',
                title: 'Helpful Tools',
                questions: [
                  {
                    id: 'q6',
                    question: 'What tools can help you remember to drink water? (Select all that apply)',
                    options: [
                      { id: 'A', label: 'Phone reminders', correct: true },
                      { id: 'B', label: 'Visual cues (colored bottles)', correct: true },
                      { id: 'C', label: 'Forgetfulness', correct: false },
                      { id: 'D', label: 'Memory games', correct: true }
                    ]
                  }
                ]
              }
            },
            {
              id: 'm3-c4',
              title: 'One-Word Completion',
              description: 'One-word Answer',
              content: {
                type: 'activities',
                title: 'Complete the Phrase',
                activity_type: 'single_choice',
                description: 'Which word completes this phrase — "Hydrate to ______"?',
                options: ['Rejuvenate']
              }
            }
          ]
        },

      ]
    }
  ]
};
