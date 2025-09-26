'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useDrag } from 'react-use-gesture';
import { Profile } from '@/lib/mockData';
import { Heart, X, Star } from 'lucide-react';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (profile: Profile, action: 'like' | 'dislike' | 'superlike') => void;
  onTap: (profile: Profile) => void;
  isTop: boolean;
  zIndex: number;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  onTap,
  isTop,
  zIndex
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const scale = useTransform(x, [-300, 300], [0.8, 1.2]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx], cancel }) => {
      if (!isTop) {
        cancel();
        return;
      }
      
      setIsDragging(active);
      
      if (active) {
        x.set(mx);
        y.set(my);
      } else {
        const threshold = 120;
        const velocityThreshold = 0.5;
        
        if (Math.abs(mx) > threshold || Math.abs(vx) > velocityThreshold) {
          const action = mx > 0 ? 'like' : 'dislike';
          const exitX = mx > 0 ? 1000 : -1000;
          
          x.set(exitX);
          y.set(my + vy * 200);
          
          setTimeout(() => {
            onSwipe(profile, action);
          }, 300);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    },
    {
      axis: 'x',
      bounds: { left: -300, right: 300 },
      rubberband: true
    }
  );

  const handlePhotoSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentPhotoIndex(prev => 
        prev === profile.photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentPhotoIndex(prev => 
        prev === 0 ? profile.photos.length - 1 : prev - 1
      );
    }
  };

  const getOverlayColor = () => {
    const xValue = x.get();
    if (xValue > 50) return 'bg-green-500/20';
    if (xValue < -50) return 'bg-red-500/20';
    return '';
  };

  const getOverlayText = () => {
    const xValue = x.get();
    if (xValue > 50) return 'LIKE';
    if (xValue < -50) return 'NOPE';
    return '';
  };

  return (
    <motion.div
      {...bind()}
      style={{
        x: springX,
        y: springY,
        rotate,
        scale,
        opacity,
        zIndex
      }}
      className={`absolute w-80 h-[500px] cursor-grab active:cursor-grabbing ${
        isTop ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      whileTap={{ scale: 0.95 }}
      onClick={() => !isDragging && onTap(profile)}
    >
      <div className="relative w-full h-full card-container overflow-hidden">
        {/* Photo Carousel */}
        <div className="relative h-3/5 overflow-hidden">
          <motion.img
            key={currentPhotoIndex}
            src={profile.photos[currentPhotoIndex]}
            alt={`${profile.name} photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Photo indicators */}
          <div className="absolute top-4 right-4 flex space-x-1">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Photo navigation */}
          <div className="absolute inset-0 flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePhotoSwipe('right');
              }}
            />
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePhotoSwipe('left');
              }}
            />
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="p-6 h-2/5 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.name}, {profile.age}
            </h2>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {profile.bio}
            </p>
            
            {/* College/Company */}
            {(profile.college || profile.company) && (
              <p className="text-sm text-gray-500 mb-3">
                {profile.college || profile.company}
              </p>
            )}
            
            {/* Distance */}
            <p className="text-sm text-gray-500 mb-3">
              {profile.distanceKm} km away
            </p>
            
            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {profile.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
              {profile.interests.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{profile.interests.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Swipe Overlay */}
        {isDragging && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center ${
              getOverlayColor()
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {getOverlayText()}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;
