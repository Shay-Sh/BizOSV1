import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/classnames';

/**
 * GlassPanel component for creating frosted glass-like UI panels
 * with customizable headers and content.
 */
const GlassPanel = ({ 
  children, 
  className, 
  title, 
  headerRight, 
  nopadding = false
}) => {
  return (
    <div className={cn(
      "rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg",
      className
    )}>
      {title && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-medium text-white">{title}</h3>
          {headerRight && (
            <div className="flex items-center">
              {headerRight}
            </div>
          )}
        </div>
      )}
      <div className={cn(!nopadding && "p-0")}>
        {children}
      </div>
    </div>
  );
};

GlassPanel.propTypes = {
  /** Content to be displayed inside the panel */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Panel title displayed in the header */
  title: PropTypes.string,
  /** Elements to be shown on the right side of the header */
  headerRight: PropTypes.node,
  /** When true, removes default padding from content area */
  nopadding: PropTypes.bool
};

export default GlassPanel; 