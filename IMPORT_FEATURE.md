# Resume Import Feature

## Overview

The Resume Import feature allows users to quickly populate their resume by importing data from various sources including LinkedIn, JSON files, and other platforms. This significantly improves the user experience by reducing manual data entry.

## Features

### Import Sources

#### ✅ Implemented
1. **LinkedIn** - Import profile data from LinkedIn URLs
2. **JSON File** - Import previously exported resume data

#### 🚧 Coming Soon
3. **PDF Resume** - AI-powered parsing of existing PDF resumes
4. **Indeed** - Import from Indeed profiles
5. **GitHub** - Import projects and bio from GitHub profiles

## Architecture

### Components

```
src/components/features/resume/import/
├── import-dialog.tsx           # Main import dialog component
├── index.ts                    # Export barrel
└── __tests__/
    └── import-dialog.test.tsx  # Component tests
```

### Services

```
src/lib/services/
├── import-service.ts           # Import logic for all sources
└── __tests__/
    └── import-service.test.ts  # Service tests
```

## Usage

### In ResumeBuilder

```tsx
import { ImportDialog } from "./import/import-dialog";

<ImportDialog
  trigger={
    <Button variant="default">
      <Upload className="mr-2 h-4 w-4" />
      Import Resume
    </Button>
  }
  onImportSuccess={handleImportSuccess}
/>
```

### Import Handler

```tsx
const handleImportSuccess = (importedData: Partial<ResumeContent>) => {
  // Merge imported data with existing content
  const mergedContent: Partial<ResumeContent> = {
    personalInfo: {
      ...content.personalInfo,
      ...importedData.personalInfo,
    },
    experience: [
      ...(content.experience || []),
      ...(importedData.experience || []),
    ],
    // ... merge other sections
  };

  // Save to API
  updateResume({
    id: resumeId,
    data: { content: mergedContent },
  });
};
```

## Import Flow

### 1. Source Selection
User opens the import dialog and sees available import sources:
- Sources display with icon, name, and description
- "Coming Soon" badge for unimplemented sources
- Click to select a source

### 2. Input Collection
Based on the selected source:
- **URL-based sources** (LinkedIn, GitHub, Indeed): Show URL input field
- **File-based sources** (JSON, PDF): Show file upload input

### 3. Import Processing
- Validate input (URL format or file type)
- Call appropriate import function
- Show loading state during import
- Handle errors with user-friendly messages

### 4. Data Merging
- Imported data is merged with existing resume content
- Arrays are concatenated (experience, education, etc.)
- Objects are shallow merged (personalInfo)
- User can review and edit all imported data

### 5. Success
- Toast notification confirms successful import
- Dialog closes
- Form updates with imported data
- Auto-save triggered for changes

## Data Structures

### Import Result

```typescript
interface ImportResult {
  success: boolean;
  data?: Partial<ResumeContent>;
  error?: string;
}
```

### Import Source

```typescript
interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiresUrl?: boolean;
  requiresFile?: boolean;
  comingSoon?: boolean;
}
```

## LinkedIn Import

### Current Implementation
The LinkedIn import is currently a **mock implementation** that returns sample data. 

### Real Implementation Requirements
To implement actual LinkedIn import, you would need:

1. **LinkedIn API Integration**
   - Register app with LinkedIn Developer Program
   - Implement OAuth 2.0 authentication
   - Request appropriate scopes (r_liteprofile, r_emailaddress)
   - Use LinkedIn API endpoints

2. **Alternative: Web Scraping**
   - Use headless browser (Puppeteer/Playwright)
   - Handle LinkedIn's anti-scraping measures
   - Parse profile HTML structure
   - ⚠️ May violate LinkedIn's Terms of Service

3. **Recommended: Browser Extension**
   - Create companion browser extension
   - User activates on their LinkedIn profile
   - Extension extracts data from DOM
   - Sends to Resumier app via messaging

### Mock Data Example

```typescript
const mockData: Partial<ResumeContent> = {
  personalInfo: {
    name: "Imported from LinkedIn",
    email: "example@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Professional summary from LinkedIn...",
  },
  experience: [
    {
      id: crypto.randomUUID(),
      company: "Tech Company Inc.",
      position: "Senior Software Engineer",
      // ... more fields
    },
  ],
  // ... more sections
};
```

## JSON Import

### File Format
Accepts JSON files exported from Resumier or matching the ResumeContent structure:

```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "Professional summary..."
  },
  "experience": [...],
  "education": [...],
  "skills": {...},
  "certifications": [...],
  "links": [...]
}
```

Or wrapped in a `content` object:

```json
{
  "content": {
    "personalInfo": {...},
    // ... rest of data
  }
}
```

### Validation
- Checks for `personalInfo` at root or under `content`
- Rejects files without valid resume structure
- Provides helpful error messages

## PDF Import (Coming Soon)

### Planned Implementation

1. **OCR Service Integration**
   Options:
   - AWS Textract
   - Google Cloud Vision API
   - Azure Form Recognizer
   - Open-source: Tesseract.js

2. **AI-Powered Parsing**
   - Use LLM (GPT-4, Claude) to structure extracted text
   - Prompt engineering for resume parsing
   - Entity extraction (companies, dates, skills)

3. **User Flow**
   ```
   Upload PDF → Extract Text → AI Parse → Review → Import
   ```

### Example Service Integration

```typescript
export async function importFromPDF(file: File): Promise<ImportResult> {
  // 1. Extract text using OCR
  const text = await extractTextFromPDF(file);
  
  // 2. Parse with AI
  const parsedData = await parseResumeWithAI(text);
  
  // 3. Map to ResumeContent structure
  const content = mapToResumeContent(parsedData);
  
  return {
    success: true,
    data: content,
  };
}
```

## Error Handling

### User-Facing Errors
- Invalid URL format
- Invalid file format
- Network errors
- Parsing errors
- API rate limits

### Error Messages
All errors show user-friendly toast notifications:
```typescript
toast({
  title: "Import Failed",
  description: "Invalid LinkedIn URL. Please check and try again.",
  variant: "destructive",
});
```

## Testing

### Component Tests
```bash
npm test src/components/features/resume/import/__tests__
```

Tests cover:
- Dialog opening/closing
- Source selection
- Input validation
- Import flow
- Error handling
- State management

### Service Tests
```bash
npm test src/lib/services/__tests__/import-service.test.ts
```

Tests cover:
- LinkedIn URL validation
- JSON file parsing
- Error scenarios
- Data structure validation

## Performance Considerations

1. **Lazy Loading**
   - Import dialog loads on-demand
   - Heavy parsing logic deferred until needed

2. **File Size Limits**
   - JSON files: No hard limit (browser memory)
   - PDF files: Recommend < 5MB

3. **Network Timeouts**
   - API calls timeout after 30 seconds
   - Show progress indicators for long operations

## Security Considerations

1. **URL Validation**
   - Validate URLs before making requests
   - Prevent SSRF attacks

2. **File Upload**
   - Validate file types on client and server
   - Scan for malicious content
   - Limit file sizes

3. **Data Privacy**
   - Don't store imported data without user consent
   - Clear sensitive data from memory after use
   - GDPR compliance for EU users

## Future Enhancements

### Priority 1: Essential
- [ ] Implement real LinkedIn API integration
- [ ] Add PDF parsing with OCR/AI
- [ ] Progress indicators for long imports
- [ ] Import preview before confirming

### Priority 2: Nice-to-Have
- [ ] GitHub profile import
- [ ] Indeed profile import
- [ ] Import from Google Docs
- [ ] Import from Microsoft Word
- [ ] Bulk import multiple resumes
- [ ] Import scheduling/automation

### Priority 3: Advanced
- [ ] Browser extension for data capture
- [ ] Import from email signatures
- [ ] AI-powered duplicate detection
- [ ] Smart merge suggestions
- [ ] Import analytics

## UI/UX Notes

### Visual Design
- Prominent placement at top of resume builder
- Eye-catching gradient background for import card
- Clear iconography for each import source
- "Coming Soon" badges for future features

### User Feedback
- Loading states during import
- Success/error toast notifications
- Clear error messages
- Preview of what will be imported

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- Focus management in dialog
- Error announcements

## Migration from Old System

If you had a previous import system:

1. **Data Migration**
   ```typescript
   // Map old format to new format
   const migrateOldImport = (oldData: OldFormat): ResumeContent => {
     return {
       personalInfo: mapPersonalInfo(oldData),
       // ... map other fields
     };
   };
   ```

2. **Backward Compatibility**
   - Support both old and new JSON formats
   - Automatic format detection
   - Data transformation layer

## Related Documentation

- [Resume Builder](./resume-builder.md)
- [Export Feature](./export-feature.md)
- [API Integration](../../../wiki/Development-Phases/PHASE_10_AUDIT.md)
- [Form Validation](../../../wiki/Development-Phases/PHASE_11_AUDIT.md)

## Support

For issues or questions:
1. Check error messages in console
2. Review test files for examples
3. Check API integration documentation
4. Open issue on GitHub

## Changelog

### v1.0.0 (2024-10-31)
- ✅ Initial implementation
- ✅ LinkedIn mock import
- ✅ JSON file import
- ✅ Import dialog UI
- ✅ Data merging logic
- ✅ Error handling
- ✅ Unit tests
- ✅ Documentation

### Future Releases
- v1.1.0: Real LinkedIn API integration
- v1.2.0: PDF import with AI parsing
- v1.3.0: GitHub and Indeed imports
- v2.0.0: Browser extension for data capture
