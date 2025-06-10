import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SettingItem from '@/components/molecules/SettingItem';

const SecuritySettingsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">Security Settings</h3>
        <div className="space-y-4">
          <SettingItem
            title="Change Password"
            description="Update your password to keep your account secure"
            icon="Lock"
          >
            <Button className="bg-primary text-white hover:brightness-110">
              Change Password
            </Button>
          </SettingItem>

          <SettingItem
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            icon="Smartphone"
          >
            <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50">
              Enable 2FA
            </Button>
          </SettingItem>

          <SettingItem
            title="Active Sessions"
            description="Manage devices that are currently logged into your account"
            icon="Monitor"
          >
            <Button className="border border-gray-300 text-gray-700 hover:bg-gray-50">
              View Sessions
            </Button>
          </SettingItem>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySettingsSection;