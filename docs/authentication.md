# Authentication Implementation

Complete authentication system for fin-web with route protection, user sessions, and API integration.

## Overview

The authentication system provides:
- User registration and login
- JWT token-based authentication
- Protected routes (dashboard requires login)
- Automatic token inclusion in API requests
- Redirect handling (logged in users → dashboard, logged out → login)

## Architecture

### Components

1. **AuthProvider** (`lib/auth/context.tsx`)
   - React context for global auth state
   - Manages user session and token
   - Provides `login()`, `logout()`, `register()` functions
   - Checks authentication on app load

2. **ProtectedRoute** (`components/protected-route.tsx`)
   - Wrapper component for protected pages
   - Redirects to `/sign-in` if not authenticated
   - Shows loading state while checking auth

3. **Auth Pages**
   - `/sign-in` - Login page
   - `/sign-up` - Registration page
   - Both redirect to dashboard if already logged in

### Data Flow

```
User Action (login/register)
  ↓
AuthProvider.login() or register()
  ↓
POST /auth/login or /auth/register
  ↓
Store JWT token in localStorage
  ↓
GET /auth/me (fetch user info)
  ↓
Update auth context state
  ↓
Redirect to /dashboard
```

### API Integration

All API requests automatically include the auth token:

```typescript
// lib/api/client.ts
async function apiFetch(endpoint, options) {
  const token = localStorage.getItem('auth_token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
  
  return fetch(API_URL + endpoint, { ...options, headers })
}
```

### User ID Extraction

Services extract user ID from the JWT token:

```typescript
// lib/auth/token.ts
export function getCurrentUserId(): string | null {
  const token = localStorage.getItem('auth_token')
  const payload = JSON.parse(atob(token.split('.')[1]))
  return payload.sub // User ID is in 'sub' claim
}
```

## Usage

### Protecting Routes

Wrap any page that requires authentication:

```tsx
// app/dashboard/layout.tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
```

### Using Auth in Components

```tsx
import { useAuth } from "@/lib/auth/context"

export function MyComponent() {
  const { user, logout } = useAuth()
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Calling Authenticated APIs

Services automatically use the authenticated user:

```tsx
// lib/services/dashboard-api.ts
export async function getDashboardKpis() {
  const userId = getCurrentUserId() // Extract from token
  
  if (!userId) {
    return mockData // Fallback if not authenticated
  }
  
  // API call includes token automatically via apiFetch
  return await fetchDashboardKpis(userId)
}
```

## Backend Requirements

The backend (`fin-api`) must provide these endpoints:

### POST /users/register
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}

Response: 201 Created
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_verified": false
}
```

### POST /users/login
```
Request (form-urlencoded):
username=user@example.com
password=SecurePassword123!

Response: 200 OK
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### GET /users/me
```
Request Headers:
Authorization: Bearer eyJhbGc...

Response: 200 OK
{
  "id": "user-uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_verified": true
}
```

### Protected Endpoints
All `/v0/*` endpoints require the `Authorization: Bearer <token>` header.

The backend extracts the user ID from the JWT token, so the frontend doesn't need to pass it explicitly in most cases.

## Security Considerations

### Token Storage
- JWT tokens stored in `localStorage`
- Tokens include user ID in `sub` (subject) claim
- Backend validates token signature and expiry

### HTTPS Required
In production, all traffic MUST use HTTPS to prevent token interception.

### Token Expiry
- Tokens expire after configured period (default: 4 hours)
- User must log in again when token expires
- Future enhancement: Add refresh token support

### XSS Protection
- Never expose raw tokens in HTML/logs
- Use `httpOnly` cookies for even better security (future enhancement)

## Mock Data Behavior

Services use mock data in these cases:
1. **Marketing mode** (`?marketing=1`) - Always mock
2. **No API URL configured** - Falls back to mock
3. **User not authenticated** - Falls back to mock

This allows:
- Frontend development without backend
- Demo/screenshot mode for marketing
- Graceful degradation if auth fails

## Testing

### Manual Testing

1. **Registration Flow**
   ```bash
   # Navigate to http://localhost:3000/sign-up
   # Fill in: name, email, password
   # Should redirect to /dashboard after success
   ```

2. **Login Flow**
   ```bash
   # Navigate to http://localhost:3000/sign-in
   # Enter credentials
   # Should redirect to /dashboard
   ```

3. **Protected Routes**
   ```bash
   # Without login, try: http://localhost:3000/dashboard
   # Should redirect to /sign-in
   ```

4. **Logout**
   ```bash
   # Click logout in dashboard
   # Should redirect to /sign-in
   # Token should be removed from localStorage
   ```

### Integration Testing

```typescript
// Test authentication flow
describe('Authentication', () => {
  it('should register new user', async () => {
    const response = await fetch('http://localhost:8000/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!@#',
        full_name: 'Test User'
      })
    })
    expect(response.status).toBe(201)
  })
  
  it('should login with credentials', async () => {
    const formData = new URLSearchParams()
    formData.append('username', 'test@example.com')
    formData.append('password', 'Test123!@#')
    
    const response = await fetch('http://localhost:8000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(data.access_token).toBeDefined()
  })
})
```

## Troubleshooting

### "Missing credentials" error
- Check that `NEXT_PUBLIC_API_URL` is set in `.env.local`
- Verify backend is running on the configured port
- Check browser console for token in localStorage

### Dashboard shows mock data
- Ensure you're logged in (check localStorage for `auth_token`)
- Verify token is valid: `jwt.io` to decode and check expiry
- Check API client includes Authorization header

### Redirect loops
- Clear localStorage: `localStorage.clear()`
- Check for conflicting redirects in auth pages
- Verify `useEffect` dependencies in ProtectedRoute

### CORS errors
- Backend must allow frontend origin
- Check `Access-Control-Allow-Origin` header
- Verify credentials mode in fetch requests

## Future Enhancements

1. **Refresh Tokens**
   - Automatically refresh expired access tokens
   - Extend session without re-login

2. **Remember Me**
   - Optional persistent login
   - Longer token expiry

3. **OAuth Providers**
   - Google Sign-In
   - GitHub Sign-In
   - Connect to `/auth/oauth/*` endpoints

4. **Email Verification**
   - Send verification email on registration
   - Verify email before granting full access

5. **Password Reset**
   - Forgot password flow
   - Email-based password reset

6. **Multi-Factor Authentication**
   - TOTP support
   - Backend already has MFA models ready

## Migration Notes

### From Demo User to Authenticated Users

Before authentication, services used hardcoded `DEMO_USER_ID = "demo_user"`:

```typescript
// OLD - Hardcoded user
const DEMO_USER_ID = "demo_user"
await fetchDashboardKpis(DEMO_USER_ID)

// NEW - Authenticated user
const userId = getCurrentUserId() // From JWT token
await fetchDashboardKpis(userId)
```

All services have been updated to extract user ID from the JWT token.

### Token-Based API Calls

API functions that modify user data (connect banking, disconnect provider) now use the token instead of explicit user ID:

```typescript
// Backend extracts user ID from token
await connectPlaid(accessToken, itemId) // No userId param
```

Only read-only endpoints still accept explicit `userId` parameter:
```typescript
await fetchDashboardKpis(userId) // Still needs userId
```

## Summary

✅ **Complete authentication system** with:
- User registration and login
- JWT token management
- Protected routes with redirect
- Automatic auth header injection
- User ID extraction from tokens
- Mock data fallback for development

🎉 **Ready for production** after:
- Enabling HTTPS
- Configuring session expiry
- Adding refresh tokens (optional)
- Setting up email verification (optional)
