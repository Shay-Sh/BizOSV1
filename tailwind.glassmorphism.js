/**
 * Tailwind CSS configuration extension for Glassmorphism effects
 * This file contains custom utilities and theme extensions for implementing
 * frosted glass UI elements with consistent styling
 */

module.exports = {
  theme: {
    extend: {
      // Enhanced backdrop blur options
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '10px',
        'lg': '15px',
        'xl': '20px',
      },
      
      // Special box shadows for glass effects
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-sm': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.15)',
        'glass-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        'glass-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      
      // Border colors for glass elements
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
        'glass-darker': 'rgba(255, 255, 255, 0.05)',
      },
      
      // Background colors with transparency
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.15)',
        'glass-light': 'rgba(255, 255, 255, 0.25)',
        'glass-dark': 'rgba(17, 25, 40, 0.75)',
        'glass-darker': 'rgba(0, 0, 0, 0.2)',
      },
      
      // Gradient colors for backgrounds
      gradientColorStops: {
        'blue-glass': '#4158D0',
        'purple-glass': '#C850C0',
        'teal-glass': '#4DA0B0',
        'indigo-glass': '#3A1C71',
        'violet-glass': '#8E2DE2',
        'rose-glass': '#FFAFBD',
        'amber-glass': '#F7971E',
      },
      
      // Special color for text on glass
      textColor: {
        'on-glass': 'rgba(255, 255, 255, 0.9)',
        'on-glass-medium': 'rgba(255, 255, 255, 0.7)',
        'on-glass-dim': 'rgba(255, 255, 255, 0.5)',
      },
      
      // Ring colors for focus states
      ringColor: {
        'glass': 'rgba(255, 255, 255, 0.3)',
      },
    }
  },
  
  // Custom utilities for common glass effects
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        // Basic glass panel
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        
        // Darker glass panel variant
        '.glass-dark': {
          backgroundColor: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
        
        // Elevated glass panel
        '.glass-elevated': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(15px)',
          '-webkit-backdrop-filter': 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '0.5rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        },
        
        // Glass input field
        '.glass-input': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '0.375rem',
          color: 'rgba(255, 255, 255, 0.9)',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        },
        
        // Glass button
        '.glass-button': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.375rem',
          color: 'rgba(255, 255, 255, 0.9)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-1px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          },
        },
        
        // Glass primary button
        '.glass-button-primary': {
          backgroundColor: 'rgba(79, 70, 229, 0.8)',
          backdropFilter: 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.375rem',
          color: 'rgba(255, 255, 255, 1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(79, 70, 229, 0.9)',
            transform: 'translateY(-1px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(67, 56, 202, 0.8)',
          },
        },
        
        // Background with beautiful gradient
        '.glass-bg-gradient': {
          background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        },
        
        // Alternate gradient background
        '.glass-bg-gradient-alt': {
          background: 'linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)',
        },
        
        // Cool gradient background
        '.glass-bg-gradient-cool': {
          background: 'linear-gradient(135deg, #4DA0B0 0%, #D39D38 100%)',
        },
        
        // Vibrant gradient background
        '.glass-bg-gradient-vibrant': {
          background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
        },
        
        // Light reflection effect for top edge
        '.glass-reflection': {
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
            zIndex: '1',
          },
        },
      };
      
      addUtilities(newUtilities, ['responsive', 'hover', 'focus']);
    }
  ]
}; 