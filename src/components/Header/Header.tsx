'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showProfile?: boolean;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = 'RoomieMatch',
  showProfile = true,
  showSettings = true
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 px-4 py-3"
    >
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </motion.div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {showProfile && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/profile"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="View profile"
              >
                <User size={20} className="text-gray-600" />
              </Link>
            </motion.div>
          )}
          
          {showSettings && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/settings"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                aria-label="Settings"
              >
                <Settings size={20} className="text-gray-600" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
