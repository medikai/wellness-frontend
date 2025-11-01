# waylness Design System

This document outlines the design system and color palette for the waylness application.

## Color Palette

### Primary Colors
- **Primary Blue**: `#3B92F6` - Main brand color
- **Secondary Navy**: `#22355E` - Secondary brand color  
- **Accent Orange**: `#F87360` - Accent color for highlights

### Health Theme Colors
- **Teal Primary**: `#4CAF9D` - Main health/waylness color
- **Teal Light**: `#E6F7F5` - Light teal for backgrounds
- **Teal Dark**: `#2D7D6B` - Dark teal for hover states

### Orange Variants
- **Orange Primary**: `#F58220` - Action buttons and CTAs
- **Orange Light**: `#FEF3E7` - Light orange backgrounds
- **Orange Dark**: `#D46A08` - Dark orange for hover states

### Neutral Colors
- **Light Gray**: `#F8F9FA` - Light backgrounds
- **Medium Gray**: `#6B7280` - Secondary text
- **Dark Gray**: `#2C4A52` - Primary text and headings
- **White**: `#FFFFFF` - Card backgrounds
- **Background**: `#FDFDFD` - Main page background

## Typography

### Font Families
- **Sans**: Geist Sans (primary)
- **Mono**: Geist Mono (code)

### Font Sizes
- **XS**: 12px
- **SM**: 14px
- **Base**: 16px
- **LG**: 18px
- **XL**: 20px
- **2XL**: 24px
- **3XL**: 30px
- **4XL**: 36px
- **5XL**: 48px

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing Scale

- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 21px
- **2XL**: 32px
- **3XL**: 48px
- **4XL**: 64px

## Border Radius

- **SM**: 4px
- **MD**: 8px
- **LG**: 12px
- **XL**: 16px
- **Full**: 9999px (circular)

## Components

### Buttons
- **Primary**: Teal background with white text
- **Secondary**: Orange background with white text
- **Outline**: Border with transparent background
- **Ghost**: Transparent with hover effects

### Cards
- White background with subtle shadow
- Rounded corners (12px default)
- 16px padding default
- Hover effects available

### Progress Bars
- Teal, orange, or primary color variants
- Smooth animations
- Optional labels and percentages

### Icons
- Line-style icons (Lucide/Feather style)
- Multiple sizes (sm, md, lg, xl)
- Customizable colors

## Usage

### Import Components
```tsx
import { Button, Card, ProgressBar, Icon } from '@/components/ui';
```

### Import Design Tokens
```tsx
import { colors, spacing, typography } from '@/design-tokens';
```

### Tailwind Classes
The design system is integrated with Tailwind CSS. Use these classes:

```tsx
// Colors
bg-teal-primary text-white
bg-orange-primary text-white
text-neutral-dark text-neutral-medium

// Spacing
p-4 p-6 p-8
m-2 m-4 m-6

// Typography
text-lg font-semibold
text-2xl font-bold
```

## Module Structure

The application follows a modular structure:

```
src/
├── modules/
│   ├── elderly/     # Elderly care module
│   ├── caregiver/   # Caregiver module
│   ├── admin/       # Admin module
│   └── coach/       # Coach module
├── components/
│   └── ui/          # Reusable UI components
├── design-tokens/   # Design system constants
└── app/             # Next.js app directory
```

Each module can have its own:
- Components
- Templates
- Styles
- Utilities

## Accessibility

- High contrast ratios for text
- Focus states for interactive elements
- Semantic HTML structure
- Screen reader friendly
- Keyboard navigation support

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Flexible grid system
- Touch-friendly button sizes