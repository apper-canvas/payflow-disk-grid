import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const InfoAlert = ({ title, message, icon = 'Info', className = '' }) => {
  return (
    <div className={`bg-warning/10 border border-warning/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <ApperIcon name={icon} size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-secondary">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

InfoAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.string,
  className: PropTypes.string,
};

export default InfoAlert;