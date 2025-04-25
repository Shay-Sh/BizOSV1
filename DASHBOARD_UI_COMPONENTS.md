# Dashboard UI Components

This document outlines the core UI components we'll implement for the BizOS dashboard, using the Glassmorphism design approach.

## Base Components

### Glass Card
A versatile container with frosted glass effect that serves as the foundation for many UI elements.

```jsx
// Example implementation
const GlassCard = ({ children, className, ...props }) => {
  return (
    <div 
      className={`
        bg-white/15 backdrop-blur-md 
        border border-white/20 
        rounded-lg shadow-glass 
        p-4 
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};
```

**Variants:**
- Primary: Higher opacity (80-90%)
- Secondary: Medium opacity (60-70%)
- Tertiary: Light opacity (40-50%)

### Glass Button
Interactive button elements with hover and active states that enhance the frosted glass effect.

```jsx
// Example implementation
const GlassButton = ({ children, variant = "primary", className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md backdrop-blur-sm border border-white/20 transition-all duration-200";
  
  const variants = {
    primary: "bg-blue-500/70 hover:bg-blue-500/80 text-white shadow-lg",
    secondary: "bg-white/20 hover:bg-white/30 text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white",
  };
  
  return (
    <button 
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${className}
      `} 
      {...props}
    >
      {children}
    </button>
  );
};
```

### Glass Input
Form input fields with translucent backgrounds and subtle borders.

```jsx
// Example implementation
const GlassInput = ({ label, className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-white/90 mb-2 text-sm">{label}</label>}
      <input
        className={`
          w-full px-4 py-2
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-md
          text-white placeholder-white/50
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          transition-all duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
```

### Glass Select
Dropdown select elements with custom styling to maintain the frosted glass appearance.

```jsx
// Example implementation
const GlassSelect = ({ label, options = [], className, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-white/90 mb-2 text-sm">{label}</label>}
      <select
        className={`
          w-full px-4 py-2
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-md
          text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          transition-all duration-200
          appearance-none
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          {/* Custom dropdown icon */}
        </div>
      </div>
    </div>
  );
};
```

### Glass Tab
Navigation tabs with active state indicators.

```jsx
// Example implementation
const GlassTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-1 p-1 bg-white/5 backdrop-blur-sm rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            px-4 py-2 rounded-md transition-all duration-200
            ${activeTab === tab.id
              ? "bg-white/20 backdrop-blur-md border border-white/20 shadow-glass-inner"
              : "bg-transparent hover:bg-white/10"}
          `}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
```

## Composite Components

### Stat Card
A specialized card for displaying key metrics with icon and trend indicator.

```jsx
// Example implementation
const StatCard = ({ title, value, icon, trend, trendValue, className }) => {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-blue-400",
  };
  
  return (
    <GlassCard className={`${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
          <p className="text-white text-2xl font-semibold">{value}</p>
          
          {trend && (
            <div className={`flex items-center mt-2 ${trendColors[trend]}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
              <span className="ml-1 text-sm">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="p-2 bg-gradient-to-br from-white/20 to-white/5 rounded-lg">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
};
```

### Activity Card
Card displaying recent activity with timestamp, icon, and description.

```jsx
// Example implementation
const ActivityItem = ({ time, title, description, icon, className }) => {
  return (
    <div className={`flex items-start mb-4 ${className}`}>
      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg mr-3">
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="text-white font-medium">{title}</h4>
          <span className="text-white/50 text-xs">{time}</span>
        </div>
        <p className="text-white/70 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

const ActivityList = ({ activities }) => {
  return (
    <GlassCard>
      <h3 className="text-white text-lg font-medium mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            time={activity.time}
            title={activity.title}
            description={activity.description}
            icon={activity.icon}
          />
        ))}
      </div>
    </GlassCard>
  );
};
```

### Agent Card
Card for displaying an agent with status, actions, and quick metrics.

```jsx
// Example implementation
const AgentCard = ({ agent, onSelect, className }) => {
  // Status indicator colors
  const statusColors = {
    active: "bg-green-400",
    inactive: "bg-gray-400",
    error: "bg-red-400",
  };
  
  return (
    <GlassCard 
      className={`cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${className}`}
      onClick={() => onSelect(agent)}
    >
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]} mr-2`}></div>
          <h3 className="text-white font-medium">{agent.name}</h3>
        </div>
        
        <div className="flex space-x-1">
          {/* Action buttons */}
          <button className="p-1 hover:bg-white/10 rounded">
            {/* Edit icon */}
          </button>
          <button className="p-1 hover:bg-white/10 rounded">
            {/* More options */}
          </button>
        </div>
      </div>
      
      <p className="text-white/70 text-sm mb-4 line-clamp-2">{agent.description}</p>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 backdrop-blur-sm p-2 rounded">
          <div className="text-white/60 text-xs">Executions</div>
          <div className="text-white font-medium">{agent.metrics.executions}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm p-2 rounded">
          <div className="text-white/60 text-xs">Success Rate</div>
          <div className="text-white font-medium">{agent.metrics.successRate}%</div>
        </div>
      </div>
    </GlassCard>
  );
};
```

### Chart Card
Card containing data visualization with glassmorphism styling.

```jsx
// Example implementation
const ChartCard = ({ title, description, children, className }) => {
  return (
    <GlassCard className={className}>
      <div className="mb-4">
        <h3 className="text-white text-lg font-medium">{title}</h3>
        {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
      </div>
      
      <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-lg p-4">
        {children} {/* Chart component goes here */}
      </div>
    </GlassCard>
  );
};
```

## Layout Components

### SideNav
Main navigation sidebar with frosted glass effect.

```jsx
// Example implementation
const SideNav = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="
      w-64 h-screen fixed left-0 top-0
      bg-white/10 backdrop-blur-xl
      border-r border-white/10
      p-4
    ">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">BizOS</h1>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className={`
                  w-full px-4 py-2 rounded-md
                  flex items-center
                  transition-all duration-200
                  ${activeItem === item.id
                    ? "bg-white/20 text-white shadow-glass-inner"
                    : "text-white/70 hover:bg-white/10 hover:text-white"}
                `}
                onClick={() => onItemClick(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
```

### TopBar
Top navigation bar with actions, search, and user profile.

```jsx
// Example implementation
const TopBar = ({ user, onProfileClick, onNotificationsClick }) => {
  return (
    <div className="
      h-16 fixed top-0 right-0 left-64
      bg-white/5 backdrop-blur-md
      border-b border-white/10
      px-6
      flex items-center justify-between
    ">
      <div className="flex-1 max-w-xl">
        <div className="
          relative bg-white/5 
          border border-white/10 
          rounded-md 
          overflow-hidden
        ">
          <input 
            type="text" 
            placeholder="Search..." 
            className="
              w-full px-4 py-2 
              bg-transparent 
              text-white placeholder-white/50
              focus:outline-none
            "
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {/* Search icon */}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 rounded-md bg-white/5 hover:bg-white/10"
          onClick={onNotificationsClick}
        >
          {/* Notification icon */}
        </button>
        
        <button 
          className="flex items-center space-x-2"
          onClick={onProfileClick}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border border-white/20">
            {/* User avatar or initials */}
          </div>
          <span className="text-white">{user.name}</span>
        </button>
      </div>
    </div>
  );
};
```

### PageContainer
Main content container with proper spacing and gradient background.

```jsx
// Example implementation
const PageContainer = ({ children, className }) => {
  return (
    <div className={`
      min-h-screen pt-16 pl-64
      bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800
      ${className}
    `}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
```

## Implementation Approach

1. Create a core set of base components with the Glassmorphism styling
2. Build composite components using the base components
3. Implement layout components for consistent page structure
4. Ensure responsive behavior for all components
5. Add animations and transitions to enhance the user experience

## Performance Considerations

- Use GPU acceleration for smoother glass effects
- Implement virtualized lists for data-heavy components
- Optimize backdrop-filter usage by limiting overlapping elements
- Use React.memo and useMemo for expensive components
- Consider reduced motion options for accessibility

## Accessibility

- Test all components with screen readers
- Ensure keyboard navigation works properly
- Add appropriate ARIA attributes
- Maintain sufficient contrast ratios despite transparency
- Provide focus indicators that work with the glass aesthetic 