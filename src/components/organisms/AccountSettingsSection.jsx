import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const AccountSettingsSection = () => {
  const [accountData, setAccountData] = useState({
    businessName: 'PayFlow Pro',
    email: 'admin@payflowpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, San Francisco, CA 94102',
    website: 'https://payflowpro.com'
  });
  const [saving, setSaving] = useState(false);

  const handleSaveAccount = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Account settings updated successfully');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

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
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <Input
              id="businessName"
              name="businessName"
              value={accountData.businessName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={accountData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={accountData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <Input
              id="website"
              name="website"
              type="url"
              value={accountData.website}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Business Address
          </label>
          <textarea
            id="address"
            name="address"
            value={accountData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSaveAccount}
          disabled={saving}
          className="bg-primary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  );
};

export default AccountSettingsSection;