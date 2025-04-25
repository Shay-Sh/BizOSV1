import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassButton component with glassmorphism styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'accent', 'ghost')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {function} props.onClick - Click handler function
 * @param {string} props.type - Button type attribute
 * @param {boolean} props.disabled - Whether button is disabled
 * @returns {JSX.Element} Rendered component
 */
const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false
}) => {
  // Base styles for all glass buttons
  const baseStyles = 'flex items-center justify-center rounded-lg border transition-all duration-200 backdrop-blur-md font-medium';
  
  // Size variations
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary/20 hover:bg-primary/30 border-primary/30 text-primary-foreground',
    secondary: 'bg-secondary/20 hover:bg-secondary/30 border-secondary/30 text-secondary-foreground',
    accent: 'bg-accent/20 hover:bg-accent/30 border-accent/30 text-accent-foreground',
    ghost: 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
  };
  
  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg active:scale-[0.98]'}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

GlassButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool
};

export default GlassButton; 