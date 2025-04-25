# BizOS - Business AI Operating System

BizOS is a comprehensive AI agent platform that enables users to create, customize, and deploy AI agents for various workflows without coding knowledge. The platform offers drag-and-drop workflow building, credential management, human-in-the-loop capabilities, and more.

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Serverless functions on Vercel
- **Database**: Supabase PostgreSQL
- **Authentication**: Clerk
- **Workflow Engine**: Custom built on Vercel
- **Billing**: Stripe Integration
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Docker (for local Supabase instance)
- Supabase CLI

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/bizos.git
cd bizos
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the local Supabase instance**

```bash
npm run supabase:start
# or
yarn supabase:start
```

4. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
bizos/
├── app/                    # Next.js app directory
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # UI components
│   ├── forms/              # Form components
│   ├── workflow/           # Workflow builder components
│   └── shared/             # Shared components
├── lib/                    # Utility functions and classes
│   ├── supabase/           # Supabase client
│   ├── clerk/              # Clerk auth
│   └── workflow-engine/    # Workflow execution engine
├── public/                 # Static assets
├── styles/                 # Global styles
├── supabase/               # Supabase configuration
│   └── migrations/         # Database migrations
├── types/                  # TypeScript type definitions
└── README.md               # Project documentation
```

## Database Schema

The database schema includes tables for:

- User profiles
- Organizations and teams
- Agent templates and instances
- Workflow executions
- Credentials and access control
- Human approvals
- Conversations and messages
- Analytics and metrics
- Billing and subscriptions

See the `supabase/migrations` directory for the complete schema.

## Development Workflow

1. Create a new branch for your feature
2. Implement the feature
3. Write tests if applicable
4. Submit a pull request
5. After review, merge to main

## Deployment

The application is deployed on Vercel with Supabase for the backend.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 