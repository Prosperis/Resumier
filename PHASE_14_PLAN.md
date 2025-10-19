# Phase 14: Animations - Implementation Plan

**Goal**: Add polished animations with Framer Motion to enhance user experience  
**Status**: 🚧 In Progress  
**Dependencies**: framer-motion@12.23.24 (already installed)

---

## Overview

Enhance the Resumier application with smooth, accessible animations using Framer Motion. Focus on micro-interactions, page transitions, and loading states while respecting user accessibility preferences.

---

## Objectives

1. ✅ Create reusable animation presets and variants
2. ✅ Add page/route transitions
3. ✅ Animate component mount/unmount
4. ✅ Implement micro-interactions (hovers, clicks, focus)
5. ✅ Add gesture-based interactions where appropriate
6. ✅ Create loading animations and skeletons
7. ✅ Respect `prefers-reduced-motion` accessibility setting

---

## Technical Stack

### Already Installed
- **framer-motion@12.23.24** - Main animation library
- **motion-dom** - DOM utilities (included)
- **motion-utils** - Animation utilities (included)

### Key APIs to Use
- `motion` components - Animated HTML elements
- `AnimatePresence` - Exit animations
- `useAnimation` - Programmatic control
- `useInView` - Scroll-triggered animations
- `useReducedMotion` - Accessibility hook
- `variants` - Reusable animation patterns

---

## Architecture

### Animation System Structure

```
src/lib/animations/
  ├── variants.ts           # Reusable animation variants
  ├── transitions.ts        # Transition configurations
  ├── presets.ts           # Common animation presets
  └── hooks/
      ├── use-reduced-motion.ts
      └── use-animate-in-view.ts

src/components/ui/animated/
  ├── fade-in.tsx          # Fade in wrapper
  ├── slide-in.tsx         # Slide in wrapper
  ├── scale-in.tsx         # Scale in wrapper
  └── stagger-children.tsx # Stagger animation wrapper
```

---

## Implementation Phases

### Phase 14.1: Animation Foundation (30-45 min)

**Goals**: Set up animation system and create reusable presets

**Tasks**:
1. Create animation variants library (`variants.ts`)
   - Fade variants (in, out, up, down, left, right)
   - Slide variants (from all directions)
   - Scale variants (in, out, bounce)
   - Stagger variants (for list items)

2. Create transition presets (`transitions.ts`)
   - Default transitions
   - Spring animations
   - Ease curves
   - Duration configurations

3. Create accessibility hook (`use-reduced-motion.ts`)
   - Detect `prefers-reduced-motion`
   - Disable animations when requested
   - Provide fallback behavior

4. Create animated wrapper components
   - `<FadeIn>` - Fade in on mount
   - `<SlideIn>` - Slide in from direction
   - `<ScaleIn>` - Scale up on mount
   - `<StaggerChildren>` - Stagger child animations

**Deliverables**:
- Animation library with variants
- Reusable animation components
- Accessibility support built-in

---

### Phase 14.2: Page Transitions (30-45 min)

**Goals**: Add smooth transitions between routes/pages

**Tasks**:
1. Wrap routing with `AnimatePresence`
2. Add page fade/slide transitions
3. Handle exit animations
4. Optimize for performance (layout animations)

**Components to Animate**:
- Resume dashboard → Resume editor
- Resume editor → Preview
- Login → Dashboard
- Settings dialog open/close

**Animation Pattern**:
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Deliverables**:
- Smooth page transitions
- Exit animations
- Route-based animation keys

---

### Phase 14.3: Component Animations (45-60 min)

**Goals**: Animate component mount/unmount and interactions

**Tasks**:
1. **Dialog/Modal Animations**
   - Fade in backdrop
   - Scale in content
   - Smooth exit
   - Components: PersonalInfoDialog, JobInfoDialog, SettingsDialog

2. **Dropdown/Menu Animations**
   - Slide down menus
   - Fade in items
   - Components: DropdownMenu, Select, Combobox

3. **Card Animations**
   - Hover lift effect
   - Focus ring animation
   - Components: Resume cards (if using cards view toggle)

4. **Button Animations**
   - Scale on press
   - Ripple effect (optional)
   - Loading spinner animation
   - Components: All Button variants

5. **Form Animations**
   - Input focus animations
   - Label float animation
   - Error shake animation
   - Success checkmark animation

**Animation Examples**:

**Card Hover**:
```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* Card content */}
</motion.div>
```

**Button Press**:
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

**Deliverables**:
- Animated dialogs
- Interactive button animations
- Form field animations
- Card micro-interactions

---

### Phase 14.4: List & Table Animations (30-45 min)

**Goals**: Animate lists, tables, and repeated items

**Tasks**:
1. **Table Row Animations**
   - Fade in rows on load
   - Stagger effect
   - Smooth reordering
   - Component: ResumeTable

2. **List Item Animations**
   - Experience list items
   - Education list items
   - Certification list items
   - Skills chips

3. **Drag-and-Drop Animations**
   - Enhance existing DnD with motion
   - Add layout animations
   - Smooth reordering

**Stagger Pattern**:
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

**Deliverables**:
- Staggered list animations
- Table row animations
- Enhanced drag-and-drop

---

### Phase 14.5: Loading & Skeleton Animations (30-45 min)

**Goals**: Create loading states and skeleton screens

**Tasks**:
1. **Loading Spinner**
   - Rotating spinner
   - Pulse animation
   - Progress indicators

2. **Skeleton Screens**
   - Resume table skeleton
   - Form skeleton
   - Card skeleton
   - Shimmer effect

3. **Progress Animations**
   - Linear progress bar
   - Circular progress
   - Step indicators

**Skeleton Pattern**:
```tsx
const shimmer = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1.5,
      ease: "linear"
    }
  }
}

<motion.div
  className="bg-gradient-to-r from-muted via-muted-foreground/10 to-muted"
  style={{ backgroundSize: "200% 100%" }}
  variants={shimmer}
  initial="initial"
  animate="animate"
/>
```

**Deliverables**:
- Loading spinner component
- Skeleton screen components
- Progress indicators

---

### Phase 14.6: Micro-Interactions & Polish (30-45 min)

**Goals**: Add delightful micro-interactions throughout the app

**Tasks**:
1. **Navigation Animations**
   - Sidebar collapse/expand
   - Menu item hover
   - Active link indicator

2. **Toast/Notification Animations**
   - Slide in from corner
   - Auto-dismiss animation
   - Stack management

3. **Badge Animations**
   - Pulse for new items
   - Count animation
   - Status changes

4. **Icon Animations**
   - Hover rotations
   - Click feedback
   - State transitions

5. **Success/Error Animations**
   - Checkmark draw animation
   - Error shake
   - Celebration confetti (optional)

**Icon Rotation Example**:
```tsx
<motion.div
  whileHover={{ rotate: 180 }}
  transition={{ duration: 0.3 }}
>
  <Settings className="h-5 w-5" />
</motion.div>
```

**Deliverables**:
- Navigation animations
- Toast animations
- Icon micro-interactions
- Success/error feedback

---

## Animation Guidelines

### Performance Best Practices

1. **Use Transform & Opacity** - GPU accelerated
   ```tsx
   // ✅ Good - GPU accelerated
   animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
   
   // ❌ Bad - Triggers layout
   animate={{ width: 100, height: 100, top: 0, left: 0 }}
   ```

2. **Layout Animations** - Use `layout` prop sparingly
   ```tsx
   <motion.div layout>Content</motion.div>
   ```

3. **Will-Change** - Only when necessary
   ```tsx
   <motion.div style={{ willChange: "transform" }}>
   ```

### Accessibility

1. **Always Check Reduced Motion**
   ```tsx
   const shouldReduceMotion = useReducedMotion()
   
   <motion.div
     animate={shouldReduceMotion ? {} : { scale: 1.2 }}
   >
   ```

2. **Provide Instant Alternatives**
   ```tsx
   const transition = shouldReduceMotion
     ? { duration: 0 }
     : { type: "spring", stiffness: 300 }
   ```

3. **Don't Disable Functionality**
   - Animations enhance, don't block
   - All features work without animations

### Duration Guidelines

- **Micro-interactions**: 150-300ms
- **Component mount**: 200-400ms
- **Page transitions**: 300-500ms
- **Loading states**: Continuous or 1-2s
- **Gestures**: Immediate feedback (<100ms)

### Easing Functions

```typescript
export const easings = {
  easeInOut: [0.4, 0.0, 0.2, 1],
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  sharp: [0.4, 0.0, 0.6, 1],
}
```

---

## Components Priority List

### High Priority (Phase 14.1-14.3)
1. ✅ Animation variants library
2. ✅ Accessibility hook
3. ✅ Dialog animations (PersonalInfoDialog, JobInfoDialog, SettingsDialog)
4. ✅ Button animations (all variants)
5. ✅ Page transitions
6. ✅ Form field animations

### Medium Priority (Phase 14.4-14.5)
7. ✅ Table animations (ResumeTable)
8. ✅ Loading spinner
9. ✅ Skeleton screens
10. ✅ Dropdown/Menu animations

### Low Priority (Phase 14.6)
11. ✅ Navigation animations
12. ✅ Toast animations
13. ✅ Icon micro-interactions
14. ✅ Badge animations

---

## Testing Strategy

### Visual Testing
- Test all animations in browser
- Check different screen sizes
- Verify smooth 60fps performance
- Test on slower devices

### Accessibility Testing
- Enable "Reduce Motion" in OS settings
- Verify animations disable properly
- Test keyboard navigation still works
- Ensure no animation-dependent functionality

### Performance Testing
- Monitor frame rates with DevTools
- Check for layout thrashing
- Verify no jank on scroll
- Test with React DevTools Profiler

---

## Success Criteria

- ✅ All interactions feel smooth and responsive
- ✅ Animations respect `prefers-reduced-motion`
- ✅ No performance degradation (maintain 60fps)
- ✅ Consistent animation style throughout app
- ✅ Loading states provide clear feedback
- ✅ Micro-interactions delight users
- ✅ Accessibility maintained or improved

---

## Timeline Estimate

- **Phase 14.1**: Foundation (30-45 min)
- **Phase 14.2**: Page transitions (30-45 min)
- **Phase 14.3**: Component animations (45-60 min)
- **Phase 14.4**: List animations (30-45 min)
- **Phase 14.5**: Loading states (30-45 min)
- **Phase 14.6**: Polish (30-45 min)

**Total**: ~3-5 hours

---

## Next Steps

1. Start with Phase 14.1 (Foundation)
2. Create animation variants library
3. Build reusable animated components
4. Add accessibility support
5. Progressively enhance UI with animations

---

Ready to begin! 🎨✨
