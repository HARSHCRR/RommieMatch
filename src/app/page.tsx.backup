'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header/Header';
import CardDeck from '@/components/CardDeck/CardDeck';
import ProfileModal from '@/components/ProfileModal/ProfileModal';
import OnboardingModal from '@/components/OnboardingModal/OnboardingModal';
import { Profile } from '@/lib/mockData';

export default function HomePage() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('roomiematch-onboarding-seen');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, []);

  const handleProfileTap = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-120px)]"
        >
          <CardDeck onProfileTap={handleProfileTap} />
        </motion.div>
      </main>

      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
