import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import apiKeyService from '../services/api/apiKeyService'

function Developers() {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('test')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [creatingKey, setCreatingKey] = useState(false)

  useEffect(() => {
    const loadApiKeys = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiKeyService.getAll()
        setApiKeys(result)
      } catch (err) {
        setError(err.message || 'Failed to load API keys')
        toast.error('Failed to load API keys')
      } finally {
        setLoading(false)
      }
    }
    loadApiKeys()
  }, [])

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    setCreatingKey(true)
    try {
      const newKey = await apiKeyService.create({
        name: newKeyName,
        mode: mode
      })
      setApiKeys(prev => [...prev, newKey])
      setNewKeyName('')
      setShowCreateModal(false)
      toast.success('API key created successfully')
    } catch (err) {
      toast.error('Failed to create API key')
    } finally {
      setCreatingKey(false)
    }
  }

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    try {
      await apiKeyService.delete(keyId)
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      toast.success('API key deleted successfully')
    } catch (err) {
      toast.error('Failed to delete API key')
    }
  }

  const maskKey = (key) => {
    return `${key.substring(0, 7)}${'•'.repeat(20)}${key.substring(key.length - 4)}`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const filteredKeys = apiKeys.filter(key => key.mode === mode)

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary mb-2">Failed to load API keys</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Developers</h1>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:items-center justify-between mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('test')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'test'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Test Mode
            </button>
            <button
              onClick={() => setMode('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'live'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Live Mode
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Create API Key</span>
          </button>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <ApperIcon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-secondary">
                {mode === 'test' ? 'Test Mode' : 'Live Mode'} API Keys
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {mode === 'test' 
                  ? 'Test keys are safe for development and testing. No real charges will be made.'
                  : 'Live keys will process real payments. Keep them secure and never share them publicly.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {filteredKeys.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Key" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-secondary">No {mode} API keys</h3>
          <p className="mt-2 text-gray-500">
            Create your first {mode} API key to start integrating with PayFlow Pro
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Create {mode} API Key
          </motion.button>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-secondary">
              {mode === 'test' ? 'Test' : 'Live'} API Keys
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredKeys.map((apiKey, index) => (
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
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <ApperIcon name="Copy" size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mt-2">
                      Created {new Date(apiKey.created).toLocaleDateString()} • 
                      Last used {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Delete API key"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* API Documentation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-secondary">Quick Start</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-secondary mb-2">Authentication</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="text-sm text-secondary">
                  curl https://api.payflowpro.com/v1/payments \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer sk_test_..." \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json"
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-secondary mb-2">Create Payment</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="text-sm text-secondary">
                  curl https://api.payflowpro.com/v1/payments \<br />
                  &nbsp;&nbsp;-X POST \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer sk_test_..." \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '{"{"}amount": 2000, "currency": "usd"{"}"}'
                </code>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                View Full Documentation
              </button>
              <button className="text-gray-600 hover:text-secondary text-sm font-medium transition-colors">
                Download SDKs
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary">Create API Key</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setMode('test')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                        mode === 'test'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Test
                    </button>
                    <button
                      onClick={() => setMode('live')}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                        mode === 'live'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Live
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={creatingKey || !newKeyName.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingKey ? 'Creating...' : 'Create Key'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Developers