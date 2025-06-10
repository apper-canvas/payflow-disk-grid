import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SettingItem from '@/components/molecules/SettingItem';

const BillingSettingsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">Billing Information</h3>
        <div className="space-y-4">
          <SettingItem
            title="Current Plan"
            description="&gt;$99/month • Next billing date: March 15, 2024"
          >
            <span className="px-2.5 py-0.5 bg-success/10 text-success rounded-full text-sm font-medium">
              Professional
            </span>
            <div className="flex space-x-2 mt-4">
              <Button className="bg-primary text-white hover:brightness-110">
                Upgrade Plan
              </Button>
              <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50">
                View Usage
              </Button>
            </div>
          </SettingItem>

          <SettingItem
            title="Payment Method"
            description="Visa •••• 4242 • Expires 12/25"
            icon="CreditCard"
          >
            <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50">
              Update Payment Method
            </Button>
          </SettingItem>

          <SettingItem
            title="Billing History"
            description="View and download your past invoices"
            icon="Receipt"
          >
            <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50">
              View Invoices
            </Button>
          </SettingItem>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingSettingsSection;