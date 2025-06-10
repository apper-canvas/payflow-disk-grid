import React from 'react';
import PropTypes from 'prop-types';

const CodeSnippet = ({ code, className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 overflow-x-auto ${className}`}>
      <code className="text-sm text-secondary whitespace-pre-wrap">
        {code}
      </code>
    </div>
  );
};

CodeSnippet.propTypes = {
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CodeSnippet;