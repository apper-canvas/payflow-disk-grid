import React from 'react';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';

const SettingItem = ({ title, description, icon, children, className = '' }) => {
  return (
    <div className={`p-4 bg-surface rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-secondary">{title}</h4>
        {icon && <ApperIcon name={icon} size={20} className="text-gray-400" />}
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
};

SettingItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SettingItem;