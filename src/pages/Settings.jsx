import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

function Settings() {
  const [activeTab, setActiveTab] = useState('account')
  const [accountData, setAccountData] = useState({
    businessName: 'PayFlow Pro',
    email: 'admin@payflowpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, San Francisco, CA 94102',
    website: 'https://payflowpro.com'
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
    failedPaymentAlerts: true
  })
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'billing', label: 'Billing', icon: 'CreditCard' }
  ]

  const handleSaveAccount = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Account settings updated successfully')
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success('Notification settings updated successfully')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={accountData.businessName}
                    onChange={(e) => setAccountData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={accountData.website}
                    onChange={(e) => setAccountData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  value={accountData.address}
                  onChange={(e) => setAccountData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveAccount}
                disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )

      case 'notifications':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        emailNotifications: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        smsNotifications: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">Payment Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified for every successful payment</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        paymentAlerts: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">Failed Payment Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when payments fail</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.failedPaymentAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        failedPaymentAlerts: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly payment summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        weeklyReports: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <h4 className="font-medium text-secondary">Monthly Reports</h4>
                    <p className="text-sm text-gray-600">Receive monthly payment summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={(e) => setNotificationSettings(prev => ({ 
                        ...prev, 
                        monthlyReports: e.target.checked 
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotifications}
                disabled={saving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )

      case 'security':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Change Password</h4>
                    <ApperIcon name="Lock" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Update your password to keep your account secure
                  </p>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all">
                    Change Password
                  </button>
                </div>

                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Two-Factor Authentication</h4>
                    <ApperIcon name="Smartphone" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Active Sessions</h4>
                    <ApperIcon name="Monitor" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage devices that are currently logged into your account
                  </p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'billing':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-secondary mb-4">Billing Information</h3>
              <div className="space-y-4">
                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Current Plan</h4>
                    <span className="px-2.5 py-0.5 bg-success/10 text-success rounded-full text-sm font-medium">
                      Professional
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    $99/month • Next billing date: March 15, 2024
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all">
                      Upgrade Plan
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View Usage
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Payment Method</h4>
                    <ApperIcon name="CreditCard" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Visa •••• 4242 • Expires 12/25
                  </p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Update Payment Method
                  </button>
                </div>

                <div className="p-4 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-secondary">Billing History</h4>
                    <ApperIcon name="Receipt" size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    View and download your past invoices
                  </p>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Invoices
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-surface hover:text-secondary'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings