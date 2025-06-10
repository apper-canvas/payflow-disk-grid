import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ icon, title, message, actionButtonText, onActionButtonClick, className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-medium text-secondary">{title}</h3>
      <p className="mt-2 text-gray-500">{message}</p>
      {actionButtonText && onActionButtonClick && (
        <Button
          onClick={onActionButtonClick}
          className="mt-4 bg-primary text-white hover:brightness-110"
        >
          {actionButtonText}
        </Button>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  actionButtonText: PropTypes.string,
  onActionButtonClick: PropTypes.func,
  className: PropTypes.string,
};

export default EmptyState;