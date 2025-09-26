'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '@/lib/mockData';
import { useDeckStore } from '@/lib/store';
import SwipeCard from '@/components/SwipeCard/SwipeCard';
import ActionBar from '@/components/ActionBar/ActionBar';
import { mockProfiles } from '@/lib/mockData';

interface CardDeckProps {
  onProfileTap: (profile: Profile) => void;
}

const CardDeck: React.FC<CardDeckProps> = ({ onProfileTap }) => {
  const { queue, history, swipeProfile, undoLastSwipe } = useDeckStore();
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize queue with mock profiles if empty
  useEffect(() => {
    if (queue.length === 0) {
      useDeckStore.setState({ queue: [...mockProfiles] });
    }
  }, [queue.length]);

  const handleSwipe = async (profile: Profile, action: 'like' | 'dislike' | 'superlike') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    swipeProfile(profile, action);
    
    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (history.length === 0 || isAnimating) return;
    undoLastSwipe();
  };

  const handleDislike = () => {
    if (queue.length === 0 || isAnimating) return;
    handleSwipe(queue[0], 'dislike');
  };

  const handleLike = () => {
    if (queue.length === 0 || isAnimating) return;
    handleSwipe(queue[0], 'like');
  };

  const handleSuperLike = () => {
    if (queue.length === 0 || isAnimating) return;
    handleSwipe(queue[0], 'superlike');
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAnimating) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handleDislike();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleLike();
          break;
        case 'u':
        case 'U':
          event.preventDefault();
          handleUndo();
          break;
        case 'Enter':
          event.preventDefault();
          if (queue.length > 0) {
            onProfileTap(queue[0]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [queue, isAnimating, onProfileTap]);

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No more profiles!
          </h2>
          <p className="text-gray-600 mb-6">
            You've seen all available roommates in your area.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => useDeckStore.setState({ queue: [...mockProfiles] })}
            className="btn-primary"
          >
            Refresh Profiles
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Card Stack */}
      <div className="relative w-80 h-[500px] mb-8">
        <AnimatePresence>
          {queue.slice(0, 3).map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              onTap={onProfileTap}
              isTop={index === 0}
              zIndex={10 - index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <ActionBar
        onDislike={handleDislike}
        onLike={handleLike}
        onSuperLike={handleSuperLike}
        onUndo={handleUndo}
        canUndo={history.length > 0}
        disabled={isAnimating}
      />

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-gray-500 mt-4"
      >
        <p className="mb-2">
          Swipe left to pass, right to like, or use the buttons below
        </p>
        <p className="text-xs">
          Keyboard: ← → to swipe, U to undo, Enter to view profile
        </p>
      </motion.div>
    </div>
  );
};

export default CardDeck;
