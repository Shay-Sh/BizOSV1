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

echo "Local development environment setup complete!"
echo "You can now run 'npm run dev' to start the development server." 