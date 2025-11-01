# Senior-Friendly UI Design for Self-Paced Courses

## Design Principles for Senior Citizens

The redesigned course navigation follows accessibility best practices for senior users:

### Key Design Features

1. **Large Buttons & Text**
   - Text sizes: 3xl-4xl for headings
   - Buttons are full-width, easy to click
   - Minimal cognitive load

2. **Simple Single-Column Layout**
   - One card at a time
   - Large visual icons (5xl emojis)
   - Clear visual hierarchy

3. **Clear Navigation Path**
   - Prominent "Back" buttons
   - Simple 3-step flow: Modules → Sections → Content
   - Each step is obvious and clickable

4. **High Contrast & Readability**
   - White cards on light background
   - Bold borders for focus
   - Large icons with color coding

5. **Touch-Friendly Design**
   - Large tap targets
   - Spacious padding (p-6, p-8)
   - Generous gaps between items

## Navigation Flow

```
Course Page (Shows Modules)
    ↓ Click Module
Module Page (Shows Sections)
    ↓ Click Section
Section Page (Shows Chapters with Content)
    ↓ Work through chapters sequentially
```

## Component Structure

### Course Page (`/course/1`)
- Large header with course title
- List of modules as full-width cards
- Each module has:
  - Large icon (24x24)
  - Module number
  - Title (text-3xl)
  - Description (text-xl)
  - "Start Module" button

### Module Page (`/course/1/module/module-1`)
- Back button at top
- Large module title
- List of sections as full-width cards
- Each section has:
  - Large colored icon
  - Section number
  - Title & description
  - "Start Learning" button with arrow

### Section Page (`/course/1/module/module-1/section/section-1`)
- Full screen experience
- Each chapter shown as a large card with:
  - Content type icon
  - Chapter number
  - Title & description
  - Content displayed inline
- "Leave Session" button always visible

## Content Types with Icons

- 🎥 Video Content
- 🧠 Quiz Content
- 📋 Survey Content
- 💧 Activity Content
- 🎮 Game Content
- 📄 Text Content

## Improvements Made

1. **Removed Complex Grid Layouts** - No more 2-column grids
2. **Single Card Focus** - One card per screen for clarity
3. **Larger Touch Targets** - All buttons are full-width
4. **Clear Visual Indicators** - Large icons and numbers
5. **Simplified Content Display** - Content shown directly, no clicking to reveal
6. **Better Spacing** - More breathing room everywhere
7. **Sequential Flow** - Clear path forward and back

## Accessibility Features

- Large, high-contrast text
- Prominent visual elements (emojis/icons)
- Full-width clickable areas
- Clear heading hierarchy
- Simple, linear navigation
- No hidden menus or complex interactions
- Feedback on hover (border color change)

This design ensures senior citizens can easily navigate and complete the self-paced courses without confusion or frustration.
