'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageCircle } from 'lucide-react';
import Header from '@/components/Header/Header';
import ProfileModal from '@/components/ProfileModal/ProfileModal';
import { useDeckStore } from '@/lib/store';
import { Profile } from '@/lib/mockData';

export default function MatchesPage() {
  const { matches } = useDeckStore();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<string>('');

  const handleProfileTap = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Get all unique interests from matches
  const allInterests = Array.from(
    new Set(matches.flatMap(profile => profile.interests))
  );

  // Filter matches based on search and interest
  const filteredMatches = matches.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInterest = !selectedInterest || profile.interests.includes(selectedInterest);
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Matches" showProfile={false} />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 input-field"
              />
            </div>

            {/* Interest Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="flex-1 input-field"
              >
                <option value="">All interests</option>
                {allInterests.map(interest => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matches Grid */}
          {filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {matches.length === 0 ? 'No matches yet' : 'No matches found'}
              </h2>
              <p className="text-gray-600">
                {matches.length === 0 
                  ? 'Start swiping to find your perfect roommate!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredMatches.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProfileTap(profile)}
                  className="card-container p-4 cursor-pointer"
                >
                  {/* Profile Photo */}
                  <div className="relative mb-3">
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {profile.name}, {profile.age}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {profile.bio}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{profile.distanceKm} km</span>
                    </div>
                  </div>

                  {/* Last Message Placeholder */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 italic">
                      Tap to start chatting
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          {matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600">
                {matches.length} mutual match{matches.length !== 1 ? 'es' : ''}
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
