import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center ${className}`}>
      <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
      <h3 className="text-lg font-medium text-secondary mb-2">Failed to load data</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <Button
        onClick={onRetry}
        className="bg-primary text-white hover:brightness-110"
      >
        Retry
      </Button>
    </div>
  );
};

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ErrorState;