# Thread Storage Fix Summary

## Problem Identified ✅

Your thread matching wasn't working because the app was using **in-memory storage** instead of Redis. This means:

- Thread mappings were lost every time the server restarted
- Each webhook retry created duplicate messages
- Slack replies couldn't find the original email thread

## Changes Made

### 1. Enabled Redis Storage (`src/bolt/utils/thread-storage.ts`)

- ✅ Uncommented and fixed Redis implementation
- ✅ Updated to use `@upstash/redis` (already installed)
- ✅ Added automatic fallback to in-memory if Redis not configured
- ✅ Added clear logging to show which storage is being used

### 2. Added Redis Configuration (`env.template`)

- ✅ Added `UPSTASH_REDIS_REST_URL` 
- ✅ Added `UPSTASH_REDIS_REST_TOKEN`
- ✅ Added helpful comments about where to get these

### 3. Created Diagnostic Tool (`scripts/test-redis.ts`)

- ✅ Tests Redis connection
- ✅ Shows all stored thread mappings
- ✅ Displays summary statistics
- ✅ Added `pnpm test:redis` command

### 4. Created Documentation (`THREAD_STORAGE.md`)

- ✅ Comprehensive setup guide
- ✅ Troubleshooting section
- ✅ Performance considerations
- ✅ Advanced configuration options

## What You Need to Do

### Step 1: Set Up Upstash Redis (5 minutes)

1. Go to https://console.upstash.com/
2. Create a new database (free tier is fine)
3. Copy the REST API URL and token
4. Add them to your `.env` file:

```bash
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Step 2: Test the Connection

```bash
pnpm test:redis
```

You should see:
```
✅ Redis connection successful: PONG
```

### Step 3: Restart Your Dev Server

```bash
pnpm dev
# or
pnpm dev:tunnel
```

Look for this log message:
```
[ThreadStorage] Using Redis for persistent storage
```

If you see this instead, Redis isn't configured:
```
[ThreadStorage] Using in-memory storage - thread mappings will be lost on restart!
```

### Step 4: Test Thread Matching

1. Send a test email to your inbound address
2. Check that it appears in Slack
3. Reply to it in the Slack thread
4. Verify the email reply was sent (check for ✅ reaction)
5. Send another email reply to the same thread
6. Verify it appears in the same Slack thread

### Step 5: Deploy to Production

Make sure to add the Redis environment variables to your production environment (Vercel, etc.):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Troubleshooting

### "No Inbound thread found for this Slack thread"

This means the Slack thread doesn't have a mapping in Redis. Common causes:

1. ❌ Redis not configured → Set up Redis (see above)
2. ❌ Old thread created before Redis was enabled → Send a new test email
3. ❌ Thread wasn't created from an email → Only email threads can be replied to

### Duplicate Messages

If you're seeing duplicate messages:

1. ❌ Redis not configured → Set up Redis
2. ❌ Idempotency not working → Check Redis connection

### Thread Mappings Lost After Restart

If threads stop working after server restart:

1. ❌ Using in-memory storage → Check logs for Redis initialization message
2. ❌ Redis credentials invalid → Run `pnpm test:redis`

## Next Steps

After Redis is working, you might want to:

1. 📊 Monitor Redis usage in Upstash Console
2. 🔍 Add more debug logging if needed
3. 📝 Set up separate Redis databases for staging/production
4. ⏰ Add TTL to processed markers (see THREAD_STORAGE.md)

## Files Changed

- ✅ `src/bolt/utils/thread-storage.ts` - Enabled Redis
- ✅ `env.template` - Added Redis config
- ✅ `package.json` - Added test:redis script
- ✅ `scripts/test-redis.ts` - New diagnostic tool
- ✅ `THREAD_STORAGE.md` - Comprehensive documentation

## Questions?

1. Read `THREAD_STORAGE.md` for detailed info
2. Run `pnpm test:redis` to diagnose issues
3. Check server logs for thread storage messages
4. Look for `[THREAD MAPPING]` and `[IDEMPOTENCY]` logs

