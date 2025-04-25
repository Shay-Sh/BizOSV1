#!/bin/bash

# Exit on error
set -e

echo "Setting up local development environment for BizOS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v18 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Desktop."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Initialize Supabase project if not already initialized
if [ ! -d ".supabase" ]; then
    echo "Initializing Supabase project..."
    supabase init
fi

# Start Supabase locally
echo "Starting Supabase services..."
supabase start

# Generate TypeScript types
echo "Generating TypeScript types from the database schema..."
npm run generate-types

# This script helps set up local environment variables for development
# Do not commit this file to version control if it contains sensitive information

# Create .env.local file
cat > .env.local << EOL
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL="https://dybdraqdzauxzndqscij.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzgzMzAsImV4cCI6MjA2MTE1NDMzMH0.H9Jbvst9T1ehbyObxiV_2FmBCnxxoCXpcKllhVcisXM"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmRyYXFkemF1eHpuZHFzY2lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTU3ODMzMCwiZXhwIjoyMDYxMTU0MzMwfQ.NIUBkMiyX7iuWM1kmps1_t3G5HX07j6eFJx1LqTojqI"
SUPABASE_JWT_SECRET="3sxFHkD7C0dwNNYO4Bxz+w3iblJI2EBdqFMOzoBGCPlr6RTDYDLYxlefWo0K6Yhzv5dw3z6X/EINQLWhHArvZg=="

# Database Connection Strings
POSTGRES_URL="postgres://postgres.dybdraqdzauxzndqscij:6YUycOm8q7HwYRHv@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.dybdraqdzauxzndqscij:6YUycOm8q7HwYRHv@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_URL_NON_POOLING="postgres://postgres.dybdraqdzauxzndqscij:6YUycOm8q7HwYRHv@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="6YUycOm8q7HwYRHv"
POSTGRES_DATABASE="postgres"
POSTGRES_HOST="db.dybdraqdzauxzndqscij.supabase.co"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlc2VudC1wdWctNzYuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_5I5bQF6vrADN1tJXuxx1dYBAd7E8QIwd16NqcwYwJ5
EOL

echo "Environment file .env.local created successfully!"
echo "WARNING: This file contains sensitive information and should not be committed to version control."
echo "It has been added to .gitignore to prevent accidental commits."

# Generate TypeScript types from Supabase schema
echo "Generating TypeScript types from Supabase schema..."
npx supabase gen types typescript --project-id dybdraqdzauxzndqscij > types/database.types.ts
echo "TypeScript types updated!"

echo "Local development environment setup complete!"
echo "You can now run 'npm run dev' to start the development server." 