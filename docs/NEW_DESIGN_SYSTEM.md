# BizOS New Design System

## Overview

This design system defines a clean, modern, and accessible approach for the BizOS platform, inspired by shadcn's component design. It emphasizes readability, minimalism, and a cohesive user experience across both light and dark modes.

## Color System

Our color system uses CSS variables with HSL format for maximum flexibility and dynamic theming capabilities. Values are defined in CSS as custom properties.

### Base Colors

| Variable                | Light Mode                | Dark Mode                 | Usage                    |
|-------------------------|--------------------------|--------------------------|--------------------------:|
| `--background`          | 0 0% 100%                | 240 10% 3.9%             | Page background           |
| `--foreground`          | 240 10% 3.9%             | 0 0% 98%                 | Primary text              |
| `--card`                | 0 0% 100%                | 240 10% 3.9%             | Card background           |
| `--card-foreground`     | 240 10% 3.9%             | 0 0% 98%                 | Card text                 |
| `--popover`             | 0 0% 100%                | 240 10% 3.9%             | Popover background        |
| `--popover-foreground`  | 240 10% 3.9%             | 0 0% 98%                 | Popover text              |
| `--primary`             | 240 5.9% 10%             | 0 0% 98%                 | Primary elements          |
| `--primary-foreground`  | 0 0% 98%                 | 240 5.9% 10%             | Text on primary elements  |
| `--secondary`           | 240 4.8% 95.9%           | 240 3.7% 15.9%           | Secondary elements        |
| `--secondary-foreground`| 240 5.9% 10%             | 0 0% 98%                 | Text on secondary elements|
| `--muted`               | 240 4.8% 95.9%           | 240 3.7% 15.9%           | Muted/subtle backgrounds  |
| `--muted-foreground`    | 240 3.8% 46.1%           | 240 5% 64.9%             | Muted text               |
| `--accent`              | 240 4.8% 95.9%           | 240 3.7% 15.9%           | Accent elements           |
| `--accent-foreground`   | 240 5.9% 10%             | 0 0% 98%                 | Text on accent elements   |
| `--destructive`         | 0 84.2% 60.2%            | 0 62.8% 30.6%            | Destructive actions       |
| `--destructive-foreground` | 0 0% 98%              | 0 0% 98%                 | Text on destructive elements |
| `--border`              | 240 5.9% 90%             | 240 3.7% 15.9%           | Borders                   |
| `--input`               | 240 5.9% 90%             | 240 3.7% 15.9%           | Form input borders        |
| `--ring`                | 240 5% 64.9%             | 240 4.9% 83.9%           | Focus rings               |

### Semantic Colors

| Variable                | Light Mode                | Dark Mode                 | Usage                     |
|-------------------------|--------------------------|--------------------------|--------------------------:|
| `--success`             | 142 76% 36%              | 143 70% 48%              | Success states            |
| `--warning`             | 38 92% 50%               | 48 96% 53%               | Warning states            |
| `--info`                | 221 83% 53%              | 217 91% 60%              | Informational states      |
| `--chart-1`             | 217 91% 60%              | 217 91% 60%              | Primary chart color       |
| `--chart-2`             | 260 80% 60%              | 260 80% 60%              | Secondary chart color     |
| `--chart-3`             | 43 96% 58%               | 43 96% 58%               | Tertiary chart color      |
| `--chart-4`             | 142 72% 50%              | 142 72% 50%              | Quaternary chart color    |
| `--chart-5`             | 339 80% 65%              | 339 80% 65%              | Quinary chart color       |

## Typography

We use a clean, modern sans-serif font stack for optimal readability across devices.

### Font Family

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

### Font Sizes

| Class       | Size (rem)  | Line Height |
|-------------|-------------|------------|
| text-xs     | 0.75rem     | 1rem       |
| text-sm     | 0.875rem    | 1.25rem    |
| text-base   | 1rem        | 1.5rem     |
| text-lg     | 1.125rem    | 1.75rem    |
| text-xl     | 1.25rem     | 1.75rem    |
| text-2xl    | 1.5rem      | 2rem       |
| text-3xl    | 1.875rem    | 2.25rem    |
| text-4xl    | 2.25rem     | 2.5rem     |
| text-5xl    | 3rem        | 1          |

### Font Weights

| Weight     | Value   |
|------------|---------|
| thin       | 100     |
| extralight | 200     |
| light      | 300     |
| normal     | 400     |
| medium     | 500     |
| semibold   | 600     |
| bold       | 700     |
| extrabold  | 800     |
| black      | 900     |

## Spacing

We use a consistent spacing scale based on 4px increments.

| Class        | Size (rem)   | Pixels    |
|--------------|--------------|-----------|
| p-0, m-0     | 0            | 0px       |
| p-1, m-1     | 0.25rem      | 4px       |
| p-2, m-2     | 0.5rem       | 8px       |
| p-3, m-3     | 0.75rem      | 12px      |
| p-4, m-4     | 1rem         | 16px      |
| p-5, m-5     | 1.25rem      | 20px      |
| p-6, m-6     | 1.5rem       | 24px      |
| p-8, m-8     | 2rem         | 32px      |
| p-10, m-10   | 2.5rem       | 40px      |
| p-12, m-12   | 3rem         | 48px      |
| p-16, m-16   | 4rem         | 64px      |

## Border Radius

We use a consistent border radius system for a modern, cohesive look.

```css
--radius: 0.5rem; /* 8px */
```

| Class       | Size                     |
|-------------|--------------------------|
| rounded-sm  | calc(var(--radius) - 4px)|
| rounded-md  | calc(var(--radius) - 2px)|
| rounded-lg  | var(--radius)            |
| rounded-xl  | calc(var(--radius) + 4px)|
| rounded-2xl | calc(var(--radius) + 8px)|
| rounded-full| 9999px                   |

## Shadows

A subtle shadow system that works in both light and dark modes.

| Class         | Light Mode                                            | Dark Mode                                          |
|---------------|-------------------------------------------------------|---------------------------------------------------|
| shadow-sm     | 0 1px 2px 0 rgb(0 0 0 / 0.05)                         | 0 1px 2px 0 rgb(0 0 0 / 0.4)                      |
| shadow        | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) | 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.2) |
| shadow-md     | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.2) |
| shadow-lg     | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.2) |
| shadow-xl     | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.2) |

## Animations

Subtle, performant animations enhance the user experience without being distracting.

```css
--transition-standard: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: 300ms cubic-bezier(0.19, 1, 0.22, 1);
```

| Animation        | Definition                                   | Usage                 |
|------------------|---------------------------------------------|----------------------:|
| animate-in       | fade-in 0.2s ease-out                       | Elements appearing    |
| animate-out      | fade-out 0.2s ease-in                       | Elements disappearing |
| fade-in          | opacity: 0 → 1                              | Fade in effect        |
| fade-out         | opacity: 1 → 0                              | Fade out effect       |
| slide-in-from-top| transform: translateY(-100%) → translateY(0)| Slide in from top     |
| slide-in-from-bottom | transform: translateY(100%) → translateY(0) | Slide in from bottom |
| slide-in-from-left | transform: translateX(-100%) → translateX(0) | Slide in from left   |
| slide-in-from-right | transform: translateX(100%) → translateX(0) | Slide in from right  |

## Components

### Buttons

Buttons have several variants and sizes to indicate different actions and hierarchy.

#### Variants

- **Primary**: Used for main actions - solid background with high visibility
- **Secondary**: Used for secondary actions - more subtle styling
- **Outline**: Button with an outline and transparent background
- **Ghost**: Minimal styling that becomes more prominent on hover
- **Destructive**: For actions that delete or cannot be undone

#### Sizes

- **xs**: Extra small for compact UI areas
- **sm**: Small size for secondary actions
- **md**: Default size for most buttons
- **lg**: Large size for primary CTAs
- **icon**: Square button for icon-only buttons

#### Example

```tsx
<Button variant="primary" size="md">
  Continue
</Button>
```

### Cards

Cards are used to group related content and actions.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Elements

#### Input

```tsx
<Input placeholder="Your email" type="email" />
```

#### Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Navigation

#### Tabs

```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
```

## Dark Mode Implementation

To support both light and dark modes, we use the `next-themes` package for a seamless theme switching experience.

### Setting Up Dark Mode

1. Install `next-themes`:
   ```bash
   npm install next-themes
   ```

2. Create the Theme Provider:
   ```tsx
   // components/theme-provider.tsx
   "use client"
   
   import * as React from "react"
   import { ThemeProvider as NextThemesProvider } from "next-themes"
   
   export function ThemeProvider({
     children,
     ...props
   }: React.ComponentProps<typeof NextThemesProvider>) {
     return <NextThemesProvider {...props}>{children}</NextThemesProvider>
   }
   ```

3. Wrap the root layout:
   ```tsx
   // app/layout.tsx
   import { ThemeProvider } from "@/components/theme-provider"
   
   export default function RootLayout({ children }: RootLayoutProps) {
     return (
       <html lang="en" suppressHydrationWarning>
         <body>
           <ThemeProvider
             attribute="class"
             defaultTheme="system"
             enableSystem
             disableTransitionOnChange
           >
             {children}
           </ThemeProvider>
         </body>
       </html>
     )
   }
   ```

4. Create a Theme Toggle component:
   ```tsx
   // components/theme-toggle.tsx
   "use client"
   
   import * as React from "react"
   import { Moon, Sun } from "lucide-react"
   import { useTheme } from "next-themes"
   
   import { Button } from "@/components/ui/button"
   import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
   } from "@/components/ui/dropdown-menu"
   
   export function ThemeToggle() {
     const { setTheme } = useTheme()
   
     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="icon">
             <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             <span className="sr-only">Toggle theme</span>
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
           <DropdownMenuItem onClick={() => setTheme("light")}>
             Light
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("dark")}>
             Dark
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("system")}>
             System
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
     )
   }
   ```

5. Place the ThemeToggle component in your header/navigation:
   ```tsx
   import { ThemeToggle } from "@/components/theme-toggle"
   
   export function Header() {
     return (
       <header className="flex items-center justify-between p-4 border-b">
         <Logo />
         <nav>
           {/* navigation links */}
           <ThemeToggle />
         </nav>
       </header>
     )
   }
   ```

## Accessibility Guidelines

1. **Color Contrast**: Ensure all text and interactive elements meet WCAG 2.1 AA standard (4.5:1 for normal text, 3:1 for large text)
2. **Keyboard Navigation**: All interactive elements must be accessible via keyboard
3. **Focus Indicators**: Visible focus states for all interactive elements
4. **Screen Reader Support**: Proper ARIA attributes and semantic HTML
5. **Reduced Motion**: Respect user preferences for reduced motion
6. **Text Sizing**: Allow text to be resized up to 200% without loss of content or functionality

## Migration Path

To transition from the current glassmorphism design to this new clean design system:

1. Update the Tailwind configuration to include the new color system
2. Implement the ThemeProvider for dark mode support
3. Gradually refactor components to use the new design system
4. Update the global CSS variables
5. Replace custom glass components with the new component library

## Implementation Notes

- Maintain a component-first approach where each UI element is a reusable component
- Use CSS variables for theming to make it easy to switch between light and dark modes
- Follow a "mobile-first" responsive design approach
- Keep accessibility at the forefront of all design decisions 