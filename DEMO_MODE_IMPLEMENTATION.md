# Demo Mode Implementation

## Overview

Demo Mode is a feature that allows users to explore Resumier with pre-populated resume data featuring **John Doe**, a complete professional profile. This provides an instant, hands-on experience without requiring users to create content from scratch.

## Features

### 🎭 What's Included

Demo Mode provides a fully populated resume with:

- **Personal Information**: Complete contact details and professional summary
- **Work Experience**: 3 detailed work experiences with highlights
  - Senior Software Engineer at Tech Corp (Current)
  - Full Stack Developer at StartupXYZ
  - Junior Web Developer at Digital Agency Inc
- **Education**: 2 educational entries
  - BS in Computer Science from UC Berkeley
  - Professional Certificate in Machine Learning from Stanford Online
- **Skills**: Comprehensive skill set
  - 11 Technical skills (JavaScript, TypeScript, React, Node.js, etc.)
  - 3 Languages (English, Spanish, French)
  - 10 Tools (Git, Docker, AWS, etc.)
  - 8 Soft skills (Leadership, Communication, etc.)
- **Certifications**: 3 professional certifications
  - AWS Certified Solutions Architect
  - Professional Scrum Master (PSM I)
  - React Developer Certification
- **Links**: 4 professional links
  - Portfolio website
  - LinkedIn profile
  - GitHub profile
  - Personal blog

### 🚀 User Flow

1. **Starting Demo Mode**
   - User opens the app and sees auth modal
   - Clicks "Try Demo Mode" button
   - Demo data is loaded into IndexedDB
   - User is redirected to dashboard with demo resumes

2. **Using Demo Mode**
   - All features are fully functional
   - Users can edit demo data (changes are temporary)
   - Users can export demo data
   - Demo mode indicator shows current status

3. **Exiting Demo Mode**
   - User can exit demo mode from settings
   - Demo data is cleared
   - User returns to home screen

## Architecture

### Data Structure

```
IndexedDB:
  resumier-web-store:
    - resumes: [DemoResume1, DemoResume2, ...]
  
  resumier-documents:
    - [{ id, title, createdAt, updatedAt }, ...]

localStorage:
  resumier-auth:
    - state:
      - isDemo: true
      - isGuest: true
      - user: { id: "demo-timestamp", email: "demo@resumier.app", name: "Demo User" }
```

### Files Created

1. **`src/lib/utils/demo-data.ts`**
   - Contains complete John Doe resume data
   - `demoResumeContent`: Full resume content object
   - `createDemoResume()`: Generates single demo resume
   - `createDemoResumes()`: Generates multiple demo resumes

2. **`src/lib/utils/demo-mode.ts`**
   - Core demo mode utilities
   - `initializeDemoMode()`: Loads demo data into IndexedDB
   - `isDemoMode()`: Check if demo mode is active
   - `enableDemoMode()`: Enable demo mode flag
   - `disableDemoMode()`: Disable demo mode and clear data
   - `getDemoData()`: Retrieve current demo data
   - `exportDemoData()`: Export demo data for backup

3. **`src/hooks/use-demo-mode.ts`**
   - React hook for demo mode management
   - Provides state and actions for components
   - Returns: `{ isDemo, hasData, demoResumes, initializeDemo, exitDemo, exportData }`

4. **`src/components/features/demo/demo-mode-info.tsx`**
   - UI component for demo mode controls
   - Shows demo status and available actions
   - Displays demo resume list
   - Provides export and exit functionality

5. **Updated `src/stores/auth-store.ts`**
   - Added `isDemo` state flag
   - Added `setDemo()` action
   - Added `loginAsDemo()` action
   - Persist demo state in localStorage

6. **Updated `src/components/features/auth/auth-modal.tsx`**
   - Added "Try Demo Mode" button
   - Handles demo initialization on button click
   - Navigates to dashboard after demo loads

## Usage

### For End Users

#### Starting Demo Mode

1. Open Resumier
2. In the auth modal, click **"Try Demo Mode"**
3. Demo data loads automatically
4. You're redirected to the dashboard with demo resumes

#### Managing Demo Mode

```tsx
import { DemoModeInfo } from "@/components/features/demo";

function SettingsPage() {
  return (
    <div>
      <DemoModeInfo />
    </div>
  );
}
```

### For Developers

#### Using the Demo Mode Hook

```tsx
import { useDemoMode } from "@/hooks/use-demo-mode";

function MyComponent() {
  const {
    isDemo,        // boolean: is demo mode active?
    hasData,       // boolean: does demo have data?
    demoResumes,   // Resume[]: array of demo resumes
    initializeDemo, // (config?) => Promise<void>
    exitDemo,      // () => Promise<void>
    exportData,    // () => Promise<data>
  } = useDemoMode();

  // Use demo mode state and actions
}
```

#### Initializing Demo Programmatically

```typescript
import { initializeDemoMode } from "@/lib/utils/demo-mode";
import { useAuthStore } from "@/stores/auth-store";

async function startDemo() {
  // Initialize demo with options
  await initializeDemoMode({
    multipleResumes: true,  // Create multiple demo resumes
    clearExisting: true,    // Clear existing data first
  });
  
  // Set auth state
  useAuthStore.getState().loginAsDemo();
  
  // Navigate to dashboard
  navigate({ to: "/dashboard" });
}
```

#### Checking Demo Mode Status

```typescript
import { isDemoMode } from "@/lib/utils/demo-mode";

if (isDemoMode()) {
  console.log("App is in demo mode");
}
```

#### Accessing Demo Data

```typescript
import { demoResumeContent, createDemoResume } from "@/lib/utils/demo-data";

// Get the demo content
const johnDoeData = demoResumeContent;

// Create a new demo resume
const resume = createDemoResume();
```

## API Reference

### useAuthStore

```typescript
interface AuthStore {
  isDemo: boolean;
  setDemo: (isDemo: boolean) => void;
  loginAsDemo: () => void;
}

// Selectors
export const selectIsDemo = (state: AuthStore) => state.isDemo;
```

### useDemoMode Hook

```typescript
interface UseDemoModeReturn {
  isDemo: boolean;
  isGuest: boolean;
  hasData: boolean;
  isChecking: boolean;
  demoResumes: Resume[];
  initializeDemo: (config?: DemoModeConfig) => Promise<void>;
  exitDemo: () => Promise<void>;
  refreshData: () => Promise<void>;
  exportData: () => Promise<{ resumes: Resume[]; documents: any[] }>;
}
```

### Demo Mode Utilities

```typescript
// Initialize demo mode
await initializeDemoMode(config?: {
  multipleResumes?: boolean;  // Default: false
  clearExisting?: boolean;    // Default: false
});

// Check demo mode status
const isDemo: boolean = isDemoMode();

// Enable/disable demo mode
enableDemoMode();
await disableDemoMode();

// Get demo data
const resumes: Resume[] = await getDemoData();

// Export demo data
const data = await exportDemoData();
// Returns: { resumes: Resume[], documents: any[] }
```

## Benefits

### For Users

- **Instant Exploration**: See the app with real data immediately
- **No Commitment**: Try features without signing up
- **Learning Tool**: Understand how to structure a professional resume
- **Template**: Use John Doe's resume as inspiration

### For Business

- **Reduced Friction**: Lower barrier to entry
- **Better Conversions**: Users can evaluate before signing up
- **Showcases Features**: Demonstrates all capabilities
- **Marketing Tool**: Complete example for screenshots/videos

## Technical Details

### Storage

Demo mode uses the same IndexedDB storage as guest mode:
- **resumier-web-store**: Resume data
- **resumier-documents**: Document list
- **localStorage (resumier-auth)**: Auth state with demo flag

### Data Persistence

- Demo data persists across page reloads
- Demo mode flag persists in localStorage
- Data is cleared when user exits demo mode
- Data is cleared when user logs in with real account

### Differences from Guest Mode

| Feature | Guest Mode | Demo Mode |
|---------|-----------|-----------|
| Data | User-created | Pre-populated |
| Starting State | Empty | John Doe resume |
| Purpose | Build from scratch | Explore with examples |
| Auth Flag | `isGuest: true` | `isGuest: true, isDemo: true` |

## Future Enhancements

### Planned Features

- [ ] Multiple demo personas (Jane Smith - Designer, Mike Johnson - Manager)
- [ ] Demo mode tour/tutorial
- [ ] Convert demo data to personal resume
- [ ] Industry-specific demo resumes
- [ ] Demo mode analytics tracking
- [ ] Shareable demo mode links
- [ ] Demo mode time limit with prompts to sign up

### Possible Improvements

- [ ] Add demo mode indicator to header
- [ ] Show "This is demo data" watermark on previews
- [ ] Add demo mode exit prompt after certain time
- [ ] Track most-viewed demo sections
- [ ] A/B test different demo data sets

## Testing

### Manual Testing Checklist

- [ ] Click "Try Demo Mode" in auth modal
- [ ] Verify demo data loads correctly
- [ ] Verify navigation to dashboard works
- [ ] Check all resume sections have demo data
- [ ] Test editing demo data
- [ ] Test export demo data functionality
- [ ] Test exit demo mode
- [ ] Verify data is cleared after exit
- [ ] Check demo mode persists after page reload
- [ ] Test demo mode indicator in UI

### Automated Tests

```typescript
// Example test
describe("Demo Mode", () => {
  it("should initialize with John Doe data", async () => {
    await initializeDemoMode();
    const data = await getDemoData();
    
    expect(data).toHaveLength(1);
    expect(data[0].content.personalInfo.name).toBe("John Doe");
  });
  
  it("should clear data on exit", async () => {
    await initializeDemoMode();
    await disableDemoMode();
    const data = await getDemoData();
    
    expect(data).toHaveLength(0);
  });
});
```

## Troubleshooting

### Demo mode not loading

1. Check browser console for errors
2. Verify IndexedDB is available
3. Clear browser cache and try again
4. Check if localStorage is enabled

### Demo data not showing

1. Verify `loginAsDemo()` was called
2. Check `isDemoMode()` returns true
3. Inspect IndexedDB in DevTools
4. Try exiting and re-entering demo mode

### Demo mode stuck

1. Open DevTools → Application → Local Storage
2. Find "resumier-auth" key
3. Delete the key
4. Refresh the page

## License

This feature is part of Resumier and follows the same license terms.

---

**Created**: October 31, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete
