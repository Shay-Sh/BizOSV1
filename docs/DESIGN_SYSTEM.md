# BizOS Design System

## Glassmorphism Style Guide

### Core Principles

1. **Transparency with Blur**: UI elements have transparent backgrounds with blur effects
2. **Light Borders**: Subtle white/light borders (1px) to define element boundaries
3. **Depth through Layering**: Multiple translucent elements create depth perception
4. **Colorful Gradients**: Vibrant background gradients beneath frosted UI elements
5. **Minimalism**: Clean typography and ample white space

### Implementation Details

#### CSS Properties
```css
/* Basic glassmorphism element */
.glass-element {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### TailwindCSS Classes
```
bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg
```

### Component Hierarchy

1. **Background Layer**: Gradient or image background
2. **Container Layer**: Glass panels containing UI elements
3. **Interactive Elements**: Buttons, inputs, cards with increased opacity

### Color Palette

- **Backgrounds**: Vibrant gradients (purples, blues, teals)
- **UI Elements**: White/light with transparency (rgba)
- **Text**: High contrast for readability
- **Accents**: Bright, saturated colors for highlights and important elements

### Typography

- **Font Family**: Sans-serif, modern (Inter, Poppins)
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)
- **Sizes**: Follow a clear hierarchy (heading, subheading, body, caption)

### Spacing System

- Base unit: 4px
- Components follow 8px, 16px, 24px, 32px, 48px spacing

### Interactive States

- **Hover**: Slight increase in opacity and brightness
- **Active/Pressed**: Subtle inset shadow and decreased opacity
- **Focus**: Light glow effect or border highlight

### Accessibility Considerations

- Ensure sufficient contrast between text and backgrounds
- Provide alternative styling for users with reduced motion preferences
- Test with screen readers and keyboard navigation

### Example Components

- GlassCard: Container for content sections
- GlassButton: Interactive buttons with glass effect
- GlassInput: Form elements with glassmorphism styling
- GlassNavigation: Navigation elements with glass styling 