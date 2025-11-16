// Cognitive Test Types - Following Single-Card Architecture Specification

export type InteractionMode = 
  | 'single-tap'           // Mode A: Reaction time, yes/no
  | 'multi-tap'             // Mode B: Digit span, recognition
  | 'sequential'            // Mode C: Trail Making, ordering
  | 'voice-input'           // Mode D: Verbal fluency, naming
  | 'auto-advance'          // Mode E: Memory encoding, delayed recall
  | 'grid-tap';             // Mode F: Visual search, spatial span

export type TestPhase = 'instruction' | 'practice' | 'test' | 'completion';

export interface CognitiveTestConfig {
  id: string;
  title: string;
  description?: string;
  interactionMode: InteractionMode;
  
  // Instruction Phase
  instruction: {
    text: string;
    audioUrl?: string; // Optional audio playback
  };
  
  // Practice Phase
  practice: {
    enabled: boolean;
    items: PracticeItem[];
    requiredPass: boolean; // Must pass practice to continue
  };
  
  // Test Phase
  test: {
    items: TestItem[];
    duration?: number; // Optional time limit in seconds
    autoAdvanceDelay?: number; // For auto-advance mode
  };
  
  // Stimulus configuration
  stimulus?: {
    type: 'text' | 'image' | 'sequence' | 'shape' | 'number' | 'grid';
    content?: string | string[]; // Text, image URLs, sequences, etc.
    gridConfig?: {
      rows: number;
      cols: number;
      items: GridItem[];
    };
  };
  
  // Coach mode (optional)
  coachMode?: {
    enabled: boolean;
    showAnswers?: boolean;
    showTiming?: boolean;
  };
}

export interface PracticeItem {
  id: string;
  stimulus?: string | string[];
  correctAnswer: string | number | boolean | number[];
  feedback?: {
    correct: string;
    incorrect: string;
  };
  metadata?: Record<string, unknown>;
}

export interface TestItem {
  id: string;
  stimulus?: string | string[];
  correctAnswer?: string | number | boolean | number[]; // Optional for some tests
  metadata?: Record<string, unknown>;
}

export interface GridItem {
  id: string;
  content: string | number;
  position: { row: number; col: number };
  isTarget?: boolean;
}

export interface TestResult {
  testId: string;
  phase: TestPhase;
  responses: TestResponse[];
  timing: {
    startTime: number;
    endTime: number;
    duration: number;
  };
  score?: number;
  accuracy?: number;
}

export interface TestResponse {
  itemId: string;
  response: string | number | boolean | number[] | (string | number)[];
  timestamp: number;
  reactionTime?: number; // For single-tap mode
  correct?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CognitiveTestState {
  phase: TestPhase;
  currentItemIndex: number;
  responses: TestResponse[];
  practicePassed: boolean;
  testStarted: boolean;
  testCompleted: boolean;
  startTime?: number;
  timer?: number; // Remaining time in seconds
}

