import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  filterValue,
  onFilterChange,
  filterOptions,
  actionButtonText,
  onActionButtonClick,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6 ${className}`}>
      <div className="flex-1 relative">
        <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
          className="pl-10 pr-4 py-2"
        />
      </div>

      {filterOptions && (
        <Select
          value={filterValue}
          onChange={onFilterChange}
          className="px-4 py-2"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}

      {actionButtonText && onActionButtonClick && (
        <Button
          onClick={onActionButtonClick}
          className="bg-primary text-white hover:brightness-110 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>{actionButtonText}</span>
        </Button>
      )}
    </div>
  );
};

SearchFilterBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  filterValue: PropTypes.string,
  onFilterChange: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  actionButtonText: PropTypes.string,
  onActionButtonClick: PropTypes.func,
  className: PropTypes.string,
};

export default SearchFilterBar;