# Phase 7: Frontend-Backend Integration

## Setup Complete ✅

### Files Created:
1. **`lib/api/client.ts`** - Complete API client with all fin-api endpoints
2. **`lib/services/dashboard-api.ts`** - Dashboard service with API integration + mock fallback
3. **`lib/services/insights.ts`** - Insights service with API integration
4. **`lib/services/portfolio.ts`** - Portfolio service with API integration  
5. **`lib/services/banking.ts`** - Banking connection service with API integration

### Environment Variable Added:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
# Production: https://fin-api-production.up.railway.app
```

## How It Works

### Three Data Modes

#### 1. Marketing Mode (Always Mock) 🎨
Add `?marketing=1` to any URL to force mock data display, regardless of environment or API configuration.
```
https://fin-web.app/dashboard?marketing=1
```
**Use case**: Marketing screenshots, demos, landing page previews

#### 2. Development Mode (Mock Data) 💻
By default, services use mock data if `NEXT_PUBLIC_API_URL` is not set or in development mode.
```typescript
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development'
```

#### 3. Production Mode (Real API) 🚀
When `NEXT_PUBLIC_API_URL` is set and not in marketing mode, services fetch from real API.

### Enable Real API
1. Copy `.env.local.example` to `.env.local`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` (or Railway URL)
3. Services will automatically switch to real API

### Service Layer Logic
Each service checks marketing mode first, then environment:
```typescript
export async function getDashboardKpis(): Promise<KPI[]> {
  // Priority 1: Marketing mode override
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return getMockData()
  }

  // Priority 2: Development/API not configured
  if (USE_MOCK_DATA) {
    return getMockData()
  }

  // Priority 3: Real API
  try {
    return await fetchFromAPI()
  } catch (error) {
    return getMockData() // Fallback on error
  }
}
```

## Next Steps

### 1. Update Dashboard to Use New Service
Replace `lib/services/dashboard.ts` import with `dashboard-api.ts`:
```typescript
// OLD
import { getDashboardKpis } from "@/lib/services/dashboard"

// NEW  
import { getDashboardKpis } from "@/lib/services/dashboard-api"
```

### 2. Add Authentication
- Implement user authentication (JWT)
- Replace `DEMO_USER_ID` with real user ID from auth context
- Add auth token to API requests

### 3. Test with Real Backend
```bash
# Terminal 1: Start fin-api
cd fin-api && make run

# Terminal 2: Start fin-web with API enabled
cd fin-web
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
pnpm dev
```

### 4. Connect Banking
- Use Plaid Link or Teller to get access tokens
- Call `linkPlaidAccount()` or `linkTellerAccount()`
- Banking data will flow to dashboard

## API Client Features

✅ Type-safe API calls
✅ Error handling with fallbacks
✅ All fin-api v0 endpoints covered
✅ Mock data fallback for development
✅ Ready for authentication integration

## Files to Update Next

1. `app/dashboard/page.tsx` - Use `dashboard-api.ts` instead of `dashboard.ts`
2. `components/overview-kpis.tsx` - Will automatically get real data
3. `app/dashboard/insights/page.tsx` - Use new `insights.ts` service
4. `app/dashboard/portfolio/page.tsx` - Use new `portfolio.ts` service
5. Add authentication context to provide real user ID
