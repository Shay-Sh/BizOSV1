# BizOS UI Examples

This directory contains various examples of UI components and patterns used in the BizOS application. These examples serve as both documentation and functional demonstrations of how to use the components effectively.

## Available Examples

### Navigation Example

Located at: `/examples/navigation-example`

This example demonstrates the integration of SideNav, TopNav, and UserProfileMenu components to create a complete application layout with navigation. Features include:

- Responsive sidebar navigation with collapse toggle
- Active navigation states with badges
- Search functionality in the top navbar
- Notification indicator
- User profile menu with settings and sign out options
- Theme-aware styling with dark mode support

### Credit System

Located at: `/examples/credit-system`

This example showcases the credit management system components, including:

- Credit balance display
- Usage history tracking
- Low balance warnings
- Purchase flow

## Adding New Examples

When adding new examples:

1. Create a new directory under `/app/examples/`
2. Use the Next.js app router pattern with a `page.tsx` file
3. Make the component self-contained with mock data
4. Add clear descriptions and usage instructions
5. Update this README with details about your example

## Best Practices

- Use the `'use client'` directive for interactive components
- Include mock data to demonstrate the component in action
- Demonstrate both default and edge cases
- Add proper commenting to explain key functionality
- Make sure examples are responsive and accessible
- Test with both light and dark themes 