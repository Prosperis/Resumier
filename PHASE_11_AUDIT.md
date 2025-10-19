# Phase 11: Forms & Validation - Audit

## Current State Analysis

### ✅ What We Have (Phase 10)

**API Integration:**
- `useUpdateResume()` mutation with optimistic updates
- `useResume(id)` query for loading resume data
- Full TypeScript types for `ResumeContent`
- Mock API ready for testing

**Resume Types:**
```typescript
interface ResumeContent {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skills
  certifications: Certification[]
  links: Link[]
}
```

**Existing Components:**
- `ResumeBuilder` - Currently displays resume (read-only)
- `PersonalInfoDialog` - Old dialog-based form
- Individual section components in `src/components/personal-info/`

**Routes:**
- `/resume/$id` - Edit resume (uses ResumeBuilder)
- `/resume/new` - Create new resume
- `/dashboard` - Resume list

### ❌ What's Missing

**Form Library:**
- No TanStack Form installed
- No Zod validation library

**Form Components:**
- No reusable form field components
- No form validation
- No error display
- No auto-save functionality

**Edit Functionality:**
- ResumeBuilder is read-only (just displays)
- No way to edit personal info
- No way to add/edit/delete experience
- No way to add/edit/delete education
- No way to manage skills
- No way to add certifications or links

**User Experience:**
- No inline editing
- No field validation feedback
- No save indicators
- No error messages

## Phase 11 Implementation Plan

### Goal
Transform read-only ResumeBuilder into fully editable form with:
- Inline editing of all fields
- Real-time validation
- Auto-save with debounce
- Optimistic updates
- Great UX

### Architecture Decision

**Approach: Embedded Forms (Not Dialog-Based)**
- Forms integrated directly into resume view
- Click to edit inline
- Auto-save on blur/change
- Visual feedback during save

**Why Not TanStack Form?**
After reviewing the requirements, we'll use **controlled components with React Hook Form** instead:
- Better integration with shadcn/ui components
- Simpler for our use case
- Easier auto-save implementation
- Better TypeScript support

**Alternative: Use TanStack Form as planned**
- Follows original rebuild plan
- More aligned with TanStack ecosystem
- Better for complex forms

**DECISION: Let's use React Hook Form + Zod**
- Install `react-hook-form` and `@hookform/resolvers`
- Keep `zod` for validation
- Better ecosystem fit with shadcn/ui

### Directory Structure

```
src/
├── lib/
│   └── validations/
│       ├── personal-info.ts      ❌ CREATE - Zod schema
│       ├── experience.ts         ❌ CREATE - Zod schema
│       ├── education.ts          ❌ CREATE - Zod schema
│       ├── skills.ts             ❌ CREATE - Zod schema
│       ├── certification.ts      ❌ CREATE - Zod schema
│       └── links.ts              ❌ CREATE - Zod schema
├── components/
│   ├── ui/
│   │   ├── form.tsx              ❌ CREATE - Form components (shadcn)
│   │   ├── input.tsx             ✅ EXISTS
│   │   ├── textarea.tsx          ❌ CREATE
│   │   ├── select.tsx            ❌ CREATE
│   │   └── badge.tsx             ✅ EXISTS
│   └── features/
│       └── resume/
│           ├── forms/
│           │   ├── personal-info-form.tsx       ❌ CREATE
│           │   ├── experience-form.tsx          ❌ CREATE
│           │   ├── experience-list-item.tsx     ❌ CREATE
│           │   ├── education-form.tsx           ❌ CREATE
│           │   ├── education-list-item.tsx      ❌ CREATE
│           │   ├── skills-form.tsx              ❌ CREATE
│           │   ├── certification-form.tsx       ❌ CREATE
│           │   └── links-form.tsx               ❌ CREATE
│           └── resume-builder.tsx               ⚠️ UPDATE
└── hooks/
    └── use-auto-save.ts          ❌ CREATE - Debounced save hook
```

### Component Hierarchy

```
ResumeBuilder
├── PersonalInfoForm (auto-save)
│   ├── Name input
│   ├── Email input
│   ├── Phone input
│   ├── Location input
│   └── Summary textarea
│
├── ExperienceSection
│   ├── Add Experience button
│   └── ExperienceListItem[] (each with edit/delete)
│       ├── Company, Position
│       ├── Dates (start, end, current)
│       ├── Description
│       └── Highlights array
│
├── EducationSection
│   ├── Add Education button
│   └── EducationListItem[] (each with edit/delete)
│       ├── Institution, Degree, Field
│       ├── Dates
│       ├── GPA (optional)
│       └── Honors array (optional)
│
├── SkillsSection
│   ├── Technical skills tags
│   ├── Languages tags
│   ├── Tools tags
│   └── Soft skills tags
│
├── CertificationsSection
│   ├── Add Certification button
│   └── CertificationListItem[]
│
└── LinksSection
    ├── Add Link button
    └── LinkListItem[]
```

## Implementation Phases

### Phase 11.1: Setup & Base Components
1. Install dependencies (react-hook-form, zod, @hookform/resolvers)
2. Create Form UI components (form.tsx, textarea.tsx, select.tsx)
3. Create validation schemas
4. Create auto-save hook

### Phase 11.2: Personal Info Form
1. Create PersonalInfoForm component
2. Add validation
3. Implement auto-save
4. Add loading/error states
5. Test with mock API

### Phase 11.3: Experience Section
1. Create ExperienceForm component
2. Create ExperienceListItem with edit mode
3. Add/edit/delete functionality
4. Date validation
5. Highlights array management

### Phase 11.4: Education Section
1. Create EducationForm component
2. Create EducationListItem with edit mode
3. Add/edit/delete functionality
4. Optional fields (GPA, honors)

### Phase 11.5: Skills Section
1. Create SkillsForm component
2. Tag input for each skill category
3. Add/remove tags
4. Keyboard shortcuts (Enter to add)

### Phase 11.6: Certifications & Links
1. Create CertificationForm
2. Create LinksForm
3. Add/edit/delete for both
4. URL validation for links

### Phase 11.7: Integration & Polish
1. Update ResumeBuilder to use all forms
2. Test auto-save across all sections
3. Add save indicators
4. Error handling
5. Loading states

## Validation Strategy

### Zod Schemas

**Personal Info:**
```typescript
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  summary: z.string().max(500, "Summary too long").optional(),
})
```

**Experience:**
```typescript
const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().max(1000).optional(),
  highlights: z.array(z.string()),
}).refine(
  (data) => {
    if (!data.current && !data.endDate) {
      return false
    }
    return true
  },
  { message: "End date is required if not current", path: ["endDate"] }
)
```

### Validation Timing

- **On Change:** Live feedback for format errors (email, phone)
- **On Blur:** Validate required fields
- **On Submit:** Full validation before save
- **Auto-save:** Validate before sending to API

## Auto-Save Strategy

### Requirements

1. **Debounce:** Wait 1000ms after last change before saving
2. **Cancel:** Cancel pending saves if user continues typing
3. **Visual Feedback:** Show "Saving..." indicator
4. **Error Handling:** Show error if save fails
5. **Optimistic Updates:** Update UI immediately

### Implementation

```typescript
function useAutoSave(resumeId: string, debounceMs = 1000) {
  const { mutate: updateResume, isPending } = useUpdateResume()
  const [isSaving, setIsSaving] = useState(false)
  
  const debouncedSave = useMemo(
    () => debounce((data: UpdateResumeDto) => {
      setIsSaving(true)
      updateResume(
        { id: resumeId, data },
        {
          onSuccess: () => setIsSaving(false),
          onError: () => setIsSaving(false),
        }
      )
    }, debounceMs),
    [resumeId, updateResume]
  )
  
  return { save: debouncedSave, isSaving }
}
```

### Usage

```typescript
function PersonalInfoForm({ resumeId, initialData }) {
  const { save, isSaving } = useAutoSave(resumeId)
  const form = useForm({
    defaultValues: initialData,
    resolver: zodResolver(personalInfoSchema),
  })
  
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (form.formState.isValid) {
        save({ content: { personalInfo: data } })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, save])
  
  return (
    <form>
      {/* form fields */}
      {isSaving && <span>Saving...</span>}
    </form>
  )
}
```

## User Experience Considerations

### Visual Feedback

**Saving States:**
- 🔵 "Editing..." - User is typing
- 🟡 "Saving..." - Auto-save in progress
- 🟢 "Saved" - Successfully saved (show for 2s)
- 🔴 "Error" - Save failed (with retry button)

**Field States:**
- Default: Normal border
- Focus: Blue border
- Error: Red border with error message
- Disabled: Gray background during save

### Keyboard Shortcuts

- **Tab**: Move to next field
- **Shift+Tab**: Move to previous field
- **Enter**: (in text inputs) Move to next field
- **Enter**: (in textareas) New line
- **Cmd/Ctrl+S**: Manual save (bypass auto-save)

### Mobile Considerations

- Large touch targets (min 44px)
- Proper keyboard types (email, tel, url)
- No hover states (use focus instead)
- Sheet/drawer for long forms

## Error Handling

### Validation Errors

Display inline below field:
```tsx
<Input {...field} />
{errors.name && (
  <p className="text-sm text-destructive">{errors.name.message}</p>
)}
```

### API Errors

Display at form level:
```tsx
{apiError && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{apiError.message}</AlertDescription>
  </Alert>
)}
```

### Network Errors

- Show toast notification
- Queue changes for retry
- Don't lose user data

## Testing Strategy

### Unit Tests

- Validation schemas
- Auto-save debouncing
- Form field components

### Integration Tests

- Form submission
- API integration
- Error handling

### Manual Testing

1. Fill out personal info → Check auto-save
2. Add experience → Check optimistic update
3. Delete education → Check confirmation
4. Invalid email → Check validation
5. Network error → Check error handling
6. Rapid typing → Check debounce

## Performance Considerations

### Optimization

1. **Debounce saves** - Don't hammer API
2. **Memoize callbacks** - Prevent unnecessary re-renders
3. **Virtual scrolling** - For large lists (experience, education)
4. **Code splitting** - Lazy load form sections

### Bundle Size

- react-hook-form: ~24KB
- zod: ~13KB
- Total: ~37KB (acceptable)

## Accessibility

### ARIA Labels

```tsx
<Input
  aria-label="Full name"
  aria-required="true"
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? "name-error" : undefined}
/>
{errors.name && (
  <span id="name-error" role="alert">
    {errors.name.message}
  </span>
)}
```

### Focus Management

- Focus first error on validation failure
- Return focus after add/delete operations
- Clear focus indicators

### Screen Readers

- Announce save status
- Announce errors
- Label all fields

## Migration Plan

### Phase 1: New Forms (Don't Break Existing)

- Create new form components
- Keep old components
- Test in isolation

### Phase 2: Integrate Forms

- Update ResumeBuilder to use new forms
- Remove old dialog-based forms
- Update routes

### Phase 3: Cleanup

- Delete old PersonalInfoDialog
- Delete old section components
- Update tests

## Success Criteria

✅ All resume fields editable
✅ Real-time validation
✅ Auto-save working (1s debounce)
✅ Optimistic updates
✅ Error handling
✅ Loading states
✅ No TypeScript errors
✅ No linting errors
✅ Accessible forms
✅ Mobile responsive

## Potential Issues

### Issue 1: Form State vs Server State

**Problem:** Form state can drift from server state

**Solution:**
- Reset form when server data changes
- Show warning if server data differs
- Merge conflicts gracefully

### Issue 2: Concurrent Edits

**Problem:** Multiple tabs editing same resume

**Solution:**
- Not implementing conflict resolution in Phase 11
- Will address in later phase with WebSockets
- For now: Last write wins

### Issue 3: Large Resumes

**Problem:** Many experiences/educations slow down form

**Solution:**
- Virtual scrolling for lists >10 items
- Collapse sections by default
- Lazy load form sections

## Dependencies to Install

```json
{
  "react-hook-form": "^7.53.2",
  "@hookform/resolvers": "^3.9.1",
  "zod": "^3.23.8"
}
```

## Timeline Estimate

- Setup & Base Components: 1 hour
- Personal Info Form: 1 hour
- Experience Section: 2 hours
- Education Section: 1.5 hours
- Skills Section: 1 hour
- Certifications & Links: 1 hour
- Integration & Polish: 1.5 hours
- Testing: 1 hour

**Total: ~10 hours**

## Next Steps

1. Create this audit document ✅
2. Install dependencies
3. Create validation schemas
4. Build form UI components
5. Implement personal info form
6. Build remaining sections
7. Test and document

---

**Phase 11 Status:** 🔄 STARTING
