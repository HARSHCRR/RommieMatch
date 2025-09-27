'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  X, 
  Star, 
  MapPin, 
  DollarSign, 
  Users, 
  Wifi, 
  Car, 
  Dumbbell,
  Shield,
  ArrowLeft,
  Filter,
  Search,
  Camera,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

// Enhanced mock data for properties
const mockProperties = [
  {
    id: '1',
    title: 'Modern 2BHK in Downtown Mumbai',
    host: {
      name: 'Priya Sharma',
      age: 28,
      avatar: 'https://picsum.photos/seed/priya/100/100',
      verified: true,
      rating: 4.8,
      bio: 'Software engineer, loves cooking and hosting friends'
    },
    property: {
      type: '2BHK',
      location: 'Bandra West, Mumbai',
      distance: '2.3 km',
      rent: 25000,
      availableSlots: 2,
      totalSlots: 4,
      moveInDate: '2024-02-01',
      images: [
        'https://picsum.photos/seed/prop1-1/600/800',
        'https://picsum.photos/seed/prop1-2/600/800',
        'https://picsum.photos/seed/prop1-3/600/800',
        'https://picsum.photos/seed/prop1-4/600/800'
      ],
      amenities: [
        { name: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
        { name: 'Parking', icon: <Car className="w-4 h-4" /> },
        { name: 'Gym', icon: <Dumbbell className="w-4 h-4" /> },
        { name: 'Security', icon: <Shield className="w-4 h-4" /> },
        { name: 'AC', icon: <span className="text-sm">AC</span> },
        { name: 'Kitchen', icon: <span className="text-sm">🍳</span> }
      ],
      description: 'Beautiful modern apartment in the heart of Bandra. Close to all amenities, metro station, and popular cafes. Perfect for working professionals.',
      compatibility: 92,
      preferences: ['clean', 'organized', 'social', 'fitness', 'cooking'],
      houseRules: ['No smoking', 'No pets', 'Quiet hours after 11 PM', 'Shared kitchen cleaning']
    }
  },
  {
    id: '2',
    title: 'Cozy Studio with Balcony',
    host: {
      name: 'Raj Patel',
      age: 26,
      avatar: 'https://picsum.photos/seed/raj/100/100',
      verified: true,
      rating: 4.6,
      bio: 'Marketing professional, fitness enthusiast, loves outdoor activities'
    },
    property: {
      type: 'Studio',
      location: 'Andheri West, Mumbai',
      distance: '1.8 km',
      rent: 18000,
      availableSlots: 1,
      totalSlots: 2,
      moveInDate: '2024-01-15',
      images: [
        'https://picsum.photos/seed/prop2-1/600/800',
        'https://picsum.photos/seed/prop2-2/600/800',
        'https://picsum.photos/seed/prop2-3/600/800'
      ],
      amenities: [
        { name: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
        { name: 'AC', icon: <span className="text-sm">AC</span> },
        { name: 'Balcony', icon: <span className="text-sm">🌿</span> },
        { name: 'Kitchen', icon: <span className="text-sm">🍳</span> }
      ],
      description: 'Cozy studio apartment with a beautiful balcony overlooking the city. Perfect for someone who values privacy and comfort.',
      compatibility: 85,
      preferences: ['clean', 'quiet', 'fitness', 'reading'],
      houseRules: ['No smoking', 'No pets', 'Keep noise levels low']
    }
  },
  {
    id: '3',
    title: 'Spacious 3BHK with Garden',
    host: {
      name: 'Aisha Khan',
      age: 30,
      avatar: 'https://picsum.photos/seed/aisha/100/100',
      verified: true,
      rating: 4.9,
      bio: 'Designer and yoga instructor, loves plants and sustainable living'
    },
    property: {
      type: '3BHK',
      location: 'Powai, Mumbai',
      distance: '3.2 km',
      rent: 32000,
      availableSlots: 2,
      totalSlots: 6,
      moveInDate: '2024-02-15',
      images: [
        'https://picsum.photos/seed/prop3-1/600/800',
        'https://picsum.photos/seed/prop3-2/600/800',
        'https://picsum.photos/seed/prop3-3/600/800',
        'https://picsum.photos/seed/prop3-4/600/800',
        'https://picsum.photos/seed/prop3-5/600/800'
      ],
      amenities: [
        { name: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
        { name: 'Parking', icon: <Car className="w-4 h-4" /> },
        { name: 'Garden', icon: <span className="text-sm">🌱</span> },
        { name: 'Security', icon: <Shield className="w-4 h-4" /> },
        { name: 'AC', icon: <span className="text-sm">AC</span> },
        { name: 'Kitchen', icon: <span className="text-sm">🍳</span> }
      ],
      description: 'Beautiful spacious apartment with a private garden. Perfect for nature lovers and those who enjoy outdoor spaces.',
      compatibility: 88,
      preferences: ['clean', 'organized', 'social', 'cooking', 'art'],
      houseRules: ['No smoking', 'Pets welcome', 'Garden maintenance shared', 'Eco-friendly living encouraged']
    }
  }
];

export default function SwipePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [likedProperties, setLikedProperties] = useState<string[]>([]);
  const [rejectedProperties, setRejectedProperties] = useState<string[]>([]);

  const currentProperty = mockProperties[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setLikedProperties(prev => [...prev, currentProperty.id]);
    } else {
      setRejectedProperties(prev => [...prev, currentProperty.id]);
    }
    
    setCurrentIndex(prev => prev + 1);
    setCurrentImageIndex(0);
    setShowDetails(false);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? currentProperty.property.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === currentProperty.property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleLike = () => handleSwipe('right');
  const handleReject = () => handleSwipe('left');

  // Check if we've gone through all properties
  if (currentIndex >= mockProperties.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-6">
        <GlassCard className="p-12 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Great Swiping!
          </h2>
          <p className="text-white/80 mb-8">
            You've reviewed all available properties. Check back later for new listings!
          </p>
          <div className="space-y-4">
            <p className="text-white/70">
              You liked {likedProperties.length} properties
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/dashboard/matches')}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                View Matches
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setLikedProperties([]);
                  setRejectedProperties([]);
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Swipe Again
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

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
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Filter className="w-5 h-5 text-white" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProperty.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <GlassCard className="overflow-hidden">
              {/* Image Section */}
              <div className="relative h-96">
                <img
                  src={currentProperty.property.images[currentImageIndex]}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentProperty.property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Compatibility Badge */}
                <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentProperty.property.compatibility}% match
                </div>
                
                {/* Video Indicator */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>{currentProperty.property.images.length}</span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {currentProperty.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{currentProperty.property.location}</span>
                      <span>•</span>
                      <span>{currentProperty.property.distance}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ₹{currentProperty.property.rent.toLocaleString()}
                    </div>
                    <div className="text-white/70 text-sm">per month</div>
                  </div>
                </div>

                {/* Host Info */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-white/5 rounded-xl">
                  <img
                    src={currentProperty.host.avatar}
                    alt={currentProperty.host.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{currentProperty.host.name}, {currentProperty.host.age}</h3>
                      {currentProperty.host.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white/70 text-sm">{currentProperty.host.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Available slots:</span>
                    <span className="text-white">{currentProperty.property.availableSlots}/{currentProperty.property.totalSlots}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Move-in date:</span>
                    <span className="text-white">{new Date(currentProperty.property.moveInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Property type:</span>
                    <span className="text-white">{currentProperty.property.type}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProperty.property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity.icon}
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {currentProperty.property.description}
                  </p>
                </div>

                {/* House Rules */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">House Rules</h4>
                  <div className="space-y-1">
                    {currentProperty.property.houseRules.map((rule, index) => (
                      <div key={index} className="text-white/60 text-sm">
                        • {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-6 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReject}
            className="w-16 h-16 bg-white/20 hover:bg-red-500/20 backdrop-blur-sm border-2 border-white/30 hover:border-red-500/50 rounded-full flex items-center justify-center transition-all duration-300"
          >
            <X className="w-8 h-8 text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDetails(!showDetails)}
            className="w-16 h-16 bg-white/20 hover:bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 hover:border-blue-500/50 rounded-full flex items-center justify-center transition-all duration-300"
          >
            <span className="text-white text-sm font-bold">i</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.button>
        </div>

        {/* Progress */}
        <div className="mt-6 text-center">
          <div className="text-white/70 text-sm">
            {currentIndex + 1} of {mockProperties.length} properties
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / mockProperties.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
