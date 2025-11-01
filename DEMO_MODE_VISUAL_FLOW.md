# Demo Mode Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER JOURNEY                             │
└─────────────────────────────────────────────────────────────┘

Step 1: Landing
┌──────────────────────────────────────┐
│         Welcome to Resumier          │
│                                      │
│  [Google]    [Dropbox]              │
│  [GitHub]    [GitLab]               │
│                                      │
│  ╔════════════════════════════════╗ │
│  ║   🎭 Try Demo Mode   [NEW]     ║ │  ← Click here!
│  ╚════════════════════════════════╝ │
│                                      │
│  → Continue with local storage      │
└──────────────────────────────────────┘
           ↓ (Click Demo Mode)


Step 2: Loading
┌──────────────────────────────────────┐
│      Loading Demo Data...            │
│                                      │
│      ████████░░░░░ 80%              │
│                                      │
│  • Initializing John Doe data       │
│  • Loading work experiences         │
│  • Loading skills & certifications  │
└──────────────────────────────────────┘
           ↓ (Automatic redirect)


Step 3: Dashboard View
┌────────────────────────────────────────────────────────────┐
│  Resumier                              🎭 Demo Mode Active  │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  My Resumes                                     [+ New]     │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ 📄 John Doe - Software Engineer Resume     │            │
│  │                                             │            │
│  │ Created: Oct 31, 2025                      │            │
│  │ Updated: Oct 31, 2025                      │            │
│  │                                             │            │
│  │ [Edit]  [Preview]  [Export]                │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │ 📄 John Doe - Senior Developer Resume      │            │
│  │                                             │            │
│  │ Created: Oct 31, 2025                      │            │
│  │ Updated: Oct 31, 2025                      │            │
│  │                                             │            │
│  │ [Edit]  [Preview]  [Export]                │            │
│  └────────────────────────────────────────────┘            │
│                                                              │
└────────────────────────────────────────────────────────────┘
           ↓ (Click Edit)


Step 4: Resume Editor
┌────────────────────────────────────────────────────────────┐
│  John Doe - Software Engineer Resume    🎭 Demo Mode       │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ Personal Info ──────────────────┐  ┌─ Preview ────┐   │
│  │                                   │  │               │   │
│  │ Name: John Doe                    │  │  JOHN DOE     │   │
│  │ Email: john.doe@example.com       │  │  Software Eng │   │
│  │ Phone: +1 (555) 123-4567         │  │               │   │
│  │ Location: San Francisco, CA       │  │  Experienced  │   │
│  │                                   │  │  software...  │   │
│  │ Summary: Experienced software     │  │               │   │
│  │ engineer with 5+ years...         │  │  EXPERIENCE   │   │
│  │                                   │  │  • Tech Corp  │   │
│  └───────────────────────────────────┘  │  • StartupXYZ │   │
│                                          │               │   │
│  ┌─ Experience ──────────────────────┐  │  EDUCATION    │   │
│  │                                   │  │  • UC Berkeley│   │
│  │ ▼ Senior Software Engineer        │  │               │   │
│  │   Tech Corp (2020 - Present)      │  │  SKILLS       │   │
│  │                                   │  │  JavaScript   │   │
│  │   • Built scalable microservices  │  │  TypeScript   │   │
│  │   • Improved performance by 40%   │  │  React...     │   │
│  │   • Mentored junior developers    │  │               │   │
│  │                                   │  └───────────────┘   │
│  │ [Edit] [Delete]                   │                      │
│  │                                   │                      │
│  │ ▼ Full Stack Developer            │                      │
│  │   StartupXYZ (2018 - 2019)       │                      │
│  │   ...                             │                      │
│  └───────────────────────────────────┘                      │
│                                                              │
│  [+ Add Experience]                                         │
│                                                              │
└────────────────────────────────────────────────────────────┘
           ↓ (Go to Settings)


Step 5: Settings / Demo Control
┌────────────────────────────────────────────────────────────┐
│  Settings                                                    │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─ Demo Mode Info ─────────────────────────────────────┐  │
│  │  🎭 Demo Mode Active                                  │  │
│  │                                                        │  │
│  │  You're exploring Resumier with demo data.           │  │
│  │  All changes are temporary.                           │  │
│  │                                                        │  │
│  │  📊 Demo Data Loaded                                  │  │
│  │  2 resumes available                                  │  │
│  │  • John Doe - Software Engineer Resume                │  │
│  │  • John Doe - Senior Developer Resume (Alternative)   │  │
│  │                                                        │  │
│  │  [💾 Export Demo Data]  [🗑️ Exit Demo]              │  │
│  │                                                        │  │
│  │  ℹ️ Note: Demo mode uses temporary storage.          │  │
│  │  Sign up to save your own resumes!                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└────────────────────────────────────────────────────────────┘
           ↓ (Click Exit Demo)


Step 6: Exit Confirmation
┌──────────────────────────────────────┐
│  Exit Demo Mode?                     │
│                                      │
│  This will clear all demo data      │
│  and return you to the home screen. │
│                                      │
│       [Cancel]    [Exit Demo]       │
└──────────────────────────────────────┘
           ↓ (Confirm exit)


Step 7: Back to Landing
┌──────────────────────────────────────┐
│         Welcome to Resumier          │
│                                      │
│  Ready to create your own resume?   │
│                                      │
│  [Google]    [Dropbox]              │
│  [GitHub]    [GitLab]               │
│                                      │
│  [🎭 Try Demo Mode] ← Try again!    │
│                                      │
│  → Continue with local storage      │
└──────────────────────────────────────┘


═══════════════════════════════════════════════════════════════

                      DATA FLOW DIAGRAM

┌──────────────┐
│ Auth Modal   │
│ (Start)      │
└──────┬───────┘
       │ Click "Try Demo Mode"
       ↓
┌──────────────────────────────────────────────┐
│ Demo Mode Initialization                     │
│                                              │
│ 1. Call initializeDemoMode()                │
│    ├→ Load demo-data.ts                     │
│    ├→ Create John Doe resume(s)             │
│    └→ Store in IndexedDB                    │
│                                              │
│ 2. Call loginAsDemo()                       │
│    ├→ Create demo user object               │
│    ├→ Set isGuest = true, isDemo = true     │
│    └→ Persist to localStorage               │
│                                              │
│ 3. Navigate to /dashboard                   │
└──────┬───────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────┐
│ IndexedDB Storage                            │
│                                              │
│ resumier-web-store:                         │
│ {                                            │
│   resumes: [                                 │
│     {                                        │
│       id: "demo-resume-1",                  │
│       title: "John Doe - Software Engineer",│
│       content: {                             │
│         personalInfo: {...},                 │
│         experience: [...],                   │
│         education: [...],                    │
│         skills: {...},                       │
│         certifications: [...],               │
│         links: [...]                         │
│       }                                      │
│     }                                        │
│   ]                                          │
│ }                                            │
│                                              │
│ resumier-documents:                         │
│ [                                            │
│   {                                          │
│     id: "demo-resume-1",                    │
│     title: "John Doe - Software Engineer",  │
│     createdAt: "2025-10-31...",            │
│     updatedAt: "2025-10-31..."             │
│   }                                          │
│ ]                                            │
└──────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────┐
│ localStorage (Auth)                          │
│                                              │
│ resumier-auth:                              │
│ {                                            │
│   state: {                                   │
│     user: {                                  │
│       id: "demo-1730400000000",            │
│       email: "demo@resumier.app",          │
│       name: "Demo User"                     │
│     },                                       │
│     isAuthenticated: false,                 │
│     isGuest: true,                          │
│     isDemo: true                            │
│   }                                          │
│ }                                            │
└──────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════

                    COMPONENT HIERARCHY

┌─────────────────────────────────────────────────────────┐
│ App                                                      │
│                                                          │
│  └─ Router                                              │
│      │                                                   │
│      ├─ AuthModal                                       │
│      │   ├─ OAuth Buttons (Google, Dropbox, etc.)      │
│      │   ├─ [🎭 Try Demo Mode] ← NEW                   │
│      │   └─ Guest Mode Link                            │
│      │                                                   │
│      ├─ Dashboard                                       │
│      │   ├─ Resume List                                │
│      │   │   └─ Demo Resumes (if isDemo)              │
│      │   └─ Demo Mode Badge ← Indicates demo active   │
│      │                                                   │
│      ├─ ResumeEditor                                    │
│      │   ├─ Personal Info Form (John Doe data)        │
│      │   ├─ Experience List (3 entries)               │
│      │   ├─ Education List (2 entries)                │
│      │   ├─ Skills Grid (32 skills)                   │
│      │   ├─ Certifications (3 certs)                  │
│      │   └─ Links (4 links)                           │
│      │                                                   │
│      └─ Settings                                        │
│          └─ DemoModeInfo Component ← NEW               │
│              ├─ Demo Status Display                    │
│              ├─ Resume Count                           │
│              ├─ [Export Demo Data]                     │
│              └─ [Exit Demo]                            │
└─────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════

                      STATE MANAGEMENT

┌─────────────────────────────────────────────────────────┐
│ useAuthStore (Zustand)                                   │
│                                                          │
│ State:                                                   │
│   • isDemo: boolean ← NEW                               │
│   • isGuest: boolean                                    │
│   • isAuthenticated: boolean                            │
│   • user: User | null                                   │
│                                                          │
│ Actions:                                                 │
│   • loginAsDemo() ← NEW                                 │
│   • setDemo(boolean) ← NEW                              │
│   • loginAsGuest()                                      │
│   • logout()                                            │
└─────────────────────────────────────────────────────────┘
           ↓ Consumed by
┌─────────────────────────────────────────────────────────┐
│ useDemoMode (Custom Hook) ← NEW                         │
│                                                          │
│ Returns:                                                 │
│   • isDemo: boolean                                     │
│   • hasData: boolean                                    │
│   • demoResumes: Resume[]                               │
│   • initializeDemo()                                    │
│   • exitDemo()                                          │
│   • exportData()                                        │
│   • refreshData()                                       │
└─────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════

Ready to implement! 🚀
```
