'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  X, 
  Star, 
  MessageCircle, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Filter,
  Search
} from 'lucide-react';
import { useMatching } from '@/hooks/useMatching';
import { useChat } from '@/hooks/useChat';
import { MatchResult } from '@/lib/matchingAlgorithm';
import GlassCard from '@/components/ui/GlassCard';

interface MatchingInterfaceProps {
  userId: string;
  onMatch?: (match: MatchResult) => void;
}

export default function MatchingInterface({ userId, onMatch }: MatchingInterfaceProps) {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [swipedMatches, setSwipedMatches] = useState<Set<string>>(new Set());
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    matches,
    loading,
    error,
    refreshMatches,
    searchMatches,
    getMatchDetails,
    getCompatibilityBreakdown,
    getMatchReasoning,
    getMatchRecommendations,
    updateFilters,
    getMatchStatistics
  } = useMatching({
    userId,
    autoRefresh: true,
    refreshInterval: 30000
  });

  const { getOrCreateConversation } = useChat({
    userId,
    autoRefresh: false
  });

  const currentMatch = matches[currentMatchIndex];
  const stats = getMatchStatistics();

  const handleSwipe = async (direction: 'left' | 'right', match: MatchResult) => {
    setSwipedMatches(prev => new Set([...prev, match.property.id]));
    
    if (direction === 'right') {
      // Like - create conversation
      try {
        const conversation = getOrCreateConversation(
          match.property.host.id,
          match.property.id
        );
        
        onMatch?.(match);
        
        // Show match success animation
        setTimeout(() => {
          setCurrentMatchIndex(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error('Failed to create conversation:', error);
      }
    } else {
      // Pass - move to next
      setCurrentMatchIndex(prev => prev + 1);
    }
  };

  const handleStartChat = async (match: MatchResult) => {
    try {
      const conversation = getOrCreateConversation(
        match.property.host.id,
        match.property.id
      );
      
      // Navigate to chat
      window.location.href = `/chat?conversation=${conversation.id}`;
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'from-green-400 to-green-600';
    if (score >= 80) return 'from-blue-400 to-blue-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    if (score >= 60) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Matches</h3>
        <p className="text-white/70 mb-4">{error}</p>
        <button
          onClick={refreshMatches}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </GlassCard>
    );
  }

  if (!currentMatch) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">No More Matches</h3>
        <p className="text-white/70 mb-6">
          You've seen all available matches! Check back later for new properties.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalMatches}</div>
            <div className="text-white/60 text-sm">Total Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{Math.round(stats.averageCompatibility)}</div>
            <div className="text-white/60 text-sm">Avg Compatibility</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.topCategories.length}</div>
            <div className="text-white/60 text-sm">Categories</div>
          </div>
        </div>
        <button
          onClick={refreshMatches}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Refresh Matches
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Matches</h2>
          <p className="text-white/70">
            {currentMatchIndex + 1} of {matches.length} • {stats.averageCompatibility}% avg compatibility
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={refreshMatches}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Match Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMatch.property.id}
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <GlassCard className="overflow-hidden">
            {/* Property Image */}
            <div className="relative h-80 bg-gradient-to-br from-blue-500 to-purple-600">
              <img
                src={currentMatch.property.images[0] || 'https://picsum.photos/600/400'}
                alt={currentMatch.property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Compatibility Score */}
              <div className="absolute top-4 right-4">
                <div className={`bg-gradient-to-r ${getCompatibilityColor(currentMatch.compatibilityScore)} rounded-full px-4 py-2 text-white font-semibold shadow-lg`}>
                  {currentMatch.compatibilityScore}%
                </div>
              </div>

              {/* Property Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentMatch.property.title}
                </h3>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentMatch.property.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{currentMatch.property.rent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{currentMatch.property.availableSlots}/{currentMatch.property.totalSlots} slots</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Host Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={currentMatch.property.host.avatar || `https://picsum.photos/seed/${currentMatch.property.host.id}/60/60`}
                  alt={currentMatch.property.host.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-lg font-semibold text-white">
                      {currentMatch.property.host.name}
                    </h4>
                    {currentMatch.property.host.verified && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white/70">{currentMatch.property.host.rating}</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">
                    {currentMatch.property.host.bio}
                  </p>
                </div>
              </div>

              {/* Compatibility Breakdown */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-white">Compatibility Breakdown</h5>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(currentMatch.matchingFactors).map(([factor, score]) => (
                    <div key={factor} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm capitalize">
                          {factor.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-white font-semibold">{score.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getCompatibilityColor(score)}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Reasoning */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-white">Why This Match Works</h5>
                <div className="space-y-2">
                  {currentMatch.reasoning.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-white">Recommendations</h5>
                <div className="space-y-2">
                  {currentMatch.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleSwipe('left', currentMatch)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Pass</span>
                </button>
                
                <button
                  onClick={() => setShowMatchDetails(!showMatchDetails)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handleSwipe('right', currentMatch)}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
                >
                  <Heart className="w-5 h-5" />
                  <span>Like</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentMatchIndex(Math.max(0, currentMatchIndex - 1))}
          disabled={currentMatchIndex === 0}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentMatchIndex(Math.min(matches.length - 1, currentMatchIndex + 1))}
          disabled={currentMatchIndex === matches.length - 1}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
