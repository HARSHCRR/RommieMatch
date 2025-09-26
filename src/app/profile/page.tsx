'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3, Save, X } from 'lucide-react';
import Header from '@/components/Header/Header';
import { useDeckStore } from '@/lib/store';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useDeckStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(currentUser);

  const handleSave = () => {
    setCurrentUser(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(currentUser);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !editedProfile.interests.includes(interest.trim())) {
      handleInputChange('interests', [...editedProfile.interests, interest.trim()]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    handleInputChange('interests', editedProfile.interests.filter(i => i !== interestToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Profile" showProfile={false} />
      
      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <div className="card-container p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={editedProfile.photos[0]}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg"
                  aria-label="Change photo"
                >
                  <Camera size={16} />
                </motion.button>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {editedProfile.name}, {editedProfile.age}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {editedProfile.bio}
            </p>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                <Edit3 size={16} className="mr-2" />
                Edit Profile
              </motion.button>
            )}
          </div>

          {/* Profile Details */}
          <div className="card-container p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="18"
                  max="100"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.age}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-900">{editedProfile.bio}</p>
              )}
            </div>

            {/* College/Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editedProfile.college ? 'College' : 'Company'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.college || editedProfile.company || ''}
                  onChange={(e) => handleInputChange(editedProfile.college ? 'college' : 'company', e.target.value)}
                  className="input-field"
                  placeholder="School or workplace"
                />
              ) : (
                <p className="text-gray-900">{editedProfile.college || editedProfile.company}</p>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editedProfile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full flex items-center space-x-2"
                  >
                    <span>{interest}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeInterest(interest)}
                        className="text-primary-500 hover:text-primary-700"
                        aria-label={`Remove ${interest}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add interest..."
                    className="flex-1 input-field"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addInterest(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add interest..."]') as HTMLInputElement;
                      if (input) {
                        addInterest(input.value);
                        input.value = '';
                      }
                    }}
                    className="btn-primary px-4"
                  >
                    Add
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 btn-primary"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
