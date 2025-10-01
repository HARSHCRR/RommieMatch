'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChat, useConversationList } from '@/hooks/useChat';
import { Conversation } from '@/lib/chatService';
import ConversationList from '@/components/Chat/ConversationList';
import ChatInterface from '@/components/Chat/ChatInterface';
import GlassCard from '@/components/ui/GlassCard';
import WebGLShaderAnimation from '@/components/ui/WebGLShaderAnimation';
import { Search, MessageCircle, Filter, Archive } from 'lucide-react';

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserId] = useState('user1'); // Mock current user ID

  // Use conversation list hook
  const {
    conversations,
    loading: conversationsLoading,
    error: conversationsError,
    refreshConversations,
    searchConversations,
    getConversationStats
  } = useConversationList({
    userId: currentUserId,
    autoRefresh: true,
    refreshInterval: 10000
  });

  // Use chat hook for selected conversation
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    typingUsers,
    archiveConversation,
    blockUser
  } = useChat({
    userId: currentUserId,
    conversationId: selectedConversation?.id,
    autoRefresh: true,
    refreshInterval: 5000
  });

  const stats = getConversationStats();

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    markAsRead();
  };

  const handleSendMessage = async (content: string, type?: 'text' | 'image' | 'file', metadata?: any) => {
    if (!selectedConversation) return;
    
    try {
      await sendMessage(content, type, metadata);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleArchive = async () => {
    if (!selectedConversation) return;
    
    try {
      await archiveConversation(selectedConversation.id);
      setSelectedConversation(null);
      refreshConversations();
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleBlock = async () => {
    if (!selectedConversation) return;
    
    try {
      const otherParticipant = selectedConversation.participants.find(p => p.id !== currentUserId);
      if (otherParticipant) {
        await blockUser(otherParticipant.id);
        setSelectedConversation(null);
        refreshConversations();
      }
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const filteredConversations = searchQuery ? searchConversations(searchQuery) : conversations;

  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* Shader Animation Background */}
      <WebGLShaderAnimation 
        intensity={0.3}
        speed={0.6}
        colors={['#1E40AF', '#7C3AED', '#DB2777', '#0891B2']}
      />
      
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
              <p className="text-white/70">
                {stats.totalConversations} conversations • {stats.unreadMessages} unread
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-white/60 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Active: {stats.activeConversations}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4" />
                  <span>Archived: {stats.archivedConversations}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Conversation List */}
          <div className="lg:col-span-4">
            <ConversationList
              conversations={filteredConversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
              loading={conversationsLoading}
              onSearch={setSearchQuery}
              onFilter={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-8">
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <ChatInterface
                  conversation={selectedConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onStartTyping={startTyping}
                  onStopTyping={stopTyping}
                  typingUsers={typingUsers.map(user => user.name)}
                  onBack={handleBack}
                  onArchive={handleArchive}
                  onBlock={handleBlock}
                />
              </motion.div>
            ) : (
              <GlassCard className="h-full flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <MessageCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-semibold text-white mb-2"
                  >
                    Welcome to Messages
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/70 max-w-md mx-auto"
                  >
                    Select a conversation from the list to start chatting, or find new matches to begin a conversation.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stats.totalConversations}</div>
                      <div className="text-white/60 text-sm">Total Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stats.unreadMessages}</div>
                      <div className="text-white/60 text-sm">Unread Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stats.activeConversations}</div>
                      <div className="text-white/60 text-sm">Active Chats</div>
                    </div>
                  </motion.div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {conversationsError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-red-200"
          >
            <p className="font-medium">Error loading conversations</p>
            <p className="text-sm text-red-300">{conversationsError}</p>
          </motion.div>
        )}

        {messagesError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-red-200"
          >
            <p className="font-medium">Error loading messages</p>
            <p className="text-sm text-red-300">{messagesError}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
