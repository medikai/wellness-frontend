# Self-Paced Course Structure

## Overview
A hierarchical course structure has been implemented following the pattern:
**Course → Modules → Sections → Chapters → Content**

## Navigation Flow

1. **Upcoming Classes** → User clicks "Start Self-Paced"
2. **Course Page** (`/course/1`) → Shows all modules
3. **Module Page** (`/course/1/module/module-1`) → Shows all sections
4. **Section Page** (`/course/1/module/module-1/section/section-1`) → Shows all chapters with content

## Content Types

### 1. Video Content
- Displays embedded video using YouTube iframe
- Used for instructional content

### 2. Survey Content
- Multiple question types:
  - Radio buttons
  - Checkboxes
  - Text input
  - Textarea
  - Range slider
- Collects user responses

### 3. Quiz Content
- Multiple choice questions
- Immediate feedback on answers
- Score tracking
- Progress through questions

### 4. Text Content
- Rich HTML content from TinyMCE
- Supports formatted text with styling

### 5. Game Content
- Interactive games (Memory Match, Focus Game, etc.)
- Opens in modal for play

### 6. Activity Content
- Hydration tracking
- MCQ activities
- Single choice activities
- Interactive health monitoring

## File Structure

```
src/
├── types/
│   └── course.ts                      # Type definitions for course hierarchy
├── data/
│   └── dummyCourseData.ts             # Dummy course data for testing
├── app/
│   └── course/
│       └── [courseId]/
│           └── page.tsx               # Course page (modules list)
│           └── module/
│               └── [moduleId]/
│                   └── page.tsx       # Module page (sections list)
│                   └── section/
│                       └── [sectionId]/
│                           └── page.tsx  # Section page (chapters with content)
└── components/
    └── course/
        ├── CourseModules.tsx          # Displays modules in a course
        ├── ModuleSections.tsx         # Displays sections in a module
        ├── SectionContent.tsx         # Displays chapters in a section
        └── content/
            ├── VideoContent.tsx       # Video player
            ├── SurveyContent.tsx      # Survey forms
            ├── QuizContent.tsx        # Quiz interface
            ├── TextContent.tsx        # Rich text display
            ├── GameContent.tsx        # Game launcher
            └── ActivityContent.tsx    # Activity tracker
```

## Dummy Course Data

The course includes:
- **Module 1: Fundamentals of Health**
  - Section 1: Hydration & Nutrition
    - Chapter 1: Daily Hydration (Video)
    - Chapter 2: Hydration Survey (Survey)
    - Chapter 3: Hydration Activity (Activity)
  - Section 2: Physical Movement
    - Chapter 4: Gentle Movement Exercises (Text)
    - Chapter 5: Movement Quiz (Quiz)
- **Module 2: Mental waylness**
  - Section 3: Breathing Techniques
    - Chapter 6: Mindful Breathing (Video)
    - Chapter 7: Breathing Practice (Activity)
- **Module 3: Cognitive Health**
  - Section 4: Brain Training Games
    - Chapter 8: Memory Game (Game)
    - Chapter 9: Focus Game (Game)

## Features

- ✅ Hierarchical navigation with back buttons
- ✅ Different content types rendered appropriately
- ✅ Interactive components (surveys, quizzes, activities)
- ✅ Responsive design
- ✅ Modern UI with gradient backgrounds
- ✅ Proper TypeScript typing
- ✅ Client/Server component separation (use client directives)

## Usage

1. Click on "Start Self-Paced" from the Upcoming Classes section
2. Navigate through modules
3. Select a section to view chapters
4. Complete the content in each chapter
