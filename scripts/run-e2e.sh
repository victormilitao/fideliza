#!/bin/bash
# Script to run E2E tests with Supabase local env vars
# Temporarily swaps .env.local with .env.test so Next.js uses local Supabase

set -e

ENV_LOCAL=".env.local"
ENV_TEST=".env.test"
ENV_LOCAL_BACKUP=".env.local.bak"

# Backup .env.local if it exists
if [ -f "$ENV_LOCAL" ]; then
  mv "$ENV_LOCAL" "$ENV_LOCAL_BACKUP"
  echo "📦 Backed up .env.local"
fi

# Copy .env.test as .env.local so Next.js loads it
cp "$ENV_TEST" "$ENV_LOCAL"
echo "🔗 Using .env.test as .env.local"

# Ensure we restore on exit (even on error/Ctrl+C)
cleanup() {
  rm -f "$ENV_LOCAL"
  if [ -f "$ENV_LOCAL_BACKUP" ]; then
    mv "$ENV_LOCAL_BACKUP" "$ENV_LOCAL"
    echo "♻️  Restored original .env.local"
  fi
}
trap cleanup EXIT

# Run Playwright
npx playwright test "$@"
