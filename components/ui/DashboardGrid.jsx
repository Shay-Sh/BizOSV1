import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/classnames';

/**
 * DashboardGrid component to create a responsive grid layout
 * for dashboard panels with customizable gap and columns.
 */
const DashboardGrid = ({ 
  children, 
  className, 
  gap = 'gap-6',
  cols = {
    default: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}) => {
  // Dynamically generate grid columns class
  const gridColsClass = `grid-cols-${cols.default} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl}`;
  
  return (
    <div className={cn(
      "grid",
      gridColsClass,
      gap,
      className
    )}>
      {children}
    </div>
  );
};

DashboardGrid.propTypes = {
  /** Dashboard panels to render in the grid */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** CSS gap class to apply between grid items (e.g., 'gap-4', 'gap-6') */
  gap: PropTypes.string,
  /** Column configuration for different breakpoints */
  cols: PropTypes.shape({
    default: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  })
};

export default DashboardGrid; 