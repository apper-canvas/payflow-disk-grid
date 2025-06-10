import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import Button from '@/components/atoms/Button';
import SettingItem from '@/components/molecules/SettingItem';

const NotificationSettingsSection = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
    failedPaymentAlerts: true
  });
  const [saving, setSaving] = useState(false);

  const handleSaveNotifications = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Notification settings updated successfully');
  };

  const handleToggleChange = (settingName) => (e) => {
    setNotificationSettings(prev => ({
      ...prev,
      [settingName]: e.target.checked
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-secondary mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <SettingItem
            title="Email Notifications"
            description="Receive notifications via email"
          >
            <ToggleSwitch
              checked={notificationSettings.emailNotifications}
              onChange={handleToggleChange('emailNotifications')}
            />
          </SettingItem>

          <SettingItem
            title="SMS Notifications"
            description="Receive notifications via SMS"
          >
            <ToggleSwitch
              checked={notificationSettings.smsNotifications}
              onChange={handleToggleChange('smsNotifications')}
            />
          </SettingItem>

          <SettingItem
            title="Payment Alerts"
            description="Get notified for every successful payment"
          >
            <ToggleSwitch
              checked={notificationSettings.paymentAlerts}
              onChange={handleToggleChange('paymentAlerts')}
            />
          </SettingItem>

          <SettingItem
            title="Failed Payment Alerts"
            description="Get notified when payments fail"
          >
            <ToggleSwitch
              checked={notificationSettings.failedPaymentAlerts}
              onChange={handleToggleChange('failedPaymentAlerts')}
            />
          </SettingItem>

          <SettingItem
            title="Weekly Reports"
            description="Receive weekly payment summaries"
          >
            <ToggleSwitch
              checked={notificationSettings.weeklyReports}
              onChange={handleToggleChange('weeklyReports')}
            />
          </SettingItem>

          <SettingItem
            title="Monthly Reports"
            description="Receive monthly payment summaries"
          >
            <ToggleSwitch
              checked={notificationSettings.monthlyReports}
              onChange={handleToggleChange('monthlyReports')}
            />
          </SettingItem>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSaveNotifications}
          disabled={saving}
          className="bg-primary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationSettingsSection;