'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, X, Star, RotateCcw } from 'lucide-react';

interface ActionBarProps {
  onDislike: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onDislike,
  onLike,
  onSuperLike,
  onUndo,
  canUndo,
  disabled = false
}) => {
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const iconVariants = {
    hover: { scale: 1.2 },
    tap: { scale: 0.8 }
  };

  return (
    <div className="flex items-center justify-center space-x-6 py-6">
      {/* Undo Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className={`p-4 rounded-full transition-colors duration-200 ${
          canUndo && !disabled
            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Undo last swipe"
      >
        <RotateCcw size={24} />
      </motion.button>

      {/* Dislike Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onDislike}
        disabled={disabled}
        className={`p-5 rounded-full transition-colors duration-200 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
        }`}
        aria-label="Dislike profile"
      >
        <motion.div variants={iconVariants}>
          <X size={28} />
        </motion.div>
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onSuperLike}
        disabled={disabled}
        className={`p-5 rounded-full transition-colors duration-200 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
        aria-label="Super like profile"
      >
        <motion.div
          variants={iconVariants}
          className="animate-star-burst"
        >
          <Star size={28} fill="currentColor" />
        </motion.div>
      </motion.button>

      {/* Like Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onLike}
        disabled={disabled}
        className={`p-5 rounded-full transition-colors duration-200 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
        }`}
        aria-label="Like profile"
      >
        <motion.div
          variants={iconVariants}
          className="animate-heart-beat"
        >
          <Heart size={28} fill="currentColor" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ActionBar;
