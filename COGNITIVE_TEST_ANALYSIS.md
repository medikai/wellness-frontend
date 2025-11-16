# Cognitive Test Architecture Analysis

## Current State vs. Required Architecture

### ❌ **Current Implementation Does NOT Follow the Specification**

## Key Gaps Identified

### 1. **Single-Card Architecture** ❌
**Required:** All cognitive tests on one unified screen/card
**Current:** 
- Quizzes are embedded in different layouts (`QuizContent.tsx`, `SelfPacedSession.tsx`, `JoineeMeetingScreen.tsx`)
- Games open in modals (`MemoryMatchModal.tsx`)
- No unified card structure

### 2. **Test Flow Phases** ❌
**Required:** Instruction → Practice → Test → Completion
**Current:**
- No instruction phase with audio
- No mandatory practice phase
- Tests start immediately
- No structured completion phase

### 3. **Interaction Modes** ❌
**Required:** Support 6 interaction modes (A-F) via one button/zone
**Current:**
- Only supports basic multiple-choice selection
- No single tap mode (reaction time)
- No multi-tap selection (digit span)
- No sequential navigation (Trail Making)
- No voice input (hold-to-speak)
- No timed auto-advance
- No grid tap mode

### 4. **Card Components** ❌
**Required Components:**
- ✅ Instruction Area (text + audio) - **PARTIALLY** (text only, no audio)
- ❌ Stimulus Area - **MISSING** (no dedicated area)
- ❌ Action Zone (Primary Button Zone) - **MISSING** (multiple buttons)
- ❌ Timer / Progress Indicator - **PARTIALLY** (progress exists, no timer)
- ❌ Accessibility Controls - **MISSING** (text size, audio instructions)
- ❌ Coach Mode Controls - **MISSING**

### 5. **Practice Phase** ❌
**Required:**
- Must simulate exact test interaction
- Show immediate corrective feedback
- User must pass before continuing
**Current:** No practice phase exists

### 6. **Test Phase Requirements** ❌
**Required:**
- No distractions
- Automatic timing
- Only one active interaction zone
- User cannot go backward
**Current:**
- Multiple interaction points
- No automatic timing
- Can navigate backward

## Files That Need Refactoring

1. **`src/components/course/content/QuizContent.tsx`**
   - Currently: Basic quiz with multiple buttons
   - Needs: Single-card architecture with unified interaction zone

2. **`src/components/MemoryMatchModal.tsx`**
   - Currently: Game with grid of clickable cards
   - Needs: Convert to single-card with grid tap mode

3. **`src/components/videosdk/JoineeMeetingScreen.tsx`** (QuizSection)
   - Currently: Quiz embedded in meeting screen
   - Needs: Use unified cognitive test component

4. **`src/components/SelfPacedSession.tsx`**
   - Currently: Quiz embedded in session
   - Needs: Use unified cognitive test component

## Required Implementation

### New Component Structure Needed:

```
src/components/cognitive/
├── CognitiveTestCard.tsx          # Main unified card component
├── phases/
│   ├── InstructionPhase.tsx       # Instruction with audio
│   ├── PracticePhase.tsx          # Mandatory practice
│   ├── TestPhase.tsx              # Actual test
│   └── CompletionPhase.tsx         # Success + auto-advance
├── interactions/
│   ├── SingleTapMode.tsx          # Mode A
│   ├── MultiTapMode.tsx            # Mode B
│   ├── SequentialMode.tsx          # Mode C
│   ├── VoiceInputMode.tsx          # Mode D
│   ├── AutoAdvanceMode.tsx         # Mode E
│   └── GridTapMode.tsx             # Mode F
└── controls/
    ├── TimerIndicator.tsx          # Timer/progress
    ├── AccessibilityControls.tsx   # Text size, audio
    └── CoachModeControls.tsx       # Coach-specific controls
```

## Next Steps

1. Create unified `CognitiveTestCard` component
2. Implement all 4 phases (Instruction → Practice → Test → Completion)
3. Implement all 6 interaction modes
4. Add accessibility controls
5. Refactor existing quiz/game components to use new architecture
6. Integrate into live classes and self-paced sessions

