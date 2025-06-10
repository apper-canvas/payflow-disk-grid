import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const ApiKeyCreationForm = ({ onCreateKey, onCancel, creatingKey, initialMode }) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [mode, setMode] = useState(initialMode);

  const handleSubmit = () => {
    onCreateKey(newKeyName, mode);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-2">
          Key Name
        </label>
        <Input
          id="keyName"
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="e.g., Production API Key"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mode
        </label>
        <div className="flex space-x-2">
          <Button
            onClick={() => setMode('test')}
            className={`flex-1 text-sm ${
              mode === 'test'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Test
          </Button>
          <Button
            onClick={() => setMode('live')}
            className={`flex-1 text-sm ${
              mode === 'live'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Live
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <Button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={creatingKey || !newKeyName.trim()}
          className="flex-1 bg-primary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingKey ? 'Creating...' : 'Create Key'}
        </Button>
      </div>
    </div>
  );
};

ApiKeyCreationForm.propTypes = {
  onCreateKey: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  creatingKey: PropTypes.bool.isRequired,
  initialMode: PropTypes.oneOf(['test', 'live']),
};

ApiKeyCreationForm.defaultProps = {
  initialMode: 'test',
};

export default ApiKeyCreationForm;