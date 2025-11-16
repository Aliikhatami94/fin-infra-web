# Integration Testing Guide

## Quick Start

### 1. Start Backend (fin-api)
```bash
cd fin-api
make run
# Backend runs on http://localhost:8000
```

### 2. Configure Frontend (fin-web)
```bash
cd fin-web

# Environment is already configured in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start Frontend
```bash
cd fin-web
pnpm dev
# Frontend runs on http://localhost:3000
```

### 4. Run Integration Tests
```bash
cd fin-web
pnpm tsx scripts/test-api-integration.ts
```

## Testing with the Web App

### Test Real API Data
1. Visit: http://localhost:3000/dashboard
2. The app will automatically fetch from http://localhost:8000/v0/*
3. Check browser console for API calls

### Test Marketing Mode (Mock Data)
1. Visit: http://localhost:3000/dashboard?marketing=1
2. Forces mock data display regardless of API
3. Used for screenshots and demos

### Switch Between Modes

**Development Mode (Mock Data)**:
```bash
# Remove or comment out NEXT_PUBLIC_API_URL in .env.local
# NEXT_PUBLIC_API_URL=
pnpm dev
```

**Production Mode (Real API)**:
```bash
# Set NEXT_PUBLIC_API_URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
pnpm dev
```

## Available v0 Endpoints

All endpoints available at `http://localhost:8000/v0/*`:

### Dashboard
- `GET /v0/dashboard/kpis?user_id=<id>` - Key performance indicators
- `GET /v0/dashboard/summary?user_id=<id>` - Full dashboard summary

### Insights
- `GET /v0/insights/feed?user_id=<id>&limit=10` - Insights feed
- `GET /v0/insights/summary?user_id=<id>` - Insights summary by category

### Portfolio
- `GET /v0/portfolio/metrics?user_id=<id>` - Portfolio performance metrics
- `GET /v0/portfolio/benchmark?user_id=<id>&benchmark=SPY` - Benchmark comparison
- `GET /v0/portfolio/allocation?user_id=<id>` - Asset allocation

### Banking Connection (Requires Auth)
- `POST /v0/banking-connection/plaid` - Connect Plaid account
- `POST /v0/banking-connection/teller` - Connect Teller account
- `GET /v0/banking-connection/status?user_id=<id>` - Connection status
- `DELETE /v0/banking-connection/{provider}` - Disconnect provider

### AI Features
- `GET /v0/ai/categories` - Available transaction categories
- `POST /v0/ai/categorize` - Categorize transaction
- `POST /v0/ai/chat` - Chat with AI assistant
- `GET /v0/ai/chat/history?user_id=<id>` - Chat history

### Status
- `GET /v0/status` - API health status

## API Documentation

- **Main API**: http://localhost:8000/docs
- **v0 API**: http://localhost:8000/v0/docs
- **OpenAPI Schema**: http://localhost:8000/v0/openapi.json

## Testing Checklist

### ✅ Backend Connectivity
```bash
curl http://localhost:8000/ping
# Should return 200 OK
```

### ✅ v0 Endpoints
```bash
curl "http://localhost:8000/v0/dashboard/kpis?user_id=test_user"
# Should return JSON with net_worth, cash_flow, savings_rate
```

### ✅ Frontend API Client
```bash
cd fin-web
pnpm tsx scripts/test-api-integration.ts
# Should show 6/7 tests passing
```

### ✅ Browser Integration
1. Open http://localhost:3000/dashboard
2. Open browser DevTools → Network tab
3. Look for XHR requests to http://localhost:8000/v0/*
4. Should see successful 200 responses

### ✅ Marketing Mode Override
1. Visit http://localhost:3000/dashboard?marketing=1
2. Should show mock data (no API calls in Network tab)
3. Remove `?marketing=1` to switch back to API data

## Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
lsof -ti:8000

# Restart backend
cd fin-api
make run
```

### Frontend Not Connecting
```bash
# Check .env.local configuration
cd fin-web
cat .env.local | grep NEXT_PUBLIC_API_URL

# Should show: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### CORS Issues
Check fin-api CORS settings in `src/fin_api/settings.py`:
```python
cors_origins: str = "http://localhost:3000,http://localhost:3001"
```

### Empty Data
This is expected! The backend returns empty data for new users:
- Net Worth: $0
- Cash Flow: $0
- Insights: 0 items

To test with real data, you need to:
1. Connect banking providers (Plaid/Teller)
2. Add transactions via `/banking` endpoints
3. Data will then populate in dashboard

## Next Steps

### Phase 7 Remaining Tasks

1. **Update Dashboard Components**
   - Replace mock imports with API services
   - `import { getDashboardKpis } from "@/lib/services/dashboard-api"`

2. **Add Authentication**
   - Implement user auth context
   - Replace `DEMO_USER_ID` with real user ID
   - Add JWT token to API requests

3. **Connect Banking Providers**
   - Implement Plaid Link flow
   - Add Teller certificate authentication
   - Test full account connection workflow

4. **Test with Real Data**
   - Connect test bank account
   - Import transactions
   - Verify dashboard displays real data

## Test Results

Last test run: ✅ 6/7 passed (85.7%)
- ✅ Connectivity
- ✅ Dashboard KPIs
- ✅ Dashboard Summary
- ✅ Insights Feed
- ✅ Portfolio Metrics
- ❌ Banking Connection (requires auth - expected)
- ✅ AI Categories

Average response time: ~6ms 🚀
