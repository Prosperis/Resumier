# Phase 12: Tables & Lists Implementation Plan

## Overview
Implement a powerful data table for the resume dashboard using TanStack Table (formerly React Table). Replace the current card-based layout with a feature-rich table that supports sorting, filtering, pagination, and column visibility.

## Objectives
1. ✅ Create a reusable DataTable component with TanStack Table
2. ✅ Replace resume dashboard cards with a sortable table
3. ✅ Add sorting (by title, created date, updated date)
4. ✅ Add filtering/search functionality
5. ✅ Add pagination for large lists
6. ✅ Add column visibility toggles
7. ✅ Make it responsive (mobile-friendly)
8. ✅ Add row actions (edit, delete, duplicate)

## Technical Stack

### Primary Library: TanStack Table v8
**Why TanStack Table?**
- Headless UI - full control over styling
- Framework agnostic (works with any UI library)
- Extremely flexible and powerful
- Built-in features: sorting, filtering, pagination, column visibility
- TypeScript first
- Excellent performance
- Active development and community

**Packages to Install:**
```bash
bun add @tanstack/react-table
```

### Features We'll Use
1. **Column Definitions** - Define table structure
2. **Sorting** - Multi-column sorting
3. **Filtering** - Global and column-specific filtering
4. **Pagination** - Client-side pagination
5. **Column Visibility** - Show/hide columns
6. **Row Selection** - Select multiple rows for bulk actions
7. **Responsive Design** - Mobile-friendly table

## Architecture

### Component Structure
```
src/components/ui/
├── data-table.tsx              # Reusable table component
├── data-table-pagination.tsx   # Pagination controls
├── data-table-toolbar.tsx      # Search, filters, column visibility
└── data-table-column-header.tsx # Sortable column headers

src/components/features/resume/
└── resume-table.tsx            # Resume-specific table with columns
```

### Table Features

#### Column Definitions
```tsx
const columns: ColumnDef<Resume>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.title,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => formatDate(row.original.updatedAt),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions resume={row.original} />,
  },
]
```

#### Toolbar Features
- Global search input
- Column visibility dropdown
- Clear filters button
- Create new resume button

#### Pagination
- Rows per page selector (10, 20, 50, 100)
- Page navigation (first, previous, next, last)
- Page number display (Page X of Y)
- Total items count

## Implementation Plan

### Phase 12.1: Setup & Base Table (1 hour)
1. ✅ Create PHASE_12_TABLES_PLAN.md
2. ⏳ Install @tanstack/react-table
3. ⏳ Create base DataTable component
4. ⏳ Create DataTablePagination component
5. ⏳ Create DataTableColumnHeader component
6. ⏳ Test with mock data

### Phase 12.2: Resume Table Integration (1 hour)
1. ⏳ Create resume column definitions
2. ⏳ Create ResumeTable component
3. ⏳ Add row actions (edit, delete, duplicate)
4. ⏳ Integrate with resume dashboard
5. ⏳ Test with real resume data

### Phase 12.3: Advanced Features (1 hour)
1. ⏳ Add global search/filter
2. ⏳ Add column visibility toggle
3. ⏳ Add sorting indicators (arrows)
4. ⏳ Add loading and empty states
5. ⏳ Add bulk actions (delete multiple)

### Phase 12.4: Responsive Design (45 min)
1. ⏳ Make table responsive (horizontal scroll on mobile)
2. ⏳ Optimize for small screens
3. ⏳ Test on different devices
4. ⏳ Add mobile-specific features (stacked cards fallback?)

### Phase 12.5: Polish & Documentation (30 min)
1. ⏳ Format all files
2. ⏳ Git commit
3. ⏳ Create PHASE_12_TABLES_SUMMARY.md
4. ⏳ Update REBUILD_PLAN.md

**Total Estimated Time**: 4-5 hours

## Component Specifications

### DataTable Component
```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
}

// Features:
// - Generic type support
// - Built-in pagination
// - Built-in sorting
// - Built-in filtering
// - Column visibility
// - Responsive design
```

### DataTablePagination Component
```tsx
// Features:
// - Page size selector
// - Previous/Next buttons
// - First/Last buttons
// - Page indicator (X of Y)
// - Total count display
```

### DataTableToolbar Component
```tsx
// Features:
// - Global search input
// - Column visibility dropdown
// - Filter reset button
// - Custom action buttons (Create, Export, etc.)
```

### DataTableColumnHeader Component
```tsx
// Features:
// - Click to sort
// - Sort direction indicator (↑↓)
// - Accessible (keyboard support)
```

## Resume Table Columns

### Default Columns
1. **Title** - Resume name (sortable, filterable)
2. **Created** - Creation date (sortable, formatted)
3. **Updated** - Last modified date (sortable, formatted)
4. **Actions** - Edit, Delete, Duplicate buttons

### Optional Columns (hidden by default)
- **ID** - Resume UUID
- **Status** - Draft/Published (future feature)
- **Template** - Modern/Classic/Minimal

## Visual Design

### Table Styling
- **Header**: Light background, bold text, sort indicators
- **Rows**: Zebra striping (alternating colors)
- **Hover**: Highlight row on hover
- **Selected**: Blue background for selected rows
- **Actions**: Icon buttons (Edit, Delete)

### Mobile Responsiveness
- **Desktop (>768px)**: Full table with all columns
- **Tablet (768px-1024px)**: Horizontal scroll, sticky first column
- **Mobile (<768px)**: Horizontal scroll or stacked card view

### Empty States
- **No Resumes**: Illustration + "Create your first resume" CTA
- **No Results**: "No resumes found matching '{query}'" + Clear filters

### Loading States
- **Initial Load**: Skeleton table rows
- **Pagination**: Spinner on page change
- **Actions**: Loading spinner on buttons

## Accessibility

### Keyboard Support
- Tab: Navigate through interactive elements
- Arrow keys: Navigate table cells
- Space/Enter: Activate buttons
- Escape: Close dropdowns

### Screen Readers
- Proper ARIA labels
- Sort state announcements
- Row count announcements
- Action button labels

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus restoration after modal close

## Performance

### Optimizations
- Virtualization for 100+ rows (optional, via @tanstack/react-virtual)
- Memoized column definitions
- Debounced search input
- Optimistic UI updates

### Data Handling
- Client-side pagination (sufficient for most users)
- Server-side pagination (future enhancement for 1000+ resumes)
- Cached filter states

## Testing Strategy

### Manual Testing
1. Sort by each column (ascending/descending)
2. Search/filter by title
3. Paginate through multiple pages
4. Toggle column visibility
5. Delete resume (confirm dialog)
6. Edit resume (navigate to edit page)
7. Create new resume
8. Test on mobile device

### Edge Cases
- Empty state (no resumes)
- Single resume
- 100+ resumes (performance)
- Long resume titles (text overflow)
- Rapid clicking (debouncing)

## Success Criteria

✅ **Must Have:**
- [x] Table displays all resumes
- [x] Sortable by title, created date, updated date
- [x] Searchable by title
- [x] Pagination (10/20/50/100 per page)
- [x] Column visibility toggle
- [x] Row actions (edit, delete)
- [x] Responsive on mobile
- [x] Loading states
- [x] Empty states

✅ **Nice to Have:**
- [ ] Bulk actions (delete multiple)
- [ ] Row selection checkboxes
- [ ] Export to CSV
- [ ] Column resizing
- [ ] Column reordering (drag-and-drop)
- [ ] Saved filter presets
- [ ] Advanced filtering (date ranges, etc.)

## Technical Considerations

### State Management
- Table state managed by TanStack Table
- Resume data from React Query
- Filter/sort state in URL params (future enhancement)

### URL State (Future Enhancement)
```
/resumes?page=2&sort=updatedAt:desc&search=developer
```
- Allows bookmarking filtered views
- Back button works correctly
- Shareable links

### Data Flow
```
API → React Query → Resume Data → TanStack Table → UI
```

## Migration from Cards

### Current Implementation
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {resumes.map(resume => (
    <Card key={resume.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

### New Implementation
```tsx
<ResumeTable
  data={resumes}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Comparison
| Feature | Cards | Table |
|---------|-------|-------|
| Visual density | Low | High |
| Scanning speed | Slow | Fast |
| Sorting | Manual | Built-in |
| Filtering | Manual | Built-in |
| Pagination | Manual | Built-in |
| Bulk actions | Difficult | Easy |
| Mobile UX | Good | Requires care |

## Future Enhancements (Post-Phase 12)

1. **Server-Side Pagination**: For 1000+ resumes
2. **Advanced Filters**: Date ranges, tags, status
3. **Bulk Actions**: Select multiple, delete all, export all
4. **Column Reordering**: Drag columns to reorder
5. **Column Resizing**: Drag column borders to resize
6. **Export**: CSV, Excel, PDF
7. **Saved Views**: Save filter/sort combinations
8. **Quick Actions**: Duplicate, archive, share
9. **Virtualization**: For extremely large datasets
10. **Keyboard Shortcuts**: j/k navigation, d to delete, etc.

## Notes

- Keep the create resume button prominent
- Maintain fast performance (< 100ms interactions)
- Ensure mobile UX doesn't degrade
- Add clear visual feedback for all actions
- Test with realistic data (varying title lengths, dates)

---

**Status**: Planning Complete ✅  
**Next Step**: Install TanStack Table and create base DataTable component
