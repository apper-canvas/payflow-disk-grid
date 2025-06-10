import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import InfoAlert from '@/components/molecules/InfoAlert';
import Modal from '@/components/molecules/Modal';
import ApiKeyListings from '@/components/organisms/ApiKeyListings';
import ApiKeyCreationForm from '@/components/organisms/ApiKeyCreationForm';
import ApiQuickStartDocs from '@/components/organisms/ApiQuickStartDocs';
import LoadingSkeleton from '@/components/atoms/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import apiKeyService from '@/services/api/apiKeyService';

const DevelopersPage = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('test');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);

  const loadApiKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiKeyService.getAll();
      setApiKeys(result);
    } catch (err) {
      setError(err.message || 'Failed to load API keys');
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const handleCreateKey = async (name, keyMode) => {
    if (!name.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    setCreatingKey(true);
    try {
      const newKey = await apiKeyService.create({ name, mode: keyMode });
      setApiKeys(prev => [...prev, newKey]);
      setShowCreateModal(false);
      toast.success('API key created successfully');
    } catch (err) {
      toast.error('Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiKeyService.delete(keyId);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success('API key deleted successfully');
    } catch (err) {
      toast.error('Failed to delete API key');
    }
  };

  const filteredKeys = apiKeys.filter(key => key.mode === mode);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton className="mb-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </LoadingSkeleton>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <LoadingSkeleton className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </LoadingSkeleton>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadApiKeys}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Developers</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:items-center justify-between mb-6">
          <div className="flex space-x-2">
            <Button
              onClick={() => setMode('test')}
              className={`text-sm font-medium ${
                mode === 'test' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Test Mode
            </Button>
            <Button
              onClick={() => setMode('live')}
              className={`text-sm font-medium ${
                mode === 'live' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Live Mode
            </Button>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white hover:brightness-110 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Create API Key</span>
          </Button>
        </div>

        <InfoAlert
          title={`${mode === 'test' ? 'Test Mode' : 'Live Mode'} API Keys`}
          message={
            mode === 'test'
              ? 'Test keys are safe for development and testing. No real charges will be made.'
              : 'Live keys will process real payments. Keep them secure and never share them publicly.'
          }
          icon="AlertTriangle"
        />
      </div>

      <ApiKeyListings
        apiKeys={filteredKeys}
        mode={mode}
        onDeleteKey={handleDeleteKey}
        onNewKeyClick={() => setShowCreateModal(true)}
      />

      <ApiQuickStartDocs />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create API Key"
        className="max-w-md w-full"
      >
        <ApiKeyCreationForm
          onCreateKey={(name, keyMode) => handleCreateKey(name, keyMode)}
          onCancel={() => setShowCreateModal(false)}
          creatingKey={creatingKey}
          initialMode={mode}
        />
      </Modal>
    </div>
  );
};

export default DevelopersPage;