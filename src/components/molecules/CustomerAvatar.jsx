import React from 'react';
import PropTypes from 'prop-types';

const CustomerAvatar = ({ name, className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
  };

  return (
    <div className={`bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <span className="font-medium text-white">
        {name?.charAt(0) || 'C'}
      </span>
    </div>
  );
};

CustomerAvatar.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default CustomerAvatar;