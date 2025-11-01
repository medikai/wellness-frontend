# Coursera-Style Layout for Self-Paced Courses

## Overview

Added a left navigation sidebar (similar to Coursera) for better navigation within each section. This layout provides:

- **Left Sidebar**: Fixed course navigation with chapter list
- **Main Content**: Full-width content area with selected chapter content
- **Better Navigation**: Easy chapter switching without page reload

## Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  Top Header (Section Title + Leave Session Button)      │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Left        │  Main Content Area                       │
│  Sidebar     │                                           │
│              │  ┌─────────────────────────────────┐     │
│  Course      │  │  Chapter Header                 │     │
│  Navigation  │  │  (Title, Description, Icon)     │     │
│              │  └─────────────────────────────────┘     │
│  - Chapter 1 │                                           │
│  - Chapter 2 │  ┌─────────────────────────────────┐     │
│  - Chapter 3 │  │  Chapter Content                  │     │
│  (Active)    │  │  (Video/Quiz/Survey/etc)          │     │
│  - Chapter 4 │  └─────────────────────────────────┘     │
│              │                                           │
│  Progress    │  [← Previous]    [Next →]               │
│  Indicator   │                                           │
└──────────────┴──────────────────────────────────────────┘
```

## Key Features

### 1. Fixed Left Sidebar (280px wide)

**Course Navigation Header:**
- Blue gradient background
- "Course Navigation" title
- Shows number of chapters

**Chapter List:**
- Scrollable list of all chapters in the section
- Each chapter shows:
  - Icon (🎥 📋 🧠 💧 🎮 📄)
  - Chapter number
  - Title and description
  - "Current" badge for active chapter
- Active chapter highlighted in blue
- Click any chapter to switch instantly

**Progress Indicator:**
- Shows current chapter / total chapters
- Visual progress bar
- Auto-updates as user progresses

### 2. Main Content Area

**Chapter Header Card:**
- Large section at top
- Shows chapter icon, number, title, and description
- Blue border for emphasis

**Chapter Content:**
- Displays based on content type:
  - 🎥 Video: Embedded video player
  - 🧠 Quiz: Interactive quiz
  - 📋 Survey: Survey form
  - 💧 Activity: Activity tracker
  - 🎮 Game: Game launcher
  - 📄 Text: Rich text content

**Navigation Buttons:**
- Previous/Next chapter buttons
- Disabled state for first/last chapter
- Smooth scroll to top on navigation

### 3. Top Header

- Section title and description
- "Leave Session" button
- Always visible and accessible

## Benefits for Senior Users

### Easy Navigation
- **Visual Chapter List**: See all chapters at once
- **One-Click Switching**: Change chapters without reloading
- **Progress Tracking**: Always know where you are

### Focused Experience
- **Single Chapter View**: Focus on one chapter at a time
- **Clear Context**: Always see what section you're in
- **Simple Controls**: Previous/Next buttons

### Accessibility
- **Large Touch Targets**: Chapter buttons are easy to click
- **Clear Visuals**: Icons and colors guide the user
- **Consistent Layout**: Same structure throughout

## User Flow

1. **Course Page**: User sees all modules
2. **Module Page**: User selects a module, sees sections
3. **Section Page**: User sees this new Coursera-style layout
   - Left sidebar lists all chapters
   - Main area shows selected chapter
   - User can click any chapter in sidebar to switch
   - Navigate with Previous/Next buttons

## Technical Implementation

### Component: `CourseraStyleLayout.tsx`

- Manages active chapter state
- Renders content based on type
- Handles chapter navigation
- Shows progress indicator
- Modal for feedback on exit

### Layout Features

- Fixed left sidebar (doesn't scroll with content)
- Scrollable main content area
- Full height layout (full viewport height)
- Responsive padding and spacing
- Smooth transitions on chapter switch

## Navigation Structure

```
/course/1 → Shows modules
/course/1/module/module-1 → Shows sections
/course/1/module/module-1/section/section-1 → Coursera-style layout
  ├─ Left Sidebar: Chapter navigation
  └─ Main Content: Selected chapter
```

This design provides a familiar, intuitive interface similar to popular learning platforms like Coursera, making it easy for senior users to navigate through course content.
