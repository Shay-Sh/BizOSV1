import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassContainer component with glassmorphism styling for larger sections
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Container variant ('default', 'solid', 'bordered')
 * @param {boolean} props.noPadding - Whether to remove padding
 * @param {string} props.id - HTML id attribute
 * @returns {JSX.Element} Rendered component
 */
const GlassContainer = ({ 
  children, 
  className = '', 
  variant = 'default',
  noPadding = false,
  id
}) => {
  // Base styles for glass container
  const baseStyles = 'rounded-2xl backdrop-blur-lg transition-all duration-300 overflow-hidden';
  
  // Padding styles
  const paddingStyles = noPadding ? '' : 'p-6';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-white/10 border border-white/20 shadow-lg',
    solid: 'bg-white/20 border border-white/30 shadow-xl',
    bordered: 'bg-white/5 border-2 border-white/20'
  };
  
  // Combine all styles
  const containerClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${paddingStyles}
    ${className}
  `;
  
  return (
    <div className={containerClasses} id={id}>
      {children}
    </div>
  );
};

GlassContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'solid', 'bordered']),
  noPadding: PropTypes.bool,
  id: PropTypes.string
};

export default GlassContainer; 