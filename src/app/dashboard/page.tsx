'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  Filter,
  MessageCircle,
  Heart,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  Edit3
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  mode: 'host', // 'host' or 'seeker'
  avatar: 'https://picsum.photos/seed/alex/100/100',
  verified: true,
  properties: [
    {
      id: '1',
      title: 'Modern 2BHK in Downtown',
      location: 'Downtown, Mumbai',
      rent: 25000,
      totalSlots: 4,
      availableSlots: 2,
      images: [
        'https://picsum.photos/seed/property1-1/400/300',
        'https://picsum.photos/seed/property1-2/400/300',
        'https://picsum.photos/seed/property1-3/400/300'
      ],
      amenities: ['WiFi', 'AC', 'Parking', 'Gym', 'Security'],
      rating: 4.8,
      applications: 12,
      views: 156
    },
    {
      id: '2',
      title: 'Cozy Studio Apartment',
      location: 'Andheri West, Mumbai',
      rent: 18000,
      totalSlots: 2,
      availableSlots: 1,
      images: [
        'https://picsum.photos/seed/property2-1/400/300',
        'https://picsum.photos/seed/property2-2/400/300'
      ],
      amenities: ['WiFi', 'AC', 'Kitchen'],
      rating: 4.6,
      applications: 8,
      views: 89
    }
  ],
  matches: [
    {
      id: '1',
      name: 'Priya Sharma',
      age: 24,
      avatar: 'https://picsum.photos/seed/priya/100/100',
      bio: 'Software engineer, loves cooking and hiking',
      compatibility: 92,
      lastMessage: 'Hi! I\'m interested in your 2BHK property',
      timestamp: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      name: 'Raj Patel',
      age: 26,
      avatar: 'https://picsum.photos/seed/raj/100/100',
      bio: 'Marketing professional, fitness enthusiast',
      compatibility: 88,
      lastMessage: 'When can I schedule a viewing?',
      timestamp: '1 day ago',
      unread: false
    }
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(mockUser);

  const stats = [
    {
      title: 'Total Properties',
      value: user.properties.length,
      icon: <Home className="w-6 h-6" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Active Applications',
      value: user.properties.reduce((sum, prop) => sum + prop.applications, 0),
      icon: <Users className="w-6 h-6" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Total Views',
      value: user.properties.reduce((sum, prop) => sum + prop.views, 0),
      icon: <Search className="w-6 h-6" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${user.properties.reduce((sum, prop) => sum + (prop.rent * prop.availableSlots), 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Applications</h3>
            <Link href="/dashboard/applications" className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {user.matches.slice(0, 3).map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <img
                  src={match.avatar}
                  alt={match.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium">{match.name}</h4>
                    {match.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{match.lastMessage}</p>
                  <p className="text-white/50 text-xs">{match.timestamp}</p>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">
                    {match.compatibility}% match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Property Performance */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Property Performance</h3>
            <Link href="/dashboard/properties" className="text-blue-400 hover:text-blue-300 text-sm">
              Manage
            </Link>
          </div>
          
          <div className="space-y-4">
            {user.properties.slice(0, 2).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{property.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-white/70 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{property.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>₹{property.rent.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-medium">
                      {property.applications} applications
                    </div>
                    <div className="text-white/50 text-xs">
                      {property.views} views
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Properties</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="relative mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-sm font-medium">
                  {property.availableSlots}/{property.totalSlots} available
                </div>
                <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-medium">
                  {property.rating} ⭐
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
              <div className="flex items-center space-x-1 text-white/70 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-white">
                  ₹{property.rent.toLocaleString()}
                  <span className="text-sm text-white/70 font-normal">/month</span>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 text-sm font-medium">
                    {property.applications} applications
                  </div>
                  <div className="text-white/50 text-xs">
                    {property.views} views
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl transition-colors text-sm font-medium">
                  <Edit3 className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-4 rounded-xl transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Matches</h2>
        <div className="flex items-center space-x-3">
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <Filter className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {match.unread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{match.name}, {match.age}</h3>
                  <div className="flex items-center space-x-2">
                    <div className="text-green-400 text-sm font-medium">
                      {match.compatibility}% match
                    </div>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{match.bio}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Last message:</span>
                  <span className="text-white/70">{match.timestamp}</span>
                </div>
                <p className="text-white/60 text-sm bg-white/5 p-2 rounded-lg">
                  "{match.lastMessage}"
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-4 rounded-xl transition-colors text-sm font-medium">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Chat
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-xl transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'properties':
        return renderProperties();
      case 'matches':
        return renderMatches();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="text-white text-xl font-bold">RoomieMatch</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-1 bg-white/10 rounded-xl p-1">
                {['overview', 'properties', 'matches'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                      activeTab === tab
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-white/50 text-xs capitalize">{user.mode}</p>
                </div>
              </div>
              
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {['overview', 'properties', 'matches'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
