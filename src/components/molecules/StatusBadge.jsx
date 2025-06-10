import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'failed': return 'text-error bg-error/10';
      case 'refunded': return 'text-info bg-info/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default StatusBadge;