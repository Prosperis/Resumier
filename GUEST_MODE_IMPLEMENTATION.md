# IndexedDB Guest Mode Implementation

## Summary

Successfully implemented full IndexedDB storage for guest mode users. Guest users can now create and edit resumes without signing up, with all data stored locally in IndexedDB.

## What Changed

### 1. Auth Store (`src/stores/auth-store.ts`)

**Added:**
- `isGuest: boolean` - Flag to track guest mode
- `loginAsGuest()` - Action to enable guest mode
- `setGuest()` - Action to set guest flag
- Guest user object with temporary ID

**Modified:**
- `logout()` - Skip API call for guest users
- Persist `isGuest` flag along with user data

### 2. Resume Documents Store (`src/hooks/use-resume-documents.ts`)

**Changed:**
- Migrated from localStorage to IndexedDB
- Uses `idb-keyval` like the main resume store
- Ensures all resume data is in IndexedDB

### 3. Auth Modal (`src/components/features/auth/auth-modal.tsx`)

**Changed:**
- Calls `loginAsGuest()` when "Continue as Guest" is clicked
- Properly initializes guest mode before navigation

### 4. New Utilities

**`src/lib/utils/guest-storage.ts`**
- `clearGuestData()` - Clear all guest data
- `exportGuestData()` - Export data as JSON
- `importGuestData()` - Import data to IndexedDB
- `hasGuestData()` - Check for existing data
- `migrateGuestDataToUser()` - Migrate to authenticated account

**`src/hooks/use-guest-storage.ts`**
- React hook for guest storage management
- Provides: `isGuest`, `hasData`, `isChecking`, `clearData`, `exportData`, `migrateToUser`

### 5. New Components

**`src/components/features/guest/guest-mode-info.tsx`**
- UI component showing guest status
- Backup/export functionality
- Clear data option
- Prompt to sign up

### 6. Documentation

**`wiki/Guides/Guest-Mode-Storage.md`**
- Complete guide to guest mode
- Architecture documentation
- API reference
- Usage examples
- Troubleshooting

## Storage Structure

### Before
```
localStorage:
  - resumier-auth (auth state)
  - resumier-documents (document list) ← Was here
  - resumier-theme (theme preference)

IndexedDB:
  - resumier-web-store (resume data)
```

### After
```
localStorage:
  - resumier-auth (auth state + isGuest flag)
  - resumier-theme (theme preference)

IndexedDB:
  - resumier-web-store (resume data)
  - resumier-documents (document list) ← Moved here
```

## Benefits

1. **Consistency**: All resume data in IndexedDB
2. **Capacity**: More storage for guest users (~50MB+)
3. **Performance**: Async operations don't block UI
4. **Offline Ready**: Full offline functionality
5. **Migration Path**: Easy to move data to authenticated accounts

## Usage Examples

### Enable Guest Mode

```typescript
import { useAuthStore } from "@/stores/auth-store";

function LoginButton() {
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  
  return (
    <button onClick={loginAsGuest}>
      Continue as Guest
    </button>
  );
}
```

### Check Guest Status

```typescript
import { useAuthStore, selectIsGuest } from "@/stores/auth-store";

function MyComponent() {
  const isGuest = useAuthStore(selectIsGuest);
  
  return (
    <div>
      {isGuest ? "Guest User" : "Authenticated User"}
    </div>
  );
}
```

### Manage Guest Data

```typescript
import { useGuestStorage } from "@/hooks/use-guest-storage";

function GuestDashboard() {
  const { isGuest, hasData, clearData, exportData } = useGuestStorage();
  
  if (!isGuest) return null;
  
  return (
    <div>
      {hasData && (
        <>
          <button onClick={exportData}>Backup My Data</button>
          <button onClick={clearData}>Clear All Data</button>
        </>
      )}
    </div>
  );
}
```

### Export Guest Data

```typescript
import { exportGuestData } from "@/lib/utils/guest-storage";

async function backupData() {
  const data = await exportGuestData();
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  // ... create download link
}
```

## Testing

Run the application and:

1. ✅ Click "Continue as Guest" on auth modal
2. ✅ Create a new resume
3. ✅ Verify data persists after page reload
4. ✅ Check DevTools → Application → IndexedDB for data
5. ✅ Test export functionality
6. ✅ Test clear data functionality

## Next Steps

### Short Term
- [ ] Add guest mode indicator in header
- [ ] Show storage usage to guest users
- [ ] Add "Sign up to sync" prompts

### Medium Term
- [ ] Implement migration when guest signs up
- [ ] Add data backup reminders
- [ ] Create import functionality for backups

### Long Term
- [ ] QR code transfer between devices
- [ ] Optional cloud backup for guests
- [ ] PWA offline sync
- [ ] Multi-device guest sync via peer-to-peer

## Migration Path (Future)

When backend is implemented:

```typescript
// After guest signs up
const userId = newUser.id;
const guestData = await exportGuestData();

// Send to backend
await apiClient.post(`/users/${userId}/migrate`, guestData);

// Clear local guest data
await clearGuestData();

// Sync from backend
await syncUserData(userId);
```

## Browser Compatibility

✅ Chrome 24+  
✅ Firefox 16+  
✅ Safari 10+  
✅ Edge (all versions)  
✅ All modern mobile browsers

## Known Limitations

1. **Device-Local**: Data doesn't sync across devices
2. **Browser Storage**: Subject to browser quotas
3. **Manual Backup**: Users must manually export data
4. **No Backend**: Migration not yet implemented

## Files Changed

```
Modified:
- src/stores/auth-store.ts
- src/hooks/use-resume-documents.ts
- src/components/features/auth/auth-modal.tsx

Created:
- src/lib/utils/guest-storage.ts
- src/hooks/use-guest-storage.ts
- src/components/features/guest/guest-mode-info.tsx
- wiki/Guides/Guest-Mode-Storage.md
- GUEST_MODE_IMPLEMENTATION.md (this file)
```

## Questions?

See the full documentation: `wiki/Guides/Guest-Mode-Storage.md`
