# Database Transaction Error - Troubleshooting

## The Error

```
(sqlalchemy.dialects.postgresql.asyncpg.Error) <class 'asyncpg.exceptions.InFailedSQLTransactionError'>: 
current transaction is aborted, commands ignored until end of transaction block
```

## What This Means

This error occurs when:
1. A database operation failed (e.g., trying to register with an existing email)
2. The PostgreSQL transaction wasn't properly rolled back
3. Subsequent database queries fail because they're in an "aborted transaction"

This is a known issue with async database sessions when errors aren't handled properly.

## Quick Fix

### Option 1: Restart the Backend (Immediate)

```bash
cd fin-api

# Stop the server (Ctrl+C in the terminal)
# Then restart:
make run
```

This clears all active database connections and resets transaction state.

### Option 2: Refresh Database Connection Pool

If you can't restart, try this in your backend code (add to `app.py` startup):

```python
@app.on_event("startup")
async def startup():
    # Force connection pool refresh
    await app.state.db_engine.dispose()
```

## Permanent Fix

The issue is in how svc-infra handles database sessions. The session needs to be rolled back on error.

### Update Database Session Dependency

In `svc-infra`, the `SqlSessionDep` should include error handling:

```python
@asynccontextmanager
async def get_async_session():
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

## Prevention in Frontend

The frontend now handles this gracefully:

1. **Better Error Messages**: Database errors are detected and shown clearly
2. **Copy Button**: All error toasts include a clipboard icon to copy error details
3. **Retry Guidance**: Users are told to refresh the page

### Example Usage

```typescript
import { showErrorToast, formatError } from "@/lib/toast-utils"

try {
  await register(email, password)
} catch (error) {
  const { message, details } = formatError(error)
  showErrorToast(message, { description: details })
}
```

The error toast will show:
- ✅ Clear message: "Database transaction error"
- ✅ Helpful description: "Please refresh the page and try again"
- ✅ Copy button to copy full error for debugging
- ✅ Technical details for developers

## When This Happens

Common scenarios:
1. **Duplicate Email**: Trying to register with an email that exists
2. **Constraint Violations**: Breaking database unique/foreign key constraints
3. **Connection Issues**: Database connection drops mid-transaction
4. **Concurrent Operations**: Multiple requests modifying same data

## Debugging

### Check Backend Logs

```bash
# In fin-api terminal, look for:
ERROR - sqlalchemy.exc.IntegrityError
ERROR - asyncpg.exceptions.InFailedSQLTransactionError
```

### Check Database State

```sql
-- Check for locked transactions
SELECT * FROM pg_stat_activity 
WHERE state = 'idle in transaction'
  AND query_start < NOW() - INTERVAL '5 minutes';

-- Kill stuck connections (if needed)
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle in transaction';
```

### Test Registration Endpoint

```bash
# Test directly with curl
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "full_name": "Test User"
  }'

# Try duplicate (should fail gracefully)
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Different123!@#",
    "full_name": "Another User"
  }'
```

## Summary

✅ **Immediate Solution**: Restart backend with `make run`
✅ **User Experience**: Error toasts now have copy button
✅ **Error Handling**: Better formatting of database errors
✅ **Prevention**: Added guidance for users to refresh page

⚠️ **Root Cause**: Needs fix in svc-infra session handling (proper rollback on error)
