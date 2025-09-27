'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Home, Camera, Upload, Check } from 'lucide-react';
import AnimatedText from '@/components/ui/AnimatedText';
import GlassCard from '@/components/ui/GlassCard';

interface FormData {
  mode: 'seeker' | 'host';
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
  // Host specific
  propertyType: string;
  totalSlots: number;
  availableSlots: number;
  rent: number;
  location: string;
  propertyPhotos: File[];
  // Seeker specific
  budget: number;
  preferredLocation: string;
  moveInDate: string;
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    mode: (searchParams.get('mode') as 'seeker' | 'host') || 'seeker',
    name: '',
    email: '',
    phone: '',
    age: 18,
    gender: '',
    bio: '',
    interests: [],
    propertyType: '',
    totalSlots: 0,
    availableSlots: 0,
    rent: 0,
    location: '',
    propertyPhotos: [],
    budget: 0,
    preferredLocation: '',
    moveInDate: ''
  });

  const steps = [
    {
      title: 'Choose Your Mode',
      description: 'Tell us what you\'re looking for'
    },
    {
      title: 'Basic Information',
      description: 'Your personal details'
    },
    {
      title: formData.mode === 'host' ? 'Property Details' : 'Preferences',
      description: formData.mode === 'host' ? 'About your property' : 'What you\'re looking for'
    },
    {
      title: 'Profile Setup',
      description: 'Complete your profile'
    },
    {
      title: 'Verification',
      description: 'Verify your account'
    }
  ];

  const propertyTypes = [
    { value: '1bhk', label: '1 BHK' },
    { value: '2bhk', label: '2 BHK' },
    { value: '3bhk', label: '3 BHK' },
    { value: '4bhk', label: '4 BHK' },
    { value: 'studio', label: 'Studio Apartment' },
    { value: 'pg', label: 'PG/Hostel' },
    { value: 'house', label: 'Independent House' }
  ];

  const lifestyleInterests = [
    'clean', 'organized', 'social', 'quiet', 'party-lover', 'early-riser', 
    'night-owl', 'fitness', 'cooking', 'gaming', 'reading', 'music', 
    'art', 'travel', 'pet-friendly', 'smoker', 'non-smoker'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        propertyPhotos: [...prev.propertyPhotos, ...fileArray]
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      router.push('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                What brings you here?
              </h2>
              <p className="text-white/80">
                Choose your primary goal to get started
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('mode', 'seeker')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                  formData.mode === 'seeker'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <User className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  I'm Looking for a Room
                </h3>
                <p className="text-white/70">
                  Find compatible roommates and perfect living spaces that match your lifestyle and budget.
                </p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('mode', 'host')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                  formData.mode === 'host'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Home className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  I Have a Room to Share
                </h3>
                <p className="text-white/70">
                  List your property, manage availability slots, and find the perfect roommates for your space.
                </p>
              </motion.button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Tell us about yourself
              </h2>
              <p className="text-white/80">
                This information helps us find better matches for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Age</label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself, your lifestyle, and what you're looking for..."
              />
            </div>
          </div>
        );

      case 2:
        if (formData.mode === 'host') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Property Details
                </h2>
                <p className="text-white/80">
                  Tell us about your property and available spaces
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-2">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select property type</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Total Slots</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalSlots}
                    onChange={(e) => handleInputChange('totalSlots', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Total number of rooms/beds"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Available Slots</label>
                  <input
                    type="number"
                    min="1"
                    max={formData.totalSlots}
                    value={formData.availableSlots}
                    onChange={(e) => handleInputChange('availableSlots', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Available rooms/beds"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Rent per Slot (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rent}
                    onChange={(e) => handleInputChange('rent', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Monthly rent per slot"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/80 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address or area"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Preferences
                </h2>
                <p className="text-white/80">
                  Help us find the perfect match for you
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-2">Budget Range (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Maximum monthly rent"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 mb-2">Preferred Location</label>
                  <input
                    type="text"
                    value={formData.preferredLocation}
                    onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Area or city you prefer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-white/80 mb-2">Preferred Move-in Date</label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Lifestyle & Interests
              </h2>
              <p className="text-white/80">
                Select your lifestyle preferences and interests
              </p>
            </div>
            
            <div>
              <label className="block text-white/80 mb-4">Lifestyle Preferences</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lifestyleInterests.map(interest => (
                  <motion.button
                    key={interest}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.interests.includes(interest)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {formData.mode === 'host' && (
              <div>
                <label className="block text-white/80 mb-4">Property Photos</label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-white/50" />
                  <p className="text-white/70 mb-4">
                    Upload photos of your property (up to 10 images)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-colors"
                  >
                    Choose Photos
                  </label>
                  {formData.propertyPhotos.length > 0 && (
                    <p className="text-white/70 mt-2">
                      {formData.propertyPhotos.length} photo(s) selected
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Verify Your Account
              </h2>
              <p className="text-white/80">
                Complete your account setup with verification
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Email Verification</h3>
                <p className="text-white/70 mb-4">
                  We've sent a verification link to {formData.email}
                </p>
                <button className="text-blue-400 hover:text-blue-300">
                  Resend verification email
                </button>
              </div>
              
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Phone Verification</h3>
                <p className="text-white/70 mb-4">
                  Enter the OTP sent to {formData.phone}
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Profile Completion</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white/70">Basic information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white/70">Preferences set</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white/70">Profile photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-white text-lg font-bold">RoomieMatch</span>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 text-white/50'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-white/70">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8">
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl transition-colors ${
                  currentStep === 0
                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
