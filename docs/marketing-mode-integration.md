# Marketing Mode Integration - Phase 7 Update

## ✅ Completed: Marketing Mode Support

All Phase 7 API services now support the marketing mode parameter (`?marketing=1`).

## What Changed

### Updated Service Files

#### 1. `lib/services/dashboard-api.ts`
- ✅ Added `isMarketingMode()` import
- ✅ Marketing mode check as **first priority** before API calls
- ✅ Updated documentation

#### 2. `lib/services/insights.ts`
- ✅ Added `isMarketingMode()` import
- ✅ Converted to async functions with marketing mode support
- ✅ Added API integration structure (ready for implementation)

#### 3. `lib/services/portfolio.ts`
- ✅ Added `isMarketingMode()` import
- ✅ Converted to async function with marketing mode support
- ✅ Added API integration structure (ready for implementation)

#### 4. `lib/services/banking.ts`
- ✅ Added `isMarketingMode()` import
- ✅ Marketing mode check in `getBankingConnectionStatus()`
- ✅ Updated documentation

#### 5. `docs/phase-7-setup.md`
- ✅ Added "Three Data Modes" section
- ✅ Documented marketing mode priority
- ✅ Added service layer logic example

## How It Works

### Data Mode Priority (Highest to Lowest)

1. **Marketing Mode** (`?marketing=1`) → Always mock data
2. **Development Mode** (No API URL or `NODE_ENV=development`) → Mock data
3. **Production Mode** (API URL set) → Real API with fallback

### Example Flow

```typescript
// User visits: https://fin-web.app/dashboard?marketing=1

export async function getDashboardKpis(): Promise<KPI[]> {
  // ✅ HITS: Marketing mode detected
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return getMockData() // Returns immediately
  }

  // ⏭️ SKIPPED: Marketing mode already returned
  if (USE_MOCK_DATA) {
    return getMockData()
  }

  // ⏭️ SKIPPED: Never reaches API call
  try {
    return await fetchFromAPI()
  } catch (error) {
    return getMockData()
  }
}
```

## Use Cases

### ✅ Marketing Screenshots
```bash
pnpm shots:serve
# Script automatically adds ?marketing=1 to all URLs
# Clean, consistent mock data for screenshots
```

### ✅ Landing Page Demos
```html
<a href="/demo/dashboard?marketing=1">See Demo</a>
<!-- Visitors see polished mock data, not their empty state -->
```

### ✅ Development Testing
```bash
# Test with mock data (no backend needed)
pnpm dev
# Visit http://localhost:3000/dashboard

# Test with real API
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
pnpm dev
# Visit http://localhost:3000/dashboard

# Force mock data even with API configured
# Visit http://localhost:3000/dashboard?marketing=1
```

## Testing Checklist

- [x] Marketing mode forces mock data when API is configured
- [x] Marketing mode works in both dev and production
- [x] Services fall back to mock data on API errors
- [x] No TypeScript errors in updated files
- [x] Documentation updated

## Next Steps

To fully connect the services to the UI:

1. **Update Dashboard Components**
   ```typescript
   // In app/dashboard/page.tsx
   import { getDashboardKpis } from "@/lib/services/dashboard-api"
   
   const kpis = await getDashboardKpis(persona)
   ```

2. **Add Authentication**
   - Replace `DEMO_USER_ID` with real user ID
   - Add JWT token to API client requests

3. **Test Full Integration**
   ```bash
   # Start backend
   cd fin-api && make run
   
   # Start frontend with API
   cd fin-web
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   pnpm dev
   
   # Test marketing mode override
   open http://localhost:3000/dashboard?marketing=1
   ```

## Files Modified

```
fin-web/
├── lib/
│   └── services/
│       ├── dashboard-api.ts    ✅ Updated
│       ├── insights.ts         ✅ Updated
│       ├── portfolio.ts        ✅ Updated
│       └── banking.ts          ✅ Updated
└── docs/
    └── phase-7-setup.md        ✅ Updated
```

## Related Documentation

- **Marketing Screenshots**: `docs/marketing-screenshots.md`
- **Marketing System**: `docs/marketing-system.md`
- **Marketing Mode Utility**: `lib/marketingMode.ts`
- **Phase 7 Setup**: `docs/phase-7-setup.md`

---

**Status**: ✅ Complete - All services now support marketing mode parameter
