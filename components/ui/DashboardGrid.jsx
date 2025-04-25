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
  gap = 'gap-6'
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
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
  gap: PropTypes.string
};

export default DashboardGrid; 