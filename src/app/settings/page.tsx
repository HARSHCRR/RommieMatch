'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  Palette, 
  Eye, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import Header from '@/components/Header/Header';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    reducedMotion: false,
    onboardingTips: true,
    privacyMode: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    action: React.ReactNode;
  }> = ({ icon, title, description, action }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {action}
    </motion.div>
  );

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: () => void;
  }> = ({ enabled, onChange }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      className="relative"
      aria-label={`Toggle ${enabled ? 'off' : 'on'}`}
    >
      {enabled ? (
        <ToggleRight size={32} className="text-primary-600" />
      ) : (
        <ToggleLeft size={32} className="text-gray-400" />
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" showProfile={false} />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Preferences Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-3">
              <SettingItem
                icon={<Bell size={20} />}
                title="Push Notifications"
                description="Get notified about new matches and messages"
                action={<ToggleSwitch enabled={settings.notifications} onChange={() => toggleSetting('notifications')} />}
              />
              
              <SettingItem
                icon={<Palette size={20} />}
                title="Dark Mode"
                description="Switch to dark theme (UI only)"
                action={<ToggleSwitch enabled={settings.darkMode} onChange={() => toggleSetting('darkMode')} />}
              />
              
              <SettingItem
                icon={<Eye size={20} />}
                title="Reduced Motion"
                description="Minimize animations for accessibility"
                action={<ToggleSwitch enabled={settings.reducedMotion} onChange={() => toggleSetting('reducedMotion')} />}
              />
              
              <SettingItem
                icon={<HelpCircle size={20} />}
                title="Onboarding Tips"
                description="Show helpful tips and tutorials"
                action={<ToggleSwitch enabled={settings.onboardingTips} onChange={() => toggleSetting('onboardingTips')} />}
              />
            </div>
          </div>

          {/* Privacy Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Safety</h2>
            <div className="space-y-3">
              <SettingItem
                icon={<Shield size={20} />}
                title="Privacy Mode"
                description="Hide your profile from new users"
                action={<ToggleSwitch enabled={settings.privacyMode} onChange={() => toggleSetting('privacyMode')} />}
              />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Privacy Policy</h3>
                    <p className="text-sm text-gray-600">Read our privacy policy</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Terms of Service</h3>
                    <p className="text-sm text-gray-600">Read our terms and conditions</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
            <div className="space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Help & Support</h3>
                    <p className="text-sm text-gray-600">Get help or contact support</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">About RoomieMatch</h3>
                    <p className="text-sm text-gray-600">Version 1.0.0</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Mock logout action
              alert('This would log you out!');
            }}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </motion.button>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-blue-50 rounded-xl border border-blue-200"
          >
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a UI-only prototype. No data is actually saved or transmitted. 
              All settings and preferences are stored locally in your browser.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
