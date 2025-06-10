import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';

const PaginationControls = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, className = '' }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-500">
        Showing {startIndex + 1} to {endIndex} of {totalItems} results
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-1"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default PaginationControls;