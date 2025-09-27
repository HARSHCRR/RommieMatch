'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  Shield,
  Archive,
  UserX
} from 'lucide-react';
import { Conversation, Message } from '@/lib/chatService';
import ChatMessage from './ChatMessage';
import GlassCard from '@/components/ui/GlassCard';

interface ChatInterfaceProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file', metadata?: any) => Promise<void>;
  onStartTyping: () => void;
  onStopTyping: () => void;
  typingUsers: string[];
  onBack?: () => void;
  onArchive?: () => void;
  onBlock?: () => void;
}

export default function ChatInterface({
  conversation,
  messages,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  typingUsers,
  onBack,
  onArchive,
  onBlock
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const otherParticipant = conversation.participants.find(p => p.id !== 'current-user') || conversation.participants[0];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation.id]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      await onSendMessage(messageInput.trim(), 'text', replyingTo ? { replyTo: replyingTo.id } : undefined);
      setMessageInput('');
      setReplyingTo(null);
      onStopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    if (e.target.value.trim()) {
      onStartTyping();
    } else {
      onStopTyping();
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleAttachment = (type: 'image' | 'file') => {
    setShowAttachmentMenu(false);
    // Handle file attachment logic here
    console.log('Attach', type);
  };

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '👏'];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            
            <div className="relative">
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full object-cover"
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
            
            <div>
              <h3 className="text-white font-semibold">{otherParticipant.name}</h3>
              <p className="text-white/60 text-sm">
                {otherParticipant.online ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Property Info */}
            {conversation.propertyTitle && (
              <div className="hidden md:flex items-center space-x-4 text-white/70 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{conversation.propertyTitle}</span>
                </div>
                {conversation.metadata?.propertyRent && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{conversation.metadata.propertyRent.toLocaleString()}</span>
                  </div>
                )}
                {conversation.metadata?.matchScore && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{conversation.metadata.matchScore}% match</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <Phone className="w-5 h-5 text-white/70" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <Video className="w-5 h-5 text-white/70" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-white/70" />
                </button>
                
                <AnimatePresence>
                  {showAttachmentMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className="absolute right-0 top-full mt-2 bg-black/80 backdrop-blur-sm rounded-xl p-2 space-y-1"
                    >
                      <button
                        onClick={() => handleAttachment('image')}
                        className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white text-sm"
                      >
                        <Image className="w-4 h-4" />
                        <span>Photo</span>
                      </button>
                      <button
                        onClick={() => handleAttachment('file')}
                        className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white text-sm"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span>File</span>
                      </button>
                      {onArchive && (
                        <button
                          onClick={onArchive}
                          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white text-sm"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Archive</span>
                        </button>
                      )}
                      {onBlock && (
                        <button
                          onClick={onBlock}
                          className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 text-sm"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Block</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white/50" />
              </div>
              <h3 className="text-white/70 mb-2">Start a conversation</h3>
              <p className="text-white/50 text-sm">
                Send a message to begin your chat with {otherParticipant.name}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.senderId === 'current-user';
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
              
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={!isOwn && showAvatar}
                  onReply={handleReply}
                />
              );
            })}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {otherParticipant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-white/60 text-sm ml-2">typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-white/5 border-t border-white/10 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">Replying to:</span>
              <span className="text-white text-sm truncate max-w-xs">
                {replyingTo.content}
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
                height: 'auto'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            
            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-white/20"
                >
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMessageInput(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xl"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Smile className="w-5 h-5 text-white/70" />
            </button>
            
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Paperclip className="w-5 h-5 text-white/70" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-white/20 disabled:to-white/20 disabled:cursor-not-allowed rounded-xl transition-all duration-300"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
