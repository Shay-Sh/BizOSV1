# BizOS Platform - Minimal Phase 1 Pages

## Implementation Progress Tracker

### Completed Pages
- ✅ Dashboard Page (`app/(app)/app/`) - Primary application homepage (needs credit system update)
- ✅ Settings (`app/(app)/settings/`) - Basic structure implemented (needs credit system integration)

### In Progress
- 🔄 Agent Builder (`app/(app)/agents/builder/`) - Basic structure started
- 🔄 Knowledge Base (`app/(app)/knowledge/`) - Basic structure started
- 🔄 Conversations (`app/(app)/conversations/`) - Basic structure started

### Next Pages to Implement (Priority Order)
1. 📍 Discovery Page (`app/(app)/discovery/`)
2. 📍 Landing Page (`app/`)

### Implementation Details

#### UI Components Implemented
- ✅ Card - Standard card with variants
- ✅ Button - Button with different states
- ✅ Form controls (inputs, select, checkbox)
- ✅ Typography components
- ✅ SearchBar - Search input with icon and styling
- ✅ Select - Dropdown select component
- ✅ FilterBar - Combined search and filter component
- ✅ Badge - Status and label indicator

#### Components to Implement with Credit System
1. 📍 CreditBalance - Display for remaining credits
2. 📍 CreditUsageChart - Visualization of credit consumption
3. 📍 AgentCard - Display for agent with credit cost indicator
4. 📍 CreditPurchase - Interface for buying credits

---

## 1. Landing Page

**Purpose:** Convert visitors to signups

**Key Components:**
- **Hero Section**
  - Value proposition headline
  - Subheading explaining AI agent platform
  - Primary CTA button for signup
  - Background with modern design elements

- **Feature Highlights**
  - 3-4 most compelling agent types with icons
  - Brief benefit descriptions
  - Visual examples of agents in action

- **How It Works**
  - 3-step process visualization
  - Simple explanations for each step
  - Supporting imagery

- **Pricing Section**
  - Subscription tiers with features
  - Credit system explanation
  - Free tier/trial offering
  - Enterprise contact option

- **Testimonials/Success Stories**
  - User quotes with photos
  - Results metrics
  - Industry examples

- **Signup CTA**
  - Form or prominent button
  - Trust indicators
  - No-risk messaging

- **Navbar**
  - Logo
  - Primary navigation links
  - Login/Signup buttons

## 2. Home Dashboard Page

**Purpose:** Central hub for users to monitor and access their agents

**Key Components:**
- **Credits Overview Panel**
  - Current balance prominently displayed
  - Visual credit meter
  - "Buy Credits" button
  - Last purchase information

- **Credit Usage Chart**
  - 30-day visualization
  - Daily/weekly toggle
  - Usage breakdown by agent category
  - Trend indicators

- **Subscribed Agents List**
  - Agent cards with:
    - Name and icon
    - Status indicator (active/inactive)
    - Recent usage stats
    - Quick action buttons (run/configure)
    - Credit cost per execution

- **Latest Executions Feed**
  - Timeline of recent activities
  - Agent name and icon
  - Execution timestamp
  - Status indicator (success/failed)
  - Outcome summary
  - Credit cost of each execution

- **Pending Approvals Panel**
  - Request cards for human decisions
  - Priority indicators
  - Time sensitivity markers
  - Quick approve/deny buttons
  - Credit implications of decisions

- **Quick Navigation Cards**
  - Visual links to other platform sections
  - Status indicators where relevant
  - New/updated badges when appropriate

## 3. Discovery Page

**Purpose:** Browse and subscribe to pre-built agents

**Key Components:**
- **Featured Agents Section**
  - Carousel of highlighted agents
  - Special offer indicators
  - Limited-time promotions

- **Category Filters**
  - Visual category selector
  - Content, Social, Email, Admin, etc.
  - Badge showing agent count per category

- **Search & Filter System**
  - Keyword search bar
  - Filters for:
    - Popularity/newest
    - Credit cost range
    - Complexity level
    - Required integrations

- **Agent Cards**
  - Name and visual icon
  - Brief description
  - Category tag
  - Popularity indicator (stars/downloads)
  - Credit cost per execution
  - "Subscribe" button

- **Detailed View Panel**
  - Full description and capabilities
  - Sample inputs/outputs
  - Required credentials
  - Credit usage details
  - User reviews and ratings
  - Related agents recommendations

## 4. Agent Builder Page

**Purpose:** Create custom agents with specific workflows

**Key Components:**
- **Template Selection**
  - Pre-built templates by category
  - Blank canvas option
  - Template preview with complexity indicator
  - Credit usage estimates

- **Workflow Builder**
  - Trigger configuration:
    - Schedule options
    - Event triggers
    - Manual execution settings
  - Action selection interface:
    - Categorized action blocks
    - Configuration panels per action
    - Connection indicators
  - Output format selector:
    - Text, structured data, file options
    - Delivery method settings

- **Knowledge Base Connection**
  - Document selector
  - Relevance settings
  - Permission controls

- **Test Panel**
  - Input field for sample data
  - Run button with credit cost indicator
  - Output preview
  - Execution logs
  - Performance metrics

- **Settings Panel**
  - Agent name and description fields
  - Icon selection
  - Visibility controls
  - Credit allocation limits
  - Access permissions

- **Save & Publish Controls**
  - Save draft button
  - Publish button
  - Version notes field
  - Credit estimation for typical usage

## 5. Conversations Page

**Purpose:** Chat interface to interact with agents

**Key Components:**
- **Agent Selector**
  - Dropdown with agent icons
  - Recent/favorite options
  - Credit cost indicators
  - Status badges

- **Chat Interface**
  - Message history with timestamps
  - User/agent message distinction
  - File attachment support
  - Rich text formatting
  - Code block highlighting
  - Typing indicators
  - Credit cost per message display

- **Context Panel**
  - Active knowledge base display
  - Conversation memory indicators
  - Relevant documentation links
  - Previous conversation snippets
  - Context reset option

- **Approval Requests**
  - In-chat decision requests
  - Supporting information display
  - Approval/deny buttons
  - Comment field
  - Credit implications

- **Conversation Controls**
  - Export options (PDF, text)
  - Clear conversation button
  - Save for future reference
  - Share functionality (if applicable)
  - Credit usage summary

## 6. Knowledge Base Page

**Purpose:** Manage documents that agents can access

**Key Components:**
- **Document Upload Area**
  - Drag-and-drop zone
  - File selector button
  - Supported formats list
  - Credit cost for processing
  - Batch upload capability

- **Documents List**
  - Name and file type
  - Upload/processing date
  - Size information
  - Processing status indicator
  - Usage count by agent
  - Credit cost for storage/processing

- **Agent Assignment Panel**
  - Document-to-agent mapping interface
  - Global/restricted toggle
  - Permission levels
  - Usage statistics

- **Search & Organization**
  - Full-text search
  - Folder/category system
  - Tag-based organization
  - Sort and filter controls
  - Bulk actions menu

- **Document Preview**
  - In-app viewer for common formats
  - Processing quality indicators
  - Edit metadata option
  - Refresh/reprocess button with credit cost

## 7. Settings Page

**Purpose:** Manage account, billing, and platform settings

**Key Components:**
- **Account Section**
  - Profile information fields
  - Email and password management
  - Notification preferences
  - Security settings
  - Account deletion option

- **Subscription Section**
  - Current plan display
  - Benefits list
  - Billing cycle information
  - Payment method management
  - Upgrade options with comparison
  - Cancel/change subscription controls

- **Credits Section**
  - Current balance display
  - Purchase history table
  - Usage breakdown by category
  - Auto-refill configuration
  - Transaction export
  - Purchase credits form

- **Team Section**
  - User management table
  - Invite new members
  - Permission settings
  - Credit allocation controls
  - Activity logs

- **API Section**
  - API key management
  - Usage limits configuration
  - Documentation links
  - Webhook configuration
  - Credit costs for API calls

## Credit System Implementation

Throughout the platform, implement these consistent credit system elements:

### 1. Credit Balance Display
- Consistent top-right indicator in navigation
- Color-coded visual indicator:
  - Green: Healthy balance
  - Yellow: Low balance warning
  - Red: Critical low balance
- Tooltip showing detailed breakdown
- One-click access to purchase more

### 2. Credit Transaction Log
- Comprehensive table with:
  - Timestamp of usage
  - Agent name and operation
  - Credit amount used
  - Running balance
  - Category/label
- Filterable by date range, agent, operation type
- Exportable to CSV/Excel
- Visual graph of consumption patterns

### 3. Credit Purchase Flow
- Simple package options:
  - Small, medium, large bundles
  - Subscription tier-based allocations
  - Custom amount option
- Volume discounts automatically applied
- One-click purchase for saved payment methods
- Receipt/invoice generation
- Special offers and promotional credits
- Gifting options (for team accounts)

### 4. Credit Usage Controls
- Global account limits
- Per-agent allocation limits
- Notification thresholds:
  - Low balance warnings
  - High usage alerts
  - Unusual activity detection
- Auto-pause settings when credits run low
- Priority settings for critical vs. non-critical agents
- Team member allocation and limits (if applicable)

## Mobile Considerations

All pages should be designed with responsive layouts that:

1. **Prioritize Critical Functions**
   - Credit balance always visible
   - Quick approval access
   - Simplified agent monitoring

2. **Adapt Complex Interfaces**
   - Collapsible sections for builder
   - Touch-friendly conversation interface
   - Reduced information density where appropriate

3. **Optimize for On-the-Go Use Cases**
   - Quick approval notifications
   - Status monitoring
   - Basic agent interactions
   - Credit purchase simplified for mobile