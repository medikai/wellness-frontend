'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Course,
  CourseContent,
  Section,
  Chapter,
  RawChapterContent,
  TextContent,
  QuizContent,
  QuizQuestion,
  ActivityContent,
  GameContent,
} from '@/types/course'
import { courseService } from '@/services/courseService'
import confetti from 'canvas-confetti'

import { Icon } from '@/components/ui'

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



const getContentType = (content: CourseContent | RawChapterContent): string => {
  if ('content_type' in content) {
    return content.content_type
  }
  return content.type
}

export default function UnifiedCourseLayout({
  courseId,
  course: initialCourse,
  initialModuleId: _initialModuleId,
  initialSectionId: _initialSectionId,
  onClose,
}: {
  courseId: string
  course?: Course
  initialModuleId?: string
  initialSectionId?: string
  onClose?: () => void
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // State for course data
  const [course, setCourse] = useState<Course | null>(initialCourse || null)
  const [loading, setLoading] = useState(!initialCourse)
  const [error, setError] = useState<string | null>(null)

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [selectedSection, setSelectedSection] = useState<SelectedSectionState | null>(null)

  // Quiz/Activity State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({}) // qId -> [values]
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null)
  const [oneWordAnswer, setOneWordAnswer] = useState<string>('')
  const [gameStatus, setGameStatus] = useState<'start' | 'playing' | 'completed'>('start')

  // Fetch course outline
  useEffect(() => {
    if (initialCourse) return;

    async function loadCourse() {
      try {
        setLoading(true)
        const response = await courseService.getOutline(courseId)
        if (response.ok) {
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
  }, [courseId, initialCourse])

  // Initial content load
  useEffect(() => {
    if (!course || selectedSection) return

    async function loadInitial() {
      try {
        if (course && course.modules.length > 0 && course.modules[0].sections.length > 0) {
          const firstModule = course.modules[0]
          const firstSection = firstModule.sections[0]
          setExpandedModules(new Set([firstModule.id]))
          handleSectionClick(firstModule.id, firstSection)
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadInitial()
  }, [course])

  const activeContentId = selectedSection?.activeContentId
  useEffect(() => {
    setSelectedOptions({})
    setQuizFeedback(null)
    setOneWordAnswer('')
    setGameStatus('start')
  }, [activeContentId])

  // Progress Calculation
  const allChapters = course?.modules.flatMap(m => m.sections.flatMap(s => (s as SectionWithChapters).chapters)) || [];
  const currentChapterIndex = allChapters.findIndex(c => c.id === selectedSection?.activeChapterId);
  const progress = allChapters.length > 0 ? Math.round(((currentChapterIndex + 1) / allChapters.length) * 100) : 0;

  const triggerCelebration = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Fire from center (modal center is roughly viewport center)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.5, y: 0.6 }, // Slightly below center to look like it's popping up
        gravity: 0.8,
        scalar: 1.2
      });
    }, 250);
  }




  const toggleModule = (moduleId: string) => {
    const newSet = new Set<string>()
    if (!expandedModules.has(moduleId)) {
      newSet.add(moduleId)
    }
    setExpandedModules(newSet)
  }

  const handleSectionClick = async (moduleId: string, section: Section) => {
    const sectionWithChapters = section as SectionWithChapters
    if (!sectionWithChapters.chapters || sectionWithChapters.chapters.length === 0) {
      return
    }

    const firstChapter = sectionWithChapters.chapters[0]
    let activeContentId: string | undefined
    if (Array.isArray(firstChapter.content) && firstChapter.content.length > 0) {
      // Safe access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contentArray = firstChapter.content as any[];
      activeContentId = contentArray[0].id;
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
    // if (!selectedSection?.activeContentId) return // Removed strict check
    try {
      // Find current position
      if (!course || !selectedSection) return

      let currentModuleIndex = -1;
      let currentSectionIndex = -1;
      let currentChapterIndex = -1;

      // Naive search for current position
      course.modules.forEach((m, mIdx) => {
        if (m.id === selectedSection.moduleId) currentModuleIndex = mIdx;
      });

      if (currentModuleIndex === -1) return;
      const currentModule = course.modules[currentModuleIndex];

      currentModule.sections.forEach((s, sIdx) => {
        if (s.id === selectedSection.sectionId) currentSectionIndex = sIdx;
      });

      if (currentSectionIndex === -1) return;
      const currentSection = currentModule.sections[currentSectionIndex] as SectionWithChapters;

      currentSection.chapters.forEach((c, cIdx) => {
        if (c.id === selectedSection.activeChapterId) currentChapterIndex = cIdx;
      });

      // Logic to move to next structure:
      // 1. Next chapter in same section?
      // 2. Next section in same module?
      // 3. Next module?

      if (currentChapterIndex < currentSection.chapters.length - 1) {
        const nextChapter = currentSection.chapters[currentChapterIndex + 1];
        setSelectedSection({
          ...selectedSection, // safely spread existing valid state
          activeChapterId: nextChapter.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activeContentId: (nextChapter.content as any).id || undefined // Assuming structure
        });
        return;
      }

      if (currentSectionIndex < currentModule.sections.length - 1) {
        const nextSection = currentModule.sections[currentSectionIndex + 1] as SectionWithChapters;
        if (nextSection.chapters.length > 0) {
          setSelectedSection({
            moduleId: selectedSection.moduleId, // Explicitly carry over valid module ID
            sectionId: nextSection.id,
            section: nextSection,
            activeChapterId: nextSection.chapters[0].id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activeContentId: (nextSection.chapters[0].content as any).id || undefined
          });
        }
        return;
      }

      if (currentModuleIndex < course.modules.length - 1) {
        const nextModule = course.modules[currentModuleIndex + 1];
        if (nextModule.sections.length > 0) {
          const nextSection = nextModule.sections[0] as SectionWithChapters;
          if (nextSection.chapters.length > 0) {
            setSelectedSection({
              moduleId: nextModule.id,
              sectionId: nextSection.id,
              section: nextSection,
              activeChapterId: nextSection.chapters[0].id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              activeContentId: (nextSection.chapters[0].content as any).id || undefined
            });
            setExpandedModules(new Set([nextModule.id]));
            triggerCelebration(); // Celebration on module completion
          }
        }
        return;
      }

      triggerCelebration();
      // alert("Congratulations! You have completed the course.");

    } catch (e) {
      console.error(e)
    }
  }



  // --- Type Specific Handlers ---

  const handleQuizSubmit = (questions: QuizQuestion[]) => {
    let allCorrect = true;
    for (const q of questions) {
      const userAnswers = selectedOptions[q.id] || [];
      const correctAnswers = q.options.filter(o => o.correct).map(o => o.id);

      if (userAnswers.length !== correctAnswers.length) {
        allCorrect = false;
        break;
      }
      if (!userAnswers.every(a => correctAnswers.includes(a))) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setQuizFeedback("Correct! Moving on...");
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setQuizFeedback("Some answers are incorrect. Please try again.");
    }
  }

  const handleOneWordSubmit = (correctWord: string) => {
    if (oneWordAnswer.trim().toLowerCase() === correctWord.toLowerCase()) {
      setQuizFeedback("Correct! Perfect memory.");
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setQuizFeedback(`Incorrect. Hint: It starts with ${correctWord.charAt(0)}`);
    }
  }

  const handleGameComplete = () => {
    setGameStatus('completed');
    setTimeout(() => {
      handleNext();
    }, 1500);
  }

  const toggleOption = (qId: string, optId: string, isRadio: boolean) => {
    // Find the question and its options to determine correctness
    // This requires finding the question in the course data again or passing it in.
    // simpler to traverse or modify how toggleOption is called, but let's stick to safe access.

    // We can infer correctness if we pass it or if we find it. 
    // Given the structure, finding it in `toggleOption` is expensive/complex without passing data.
    // Let's refactor the render loop to handle the logic inline or pass necessary data.
  }


  // --- Renderers ---

  const renderContent = () => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!selectedSection) return <div>Select a section</div>

    const activeChapter = selectedSection.section.chapters.find(c => c.id === selectedSection.activeChapterId)
    if (!activeChapter) return <div>Chapter not found</div>

    // Assuming content is not array for dummy data simplicity or handled above
    const activeContent: CourseContent = activeChapter.content as CourseContent;
    const type = getContentType(activeContent);

    return (
      <div className="flex-1 h-full overflow-y-auto hide-scrollbar p-6 lg:p-10">
        <div className="max-w-5xl mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-dark">{activeChapter.title}</h1>
            <div className="flex items-center gap-4">
              {quizFeedback && (
                <div className={`px-4 py-2 rounded-full text-sm font-bold animate-fade-in ${quizFeedback.includes("Correct") || quizFeedback.includes("Perfect") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {quizFeedback}
                </div>
              )}
              <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                {selectedSection.section.title}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-8 lg:p-12 min-h-[500px] flex flex-col justify-center">

            {type === 'text' && (
              <div className="prose max-w-none prose-teal">
                <h2 className="text-xl font-bold mb-4">{(activeContent as TextContent).title}</h2>
                <div dangerouslySetInnerHTML={{ __html: (activeContent as TextContent).content }} />
                <div className="mt-8 flex justify-end">
                  <button onClick={handleNext} className="bg-teal-primary text-white px-6 py-2 rounded-lg hover:bg-teal-dark">
                    Next
                  </button>
                </div>
              </div>
            )}

            {type === 'quiz' && (
              <div>
                <h2 className="text-xl font-bold mb-6">{(activeContent as QuizContent).title}</h2>
                {(activeContent as QuizContent).questions.map((q, idx) => {
                  const isMultiple = q.options.filter(o => o.correct).length > 1;
                  const isSingleQuestion = (activeContent as QuizContent).questions.length === 1;

                  return (
                    <div key={q.id} className="mb-8">
                      <p className="font-semibold text-lg mb-4">{idx + 1}. {q.question}</p>
                      <div className="space-y-3">
                        {q.options.map(opt => {
                          const isSelected = (selectedOptions[q.id] || []).includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                const correctOptions = q.options.filter(o => o.correct).map(o => o.id);
                                const isCorrect = opt.correct;

                                if (isMultiple) {
                                  // Multiple Choice Logic (Instant Validation)
                                  if (isCorrect) {
                                    // Add if not already selected
                                    const currentSelected = selectedOptions[q.id] || [];
                                    if (!currentSelected.includes(opt.id)) {
                                      const newSelected = [...currentSelected, opt.id];
                                      setSelectedOptions(prev => ({ ...prev, [q.id]: newSelected }));

                                      // Check if ALL correct are found
                                      const allFound = correctOptions.every(id => newSelected.includes(id));
                                      if (allFound) {
                                        setQuizFeedback("Perfect! All correct.");
                                        setTimeout(handleNext, 1500);
                                      } else {
                                        setQuizFeedback(`Correct! Find ${correctOptions.length - newSelected.length} more.`);
                                      }
                                    }
                                  } else {
                                    // Incorrect
                                    setQuizFeedback("Incorrect choice. Try again!");
                                  }
                                } else {
                                  // Single Choice Logic
                                  // toggleOption(q.id, opt.id, !isMultiple); // This line is no longer needed as logic is inline
                                  setSelectedOptions(prev => ({ ...prev, [q.id]: [opt.id] })); // Select the option
                                  if (opt.correct) {
                                    setQuizFeedback("Correct! Moving on...");
                                    setTimeout(handleNext, 1500);
                                  } else {
                                    setQuizFeedback("Incorrect. Try again!");
                                  }
                                }
                              }}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                                    ${isSelected ? 'border-teal-primary bg-teal-50' : 'border-neutral-200 hover:border-teal-200'}
                                                `}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <Icon name="check" size="sm" className="text-teal-primary" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {type === 'activities' && (activeContent as ActivityContent).activity_type === 'single_choice' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{(activeContent as ActivityContent).title}</h2>
                <p className="text-lg mb-6">{(activeContent as ActivityContent).description}</p>

                <input
                  type="text"
                  value={oneWordAnswer}
                  onChange={(e) => setOneWordAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 text-lg border-2 border-neutral-300 rounded-xl focus:border-teal-primary outline-none mb-6"
                />

                <button
                  onClick={() => handleOneWordSubmit((activeContent as ActivityContent).options![0])} // Assuming correct answer is in options[0]
                  className="w-full bg-teal-primary text-white py-3 rounded-xl font-bold hover:bg-teal-dark transition-colors"
                >
                  Submit
                </button>
              </div>
            )}

            {type === 'games' && (
              <div className="py-10 text-center w-full">
                <div className="text-6xl mb-6">🎮</div>
                <h2 className="text-2xl font-bold mb-2">{(activeContent as GameContent).title}</h2>
                <p className="text-neutral-medium w-full max-w-2xl mx-auto mb-8">{(activeContent as GameContent).description}</p>

                {gameStatus === 'start' && (
                  <button onClick={() => setGameStatus('playing')} className="bg-teal-primary text-white px-8 py-3 rounded-full font-bold text-lg animate-bounce">
                    Start Game
                  </button>
                )}

                {gameStatus === 'playing' && (
                  <div className="animate-pulse">
                    <p className="text-xl font-bold text-teal-600 mb-4">Game in progress...</p>
                    <button onClick={handleGameComplete} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold">
                      Simulate Win!
                    </button>
                  </div>
                )}

                {gameStatus === 'completed' && (
                  <div className="flex flex-col items-center">
                    <p className="text-xl font-bold text-green-600 mb-4">Great Job! 🎉</p>
                    <button
                      onClick={handleNext}
                      className="bg-teal-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-dark transition-colors shadow-lg"
                    >
                      Next Lesson
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div >
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <div className="bg-gradient-to-r from-teal-primary to-teal-dark border-b border-neutral-light/50 shadow-sm sticky top-0 z-40 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 text-white shrink-0 mr-8">
          {!onClose && (
            <>
              <button
                onClick={() => router.push('/classes')}
                className="flex items-center space-x-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Icon name="chevronLeft" size="sm" color="white" />
                <span>Back to Classes</span>
              </button>
              <div className="h-6 w-px bg-white/20"></div>
            </>
          )}
          <h2 className="font-bold text-lg whitespace-nowrap">{course?.title || 'Loading...'}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {course?.modules.map((module) => {
              // const isExpanded = expandedModules.has(module.id)
              const isCurrentModule = selectedSection?.moduleId === module.id;

              return (
                <div key={module.id} className="relative">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${isCurrentModule
                        ? 'bg-white text-teal-dark shadow-sm'
                        : 'text-white/90 opacity-70'
                      }
                  `}
                  >
                    <span>{module.title}</span>
                  </button>
                </div>
              )
            })}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Close"
            >
              <Icon name="x" size="sm" color="white" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-neutral-light h-1.5">
        <div
          className="bg-orange-primary h-1.5 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {renderContent()}
      </div>
    </div>
  )
}
