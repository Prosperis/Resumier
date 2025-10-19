# Phase 10: API Integration - Audit

## Current State Analysis

### ✅ What's Already Set Up

1. **TanStack Query v5.80.6** - Already installed
   - React Query for data fetching and caching
   - Modern async state management
   - Built-in support for optimistic updates, caching, invalidation

2. **Zustand Stores** - Phase 8 implementation
   - `useResumeStore` - Currently uses local state
   - `useAuthStore` - Has login method (simulated)
   - Ready to integrate with API

3. **Route Guards** - Phase 9 implementation
   - Authentication checks on protected routes
   - Ready to work with API-based auth

4. **TypeScript** - Full type safety
   - Ready for API types and schemas

5. **Existing Components**
   - `ResumeDashboard` - Shows documents from store
   - `ResumeBuilder` - Edits resume content
   - Ready to connect to API

### ❌ What's Missing

1. **API Client Layer**
   - No fetch/axios wrapper
   - No base URL configuration
   - No request/response interceptors
   - No error handling utilities

2. **React Query Setup**
   - QueryClient not configured in App
   - No query hooks for resume operations
   - No mutation hooks
   - No cache configuration

3. **Mock API**
   - No development API
   - No mock data service
   - Need localStorage or in-memory database simulation

4. **API Hooks**
   - No `useResumes()` for fetching all resumes
   - No `useResume(id)` for single resume
   - No `useCreateResume()` mutation
   - No `useUpdateResume()` mutation
   - No `useDeleteResume()` mutation

5. **Error Handling**
   - No API error types
   - No toast/notification system for errors
   - No retry logic

6. **Query Invalidation**
   - No patterns for refreshing data after mutations
   - No cache management strategy

## Phase 10 Implementation Plan

### 1. Directory Structure

```
src/
├── lib/
│   └── api/
│       ├── client.ts              ❌ CREATE - API client wrapper
│       ├── types.ts               ❌ CREATE - API types & schemas
│       ├── errors.ts              ❌ CREATE - Error handling
│       └── mock/
│           ├── index.ts           ❌ CREATE - Mock API entry
│           ├── resumes.ts         ❌ CREATE - Resume mock endpoints
│           ├── auth.ts            ❌ CREATE - Auth mock endpoints
│           └── db.ts              ❌ CREATE - In-memory database
├── hooks/
│   └── api/
│       ├── use-resumes.ts         ❌ CREATE - Fetch all resumes
│       ├── use-resume.ts          ❌ CREATE - Fetch single resume
│       ├── use-create-resume.ts   ❌ CREATE - Create mutation
│       ├── use-update-resume.ts   ❌ CREATE - Update mutation
│       ├── use-delete-resume.ts   ❌ CREATE - Delete mutation
│       └── index.ts               ❌ CREATE - Barrel export
└── app/
    └── providers.tsx              ⚠️ UPDATE - Add QueryClientProvider
```

### 2. API Client Design

**Base Client (`src/lib/api/client.ts`):**
```typescript
class ApiClient {
  private baseUrl: string
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }
  
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Build full URL
    // Add headers (auth token, content-type)
    // Make fetch request
    // Handle errors
    // Return typed data
  }
  
  get<T>(endpoint: string) { ... }
  post<T>(endpoint: string, data: unknown) { ... }
  put<T>(endpoint: string, data: unknown) { ... }
  delete<T>(endpoint: string) { ... }
}

export const api = new ApiClient(import.meta.env.VITE_API_URL || '/api')
```

**Features:**
- Automatic auth token injection from store
- JSON parsing
- Error handling with custom error types
- Request/response interceptors
- TypeScript generics for type safety

### 3. Mock API Design

**Mock Database (`src/lib/api/mock/db.ts`):**
- In-memory storage using Map/Set
- Persist to localStorage for development
- Generate sample data with realistic content
- Support CRUD operations
- Simulate network delay (100-500ms)

**Mock Endpoints (`src/lib/api/mock/resumes.ts`):**
```typescript
export const mockResumeApi = {
  getAll: async (): Promise<Resume[]> => {
    await delay(200)
    return db.resumes.getAll()
  },
  
  getById: async (id: string): Promise<Resume> => {
    await delay(150)
    const resume = db.resumes.getById(id)
    if (!resume) throw new NotFoundError('Resume not found')
    return resume
  },
  
  create: async (data: CreateResumeDto): Promise<Resume> => {
    await delay(300)
    return db.resumes.create(data)
  },
  
  update: async (id: string, data: UpdateResumeDto): Promise<Resume> => {
    await delay(250)
    return db.resumes.update(id, data)
  },
  
  delete: async (id: string): Promise<void> => {
    await delay(200)
    db.resumes.delete(id)
  },
}
```

### 4. React Query Hooks

**Query Hook Pattern (`src/hooks/api/use-resumes.ts`):**
```typescript
export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => api.get<Resume[]>('/resumes'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

**Mutation Hook Pattern (`src/hooks/api/use-create-resume.ts`):**
```typescript
export function useCreateResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateResumeDto) => 
      api.post<Resume>('/resumes', data),
    
    onSuccess: (newResume) => {
      // Invalidate and refetch resumes list
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      
      // Optimistically add to cache
      queryClient.setQueryData<Resume[]>(['resumes'], (old) => 
        old ? [...old, newResume] : [newResume]
      )
    },
    
    onError: (error) => {
      // Show error toast
      toast.error(error.message)
    },
  })
}
```

### 5. Optimistic Updates Strategy

**Update Mutation with Optimistic UI:**
```typescript
export function useUpdateResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResumeDto }) =>
      api.put<Resume>(`/resumes/${id}`, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['resumes', id] })
      
      // Snapshot previous value
      const previous = queryClient.getQueryData<Resume>(['resumes', id])
      
      // Optimistically update
      queryClient.setQueryData<Resume>(['resumes', id], (old) =>
        old ? { ...old, ...data } : undefined
      )
      
      return { previous }
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['resumes', variables.id], context.previous)
      }
    },
    
    onSettled: (data, error, { id }) => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['resumes', id] })
    },
  })
}
```

### 6. Error Handling System

**API Error Types (`src/lib/api/errors.ts`):**
```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super(message, 422, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED')
  }
}
```

**Error Handling in Client:**
- Catch fetch errors
- Parse error response
- Throw typed error
- Log to console in development
- Show user-friendly messages

### 7. Query Configuration

**QueryClient Setup (`src/app/providers.tsx`):**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
```

### 8. Integration Points

**Dashboard Component:**
```typescript
// Before (uses Zustand store)
const documents = useResumeStore((state) => state.documents)

// After (uses React Query)
const { data: resumes, isLoading, error } = useResumes()
```

**Resume Builder:**
```typescript
// Before (local state)
const updateResume = useResumeStore((state) => state.updateContent)

// After (mutation)
const { mutate: updateResume } = useUpdateResume()

// Auto-save with debounce
useEffect(() => {
  const timer = setTimeout(() => {
    updateResume({ id: resumeId, data: content })
  }, 1000)
  return () => clearTimeout(timer)
}, [content])
```

## Implementation Order

### Phase 10.1: Foundation (API Client & Mock)
1. ✅ Audit current setup (this document)
2. Create API client base
3. Create error handling system
4. Create mock database
5. Create mock API endpoints
6. Test mock API in isolation

### Phase 10.2: React Query Setup
7. Configure QueryClient in providers
8. Create query hooks (useResumes, useResume)
9. Create mutation hooks (create, update, delete)
10. Test hooks with mock API

### Phase 10.3: Integration
11. Update dashboard to use useResumes
12. Update resume builder to use mutations
13. Add optimistic updates
14. Add error handling with notifications
15. Test full flow

### Phase 10.4: Polish
16. Add loading states
17. Add retry logic
18. Add cache invalidation
19. Document API patterns
20. Create Phase 10 summary

## Success Criteria

- ✅ API client handles all HTTP methods
- ✅ Mock API provides realistic data
- ✅ All CRUD operations work via React Query
- ✅ Optimistic updates provide instant feedback
- ✅ Errors are caught and displayed to users
- ✅ Cache invalidation keeps UI in sync
- ✅ TypeScript validates all API calls
- ✅ No more direct Zustand store mutations for data
- ✅ Loading states show during async operations

## Notes

**Mock vs Real API:**
- Phase 10 uses mock API for development
- Real backend integration in later phases
- Same API client interface for both
- Easy to swap mock for real endpoints

**Data Flow:**
```
Component → React Query Hook → API Client → Mock API → In-Memory DB
                ↓                                          ↓
            Cache Update ← Response ← JSON ← Data
```

**Store Usage:**
- Zustand stores remain for UI state (theme, sidebar, etc.)
- React Query handles server state (resumes, user data)
- Clear separation of concerns

## Dependencies Status

All required dependencies already installed:
- ✅ `@tanstack/react-query` v5.80.6
- ✅ `zustand` v4.5.2 (for UI state)
- ✅ TypeScript for type safety
- ✅ Vite for environment variables

No additional installations required for Phase 10.
