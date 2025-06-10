import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import CodeSnippet from '@/components/molecules/CodeSnippet';

const ApiKeyListings = ({ apiKeys, mode, onDeleteKey, onNewKeyClick }) => {
  const maskKey = (key) => {
    return `${key.substring(0, 7)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      {apiKeys.length === 0 ? (
        <EmptyState
          icon="Key"
          title={`No ${mode} API keys`}
          message={`Create your first ${mode} API key to start integrating with PayFlow Pro`}
          actionButtonText={`Create ${mode} API Key`}
          onActionButtonClick={onNewKeyClick}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary">
              {mode === 'test' ? 'Test' : 'Live'} API Keys
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {apiKeys.map((apiKey, index) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-secondary">{apiKey.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.mode === 'test'
                          ? 'text-info bg-info/10'
                          : 'text-success bg-success/10'
                      }`}>
                        {apiKey.mode}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <CodeSnippet code={maskKey(apiKey.key)} className="inline-block py-1 px-2 !bg-gray-100" />
                      <Button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400"
                        title="Copy to clipboard"
                      >
                        <ApperIcon name="Copy" size={16} />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-2">
                      Created {new Date(apiKey.created).toLocaleDateString()} • 
                      Last used {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => onDeleteKey(apiKey.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg"
                      title="Delete API key"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

ApiKeyListings.propTypes = {
  apiKeys: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['test', 'live']).isRequired,
  onDeleteKey: PropTypes.func.isRequired,
  onNewKeyClick: PropTypes.func.isRequired,
};

export default ApiKeyListings;