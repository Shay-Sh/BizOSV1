import React from 'react';
import PropTypes from 'prop-types';

/**
 * GlassCard component with glassmorphism styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Card variant ('default', 'elevated', 'bordered')
 * @param {boolean} props.hoverable - Whether card should have hover effects
 * @returns {JSX.Element} Rendered component
 */
const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false
}) => {
  // Base styles for all glass cards
  const baseStyles = 'rounded-xl backdrop-blur-md shadow-sm transition-all duration-200 overflow-hidden';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-white/10 border border-white/20',
    elevated: 'bg-white/15 border border-white/25 shadow-lg',
    bordered: 'bg-white/5 border-2 border-white/30'
  };
  
  // Combine all styles
  const cardClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${hoverable ? 'hover:shadow-lg hover:bg-white/20 hover:-translate-y-1' : ''}
    ${className}
  `;
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered']),
  hoverable: PropTypes.bool
};

export default GlassCard; 