# App UI Implementation Plan

## Overview
This document outlines the detailed implementation plan for the BizOS app UI, including tasks, timeline, dependencies, and priorities. The app UI will be built using Next.js, Tailwind CSS, and React components with a clean, modern design approach using CSS variables for theming support. The platform will use a credit-based system for agent usage.

## Page Structure

### Main Application Pages (Phase 1 - Minimal MVP)
- ✅ Dashboard (`app/(app)/app/`) - Primary homepage with metrics and credit system
- ⬜ Discovery Page (`app/(app)/discovery/`) - Browse and subscribe to pre-built agents
- ⬜ Agent Builder (`app/(app)/agents/builder/`) - Create custom agents with workflows
- ⬜ Conversations (`app/(app)/conversations/`) - Chat interface for agent interactions
- ⬜ Knowledge Base (`app/(app)/knowledge/`) - Document management for agents
- ✅ Settings (`app/(app)/settings/`) - Account, subscription, and credit management
- ⬜ Landing Page (`app/`) - Marketing page for visitors with signup

### Authentication Pages
- ✅ Sign In (`app/(auth)/sign-in/`)
- ✅ Sign Up (`app/(auth)/sign-up/`)

### Phase 2 Pages (Future Implementation)
- ⬜ Analytics Dashboard (`app/(app)/analytics/`)
- ⬜ Team Management (`app/(app)/team/`)
- ⬜ Credentials Manager (`app/(app)/credentials/`)
- ⬜ Workflow Editor (`app/(app)/workflows/editor/`)
- ⬜ Approval Center (`app/(app)/approvals/`)
- ⬜ Billing & Subscription (`app/(app)/billing/`)
- ⬜ Help & Documentation (`app/(app)/help/`)

## Implementation Phases

### Phase 1: Foundation (Week 1)

#### Days 1-2: Environment Setup and Core Components
- [x] Configure Tailwind CSS for theming with CSS variables
  - [x] Set up custom utilities and colors in Tailwind config
  - [x] Create CSS variables for light and dark mode
  - [x] Configure theme with appropriate color palette
- [x] Create base component library
  - [x] Card component with variants
  - [x] Button with different states
  - [x] Form controls (inputs, select, checkbox)
  - [x] Typography components with proper styling
- [ ] Create credit system components
  - [ ] CreditBalance display component
  - [ ] CreditUsageChart component
  - [ ] Credit transaction log component
  - [ ] Credit purchase interface

#### Days 3-4: Layout Framework
- [x] Implement layout components
  - [x] Main page container with proper background
  - [x] Side navigation with theming support
  - [x] Top navigation bar with credit balance indicator
  - [x] Content area with proper padding and spacing
- [x] Set up responsive breakpoints
  - [x] Desktop-first approach with tablet and mobile adaptations
  - [x] Collapsible sidebar for smaller screens
  - [x] Adjustments for various screen sizes

#### Day 5: Navigation and Authentication
- [x] Set up Next.js page routing
  - [x] Create route structure for app sections
  - [x] Configure protection for authenticated routes
  - [x] Set up navigation state management
- [x] Implement authentication components
  - [x] Sign in and sign up forms
  - [x] User session management
  - [x] Protected route handling

### Phase 2: Core App Components (Week 2)

#### Days 1-2: Dashboard Implementation
- [ ] Update home dashboard
  - [ ] Credits overview panel
  - [ ] Credit usage chart
  - [ ] Subscribed agents list with credit costs
  - [ ] Latest executions feed with credit usage
  - [ ] Pending approvals panel with credit implications

#### Days 3-4: Discovery Page
- [ ] Implement discovery page
  - [ ] Featured agents section
  - [ ] Category filters
  - [ ] Search and filter system
  - [ ] Agent cards with credit cost indicators
  - [ ] Detailed view panel

#### Day 5: Agent Builder (Basic Version)
- [ ] Create simplified agent builder
  - [ ] Template selection interface
  - [ ] Basic workflow configuration
  - [ ] Knowledge base connection
  - [ ] Test panel with credit cost indicator
  - [ ] Settings panel with credit limits

### Phase 3: Agent Interaction (Week 3)

#### Days 1-2: Conversations Interface
- [ ] Build conversations page
  - [ ] Agent selector with credit indicators
  - [ ] Chat interface with per-message cost
  - [ ] Context panel
  - [ ] In-chat approval requests
  - [ ] Conversation controls and export

#### Days 3-4: Knowledge Base Management
- [ ] Implement knowledge base page
  - [ ] Document upload with credit cost indicators
  - [ ] Documents list with storage costs
  - [ ] Agent assignment panel
  - [ ] Search and organization
  - [ ] Document preview with processing options

#### Day 5: Settings and Credit Management
- [ ] Complete settings page
  - [ ] Account section
  - [ ] Subscription section
  - [ ] Credits section with purchase interface
  - [ ] Team section (basic version)
  - [ ] API section with credit costs

### Phase 4: Landing Page and Polish (Week 4)

#### Days 1-2: Landing Page
- [ ] Build marketing landing page
  - [ ] Hero section with value proposition
  - [ ] Feature highlights of key agent types
  - [ ] How it works section with 3-step process
  - [ ] Pricing section with credit system explanation
  - [ ] Signup CTA and form

#### Days 3-4: Credit System Integration
- [ ] Implement credit system backend
  - [ ] Credit transaction database
  - [ ] Purchase flow integration
  - [ ] Usage tracking and calculation
  - [ ] Notification systems for low balance
  - [ ] Auto-pause functionality

#### Day 5: Testing and Optimization
- [ ] Perform cross-browser testing
  - [ ] Verify appearance in major browsers
  - [ ] Test on various devices and screen sizes
- [ ] Accessibility audit
  - [ ] Test keyboard navigation
  - [ ] Verify screen reader support
  - [ ] Check contrast ratios

## Dependencies

### Required Libraries
- Next.js (already in project)
- Tailwind CSS (already in project)
- React Icons (for consistent icon system)
- Lucide React (for icons)
- Recharts (for credit usage charts)
- React Query (for data fetching and caching)
- Next Themes (for theme management)
- React Hook Form (for form management)

### Backend Integration
- Supabase client for data access
- Authentication state management
- API endpoints for credit system
- File storage for knowledge base

## Priority Tasks
The following tasks are the highest priority to accomplish next:

1. ~~Tailwind configuration for theming with CSS variables~~ ✓
2. ~~Base component library implementation~~ ✓
3. ~~Layout framework with sidebar and navigation~~ ✓
4. ~~Protected route implementation~~ ✓
5. ~~Theme toggle and dark mode support~~ ✓
6. Credit Balance component implementation
7. Credit Usage Chart component
8. Update Dashboard to display credit system
9. Agent Card with credit cost indicator
10. Create Discovery page structure

## Success Criteria

- ✓ All app pages use the consistent design system with proper CSS variables
- ✓ Dark/light mode toggle works seamlessly with theme persistence
- ✓ Navigation between sections works seamlessly
- ✓ Responsive layout functions on desktop, tablet, and mobile devices
- ○ Credit balance is prominently displayed throughout the app
- ○ Agents show clear credit cost per execution
- ○ Users can purchase credits through intuitive interface
- ○ Credit usage history is tracked and displayed
- ○ Agent builder allows creation of custom workflows
- ○ Knowledge base supports document management with credit costs
- ✓ Accessibility requirements are met (keyboard navigation, screen readers, contrast)

Legend:
- ✓ = Completed
- ○ = Pending

## Design System Refactoring
We have successfully implemented the new design system defined in NEW_DESIGN_SYSTEM.md to replace the previous glassmorphism approach. Key changes include:

1. **CSS Variable-Based Theming**
   - Implemented HSL-based color variables
   - Added support for both light and dark modes
   - Created semantic color variables for consistent usage

2. **Component Refactoring**
   - Updated all UI components to use the new variables
   - Replaced hardcoded colors with theme variables
   - Added proper support for dark mode across all components

3. **Navigation and Layout**
   - Refactored SideNav and TopNav components
   - Updated the DashboardGrid for better flexibility
   - Improved responsive behavior

4. **Icon System**
   - Migrated to Lucide React for consistent icon usage
   - Replaced SVG elements with component-based icons

## Next Steps (Credit System Implementation)
1. **Create Credit System Components**
   - Implement CreditBalance component for navigation
   - Create CreditUsageChart for dashboard
   - Build credit transaction log component
   - Develop credit purchase interface

2. **Update Dashboard**
   - Replace current metrics with credit-focused panels
   - Add agent cards with credit cost indicators
   - Implement execution feed with credit costs
   - Add pending approvals with credit implications

3. **Implement Discovery Page**
   - Create agent browsing interface
   - Add credit cost indicators to all agents
   - Develop detailed view with usage estimates
   - Build subscription flow

4. **Build Agent Builder**
   - Create template selection interface
   - Implement simplified workflow builder
   - Add credit cost estimation
   - Create testing interface with credit tracking 