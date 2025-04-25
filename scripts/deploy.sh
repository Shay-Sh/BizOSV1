#!/bin/bash

# This script helps with deploying the BizOS application

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI is not installed. Installing..."
  npm install -g vercel
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI is not installed. Installing..."
  npm install -g supabase
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
echo "Remember to set up the following in your Vercel project settings:"
echo "1. Connect to Supabase through Vercel integrations"
echo "2. Set up Clerk environment variables"
echo "3. Link your custom domain, if needed" 