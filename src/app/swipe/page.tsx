'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users, TrendingUp, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MatchingInterface from '@/components/Matching/MatchingInterface';
import GlassCard from '@/components/ui/GlassCard';
import { MatchResult } from '@/lib/matchingAlgorithm';

export default function SwipePage() {
  const [currentUserId] = useState('user1'); // Mock current user ID
  const [showStats, setShowStats] = useState(false);

  const handleMatch = (match: MatchResult) => {
    // Handle successful match
    console.log('New match:', match);
    // You could show a match success modal here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-white text-lg font-bold">RoomieMatch</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.location.href = '/chat'}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowStats(!showStats)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover Perfect Properties
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Our advanced matching algorithm finds properties that match your lifestyle, 
              budget, and preferences. Swipe through personalized recommendations.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Matching</h3>
              <p className="text-white/70 text-sm">
                AI-powered compatibility scoring based on lifestyle, budget, and preferences
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Verified Hosts</h3>
              <p className="text-white/70 text-sm">
                All property hosts are verified with background checks and ratings
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Chat</h3>
              <p className="text-white/70 text-sm">
                Start conversations with hosts immediately after matching
              </p>
            </GlassCard>
          </motion.div>

          {/* Main Matching Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MatchingInterface 
              userId={currentUserId}
              onMatch={handleMatch}
            />
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Join thousands of users who found their ideal living situation through 
                our advanced matching system.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => window.location.href = '/chat'}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>View Messages</span>
                </button>
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-semibold transition-colors border border-white/20"
                >
                  Edit Profile
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}