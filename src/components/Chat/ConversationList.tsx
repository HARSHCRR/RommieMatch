'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Archive, Filter, MoreVertical, Clock, MapPin, DollarSign } from 'lucide-react';
import { Conversation } from '@/lib/chatService';
import GlassCard from '@/components/ui/GlassCard';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export default function ConversationList({
  conversations,
  onSelectConversation,
  selectedConversationId,
  loading = false,
  onSearch,
  onFilter
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredConversations = conversations.filter(conv => {
    if (!showArchived && conv.status === 'archived') return false;
    if (searchQuery && !conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== 'current-user') || conversation.participants[0];
  };

  const getConversationStatus = (conversation: Conversation) => {
    if (conversation.status === 'blocked') return 'blocked';
    if (conversation.status === 'archived') return 'archived';
    return 'active';
  };

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <GlassCard className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <GlassCard className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Messages</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onFilter}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 text-white/70" />
            </button>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Archive className={`w-5 h-5 ${showArchived ? 'text-blue-400' : 'text-white/70'}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Conversations List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation, index) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isSelected = conversation.id === selectedConversationId;
              const status = getConversationStatus(conversation);

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    onClick={() => onSelectConversation(conversation)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                      isSelected ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
                    } ${status === 'blocked' ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={otherParticipant.avatar}
                          alt={otherParticipant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {otherParticipant.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        {otherParticipant.verified && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium truncate ${
                            status === 'blocked' ? 'text-white/50' : 'text-white'
                          }`}>
                            {otherParticipant.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-white/50">
                                {formatTimestamp(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Property Info */}
                        {conversation.propertyTitle && (
                          <div className="flex items-center space-x-1 mb-2">
                            <MapPin className="w-3 h-3 text-white/50" />
                            <span className="text-xs text-white/70 truncate">
                              {conversation.propertyTitle}
                            </span>
                            {conversation.metadata?.propertyRent && (
                              <>
                                <span className="text-white/50">•</span>
                                <DollarSign className="w-3 h-3 text-white/50" />
                                <span className="text-xs text-white/70">
                                  ₹{conversation.metadata.propertyRent.toLocaleString()}
                                </span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Last Message */}
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            status === 'blocked' ? 'text-white/40' : 'text-white/70'
                          }`}>
                            {conversation.lastMessage ? (
                              <>
                                <span className={conversation.unreadCount > 0 ? 'font-medium text-white' : ''}>
                                  {conversation.lastMessage.content}
                                </span>
                              </>
                            ) : (
                              'Start a conversation...'
                            )}
                          </p>
                          
                          {/* Status Indicators */}
                          <div className="flex items-center space-x-1">
                            {conversation.lastMessage && conversation.lastMessage.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            )}
                            {status === 'archived' && (
                              <Archive className="w-3 h-3 text-white/50" />
                            )}
                            {status === 'blocked' && (
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {/* Match Score */}
                        {conversation.metadata?.matchScore && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white/10 rounded-full h-1">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full"
                                  style={{ width: `${conversation.metadata.matchScore}%` }}
                                />
                              </div>
                              <span className="text-xs text-white/60">
                                {conversation.metadata.matchScore}% match
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{filteredConversations.length} conversations</span>
            <span>
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
