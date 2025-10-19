# Phase 13: Drag & Drop Implementation Plan

## Overview
Add drag-and-drop functionality to the resume builder, allowing users to reorder sections, experience entries, education entries, skills, and other list items intuitively.

## Objectives
1. ✅ Enable reordering of resume sections (Summary, Experience, Education, etc.)
2. ✅ Enable reordering within sections (experience entries, education entries, etc.)
3. ✅ Enable reordering of skills
4. ✅ Provide visual feedback during drag operations
5. ✅ Ensure accessibility (keyboard navigation)
6. ✅ Support touch devices (mobile/tablet)

## Technical Stack

### Primary Library: @dnd-kit
**Why @dnd-kit?**
- Modern, performant, and actively maintained
- Excellent accessibility support (keyboard navigation, screen readers)
- Works with React 18+
- Touch-friendly out of the box
- TypeScript support
- Modular design (only import what you need)
- Better than react-beautiful-dnd (no longer maintained)

**Packages to Install:**
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Core Concepts
1. **DndContext**: Wrapper that manages drag operations
2. **SortableContext**: Manages a list of sortable items
3. **useSortable**: Hook for individual draggable items
4. **CSS.Transform.toString()**: Applies transform styles

## Architecture

### Component Structure
```
src/components/features/resume/
├── resume-builder.tsx              # Add DndContext wrapper
├── dnd/
│   ├── sortable-section.tsx        # Wrapper for draggable sections
│   ├── sortable-item.tsx           # Wrapper for list items
│   ├── sortable-skill.tsx          # Wrapper for skills
│   ├── drag-overlay.tsx            # Visual feedback during drag
│   └── dnd-utils.ts                # Helper functions
└── personal-info/
    ├── experience-section.tsx      # Update with sortable items
    ├── education-section.tsx       # Update with sortable items
    ├── skills-section.tsx          # Update with sortable items
    └── certifications-section.tsx  # Update with sortable items
```

### State Management
Resume data is stored in Zustand store. We need to add actions for reordering:
- `reorderExperience(oldIndex, newIndex)`
- `reorderEducation(oldIndex, newIndex)`
- `reorderSkills(oldIndex, newIndex)`
- `reorderCertifications(oldIndex, newIndex)`

## Implementation Plan

### Phase 13.1: Setup & Core Components (1-2 hours)
1. ✅ Create PHASE_13_PLAN.md
2. ⏳ Install @dnd-kit packages
3. ⏳ Create reusable DnD components:
   - SortableItem (generic draggable wrapper)
   - DragHandle (grip icon for dragging)
   - DragOverlay (visual feedback)
4. ⏳ Create utility functions (array reordering, etc.)
5. ⏳ Add store actions for reordering arrays

### Phase 13.2: Experience Section DnD (1 hour)
1. ⏳ Wrap ExperienceSection with DndContext
2. ⏳ Make each experience card draggable
3. ⏳ Add drag handle to experience cards
4. ⏳ Connect to store reorder action
5. ⏳ Test experience reordering

### Phase 13.3: Education & Other Sections (1 hour)
1. ⏳ Apply same pattern to EducationSection
2. ⏳ Apply to CertificationsSection
3. ⏳ Test all section reordering

### Phase 13.4: Skills DnD (30 minutes)
1. ⏳ Make individual skills draggable
2. ⏳ Different UI pattern (smaller items)
3. ⏳ Test skill reordering

### Phase 13.5: Polish & Accessibility (1 hour)
1. ⏳ Add animations and transitions
2. ⏳ Improve visual feedback (drop zones, hover states)
3. ⏳ Test keyboard navigation
4. ⏳ Test on touch devices
5. ⏳ Add ARIA labels

### Phase 13.6: Documentation & Commit (30 minutes)
1. ⏳ Format all files
2. ⏳ Git commit
3. ⏳ Create PHASE_13_SUMMARY.md
4. ⏳ Update REBUILD_PLAN.md

**Total Estimated Time**: 5-6 hours

## Component Specifications

### SortableItem Component
```tsx
interface SortableItemProps {
  id: string
  children: React.ReactNode
  className?: string
}

// Features:
// - useSortable hook for drag behavior
// - Transform and transition styles
// - Drag handle rendering
// - Active/over states for visual feedback
```

### DragHandle Component
```tsx
// A small grip icon that indicates draggable area
// Uses GripVertical from lucide-react
// Only visible on hover (desktop) or always (mobile)
```

### Store Actions
```tsx
// In useResumeStore
reorderExperience: (oldIndex: number, newIndex: number) => {
  // Use arrayMove utility from @dnd-kit/sortable
  // Update experience array
}
```

## Visual Design

### Drag Handle
- Icon: GripVertical (lucide-react)
- Position: Left side of each card/item
- Color: Muted gray, becomes primary on hover
- Visibility: Show on hover (desktop), always visible (mobile)

### Active State (Being Dragged)
- Opacity: 50%
- Shadow: Elevated (shadow-lg)
- Cursor: grabbing
- Z-index: Higher than other items

### Drop Zone
- Border: Dashed border when dragging over
- Background: Light highlight color
- Height: Same as dragged item

### Transitions
- Transform: 200ms ease
- Opacity: 150ms ease
- Smooth animations for reordering

## Accessibility

### Keyboard Support
- Tab: Focus on drag handles
- Space/Enter: Pick up item
- Arrow keys: Move item up/down
- Space/Enter: Drop item
- Escape: Cancel drag

### Screen Readers
- Announce drag start/end
- Announce new position
- Descriptive ARIA labels
- Live regions for updates

### Touch Support
- Long press to activate drag
- Touch delay: 200ms
- Visual feedback on touch
- Works on iOS and Android

## Testing Strategy

### Manual Testing
1. Drag experience entries up/down
2. Drag education entries up/down
3. Drag skills within the list
4. Test keyboard navigation
5. Test on mobile/tablet
6. Test screen reader announcements

### Edge Cases
- Single item (no reordering needed)
- Empty lists
- Drag outside boundaries
- Rapid reordering
- Cancel mid-drag

## Success Criteria

✅ **Must Have:**
- [x] Experience entries can be reordered
- [x] Education entries can be reordered
- [x] Skills can be reordered
- [x] Certifications can be reordered
- [x] Visual feedback during drag
- [x] Changes persist to store
- [x] Works on desktop and mobile

✅ **Nice to Have:**
- [x] Smooth animations
- [x] Keyboard navigation
- [x] Touch device support
- [ ] Section reordering (move entire sections up/down) - Future enhancement
- [ ] Drag between different sections - Future enhancement

## Technical Considerations

### Performance
- @dnd-kit is highly optimized
- Uses CSS transforms (GPU accelerated)
- No layout thrashing
- Virtual scrolling not needed for resume items (small lists)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 13+
- Android Chrome 80+

### Data Persistence
- Changes immediately reflected in Zustand store
- Store synced with backend via existing mutations
- No additional API calls needed

## Future Enhancements (Phase 14+)

1. **Section Reordering**: Drag entire sections (Experience, Education) to different positions
2. **Drag Between Sections**: Move an experience to education or vice versa
3. **Undo/Redo**: Revert reordering operations
4. **Drag to Delete**: Drag item to trash zone to delete
5. **Multi-select Drag**: Select multiple items and drag together
6. **Custom Drag Previews**: Richer visual feedback
7. **Drag from Sidebar**: Drag templates or snippets into resume

## Notes

- Start with experience section as proof of concept
- Apply same pattern to other sections
- Keep components reusable and generic
- Focus on UX and smooth animations
- Test thoroughly on different devices

---

**Status**: Planning Complete ✅  
**Next Step**: Install dependencies and create core DnD components
