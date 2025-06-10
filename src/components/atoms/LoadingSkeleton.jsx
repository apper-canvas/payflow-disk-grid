import React from 'react';
import PropTypes from 'prop-types';

const LoadingSkeleton = ({ className = '', children }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
};

LoadingSkeleton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default LoadingSkeleton;