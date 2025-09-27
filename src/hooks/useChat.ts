import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, Conversation, Message, User, ChatFilters, ChatNotification } from '@/lib/chatService';

export interface UseChatOptions {
  userId: string;
  conversationId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string, type?: 'text' | 'image' | 'file', metadata?: any) => Promise<Message>;
  markAsRead: (messageIds?: string[]) => void;
  startTyping: () => void;
  stopTyping: () => void;
  typingUsers: User[];
  getConversation: (conversationId: string) => Conversation | null;
  getOrCreateConversation: (participantId: string, propertyId?: string) => Conversation;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  searchMessages: (query: string) => Message[];
  getNotifications: () => ChatNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  getConversationStats: () => {
    totalConversations: number;
    unreadMessages: number;
    activeConversations: number;
    archivedConversations: number;
  };
}

export function useChat({
  userId,
  conversationId,
  autoRefresh = false,
  refreshInterval = 5000
}: UseChatOptions): UseChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<User[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadConversations = useCallback(() => {
    try {
      setError(null);
      const userConversations = chatService.getConversations();
      setConversations(userConversations);
      
      // Set current conversation if conversationId is provided
      if (conversationId) {
        const conversation = userConversations.find(c => c.id === conversationId);
        setCurrentConversation(conversation || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    }
  }, [conversationId]);

  const loadMessages = useCallback(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setError(null);
      const conversationMessages = chatService.getMessages(conversationId);
      setMessages(conversationMessages);
      
      // Mark messages as read
      chatService.markMessagesAsRead(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      console.error('Error loading messages:', err);
    }
  }, [conversationId]);

  const loadTypingUsers = useCallback(() => {
    if (!conversationId) return;
    
    try {
      const users = chatService.getTypingUsers(conversationId);
      setTypingUsers(users);
    } catch (err) {
      console.error('Error loading typing users:', err);
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (
    content: string, 
    type: 'text' | 'image' | 'file' = 'text', 
    metadata?: any
  ): Promise<Message> => {
    if (!conversationId) {
      throw new Error('No conversation selected');
    }

    try {
      const message = chatService.sendMessage(conversationId, content, type, metadata);
      
      // Reload messages and conversations
      loadMessages();
      loadConversations();
      
      return message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [conversationId, loadMessages, loadConversations]);

  const markAsRead = useCallback((messageIds?: string[]) => {
    if (!conversationId) return;
    
    try {
      chatService.markMessagesAsRead(conversationId, messageIds);
      loadMessages();
      loadConversations();
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [conversationId, loadMessages, loadConversations]);

  const startTyping = useCallback(() => {
    if (!conversationId) return;
    
    try {
      chatService.startTyping(conversationId);
      loadTypingUsers();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    } catch (err) {
      console.error('Error starting typing:', err);
    }
  }, [conversationId, loadTypingUsers]);

  const stopTyping = useCallback(() => {
    if (!conversationId) return;
    
    try {
      chatService.stopTyping(conversationId);
      loadTypingUsers();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping typing:', err);
    }
  }, [conversationId, loadTypingUsers]);

  const getConversation = useCallback((conversationId: string): Conversation | null => {
    return chatService.getConversation(conversationId);
  }, []);

  const getOrCreateConversation = useCallback((participantId: string, propertyId?: string): Conversation => {
    return chatService.getOrCreateConversation(participantId, propertyId);
  }, []);

  const archiveConversation = useCallback((conversationId: string) => {
    try {
      chatService.archiveConversation(conversationId);
      loadConversations();
    } catch (err) {
      console.error('Error archiving conversation:', err);
    }
  }, [loadConversations]);

  const unarchiveConversation = useCallback((conversationId: string) => {
    try {
      chatService.unarchiveConversation(conversationId);
      loadConversations();
    } catch (err) {
      console.error('Error unarchiving conversation:', err);
    }
  }, [loadConversations]);

  const blockUser = useCallback((userId: string) => {
    try {
      chatService.blockUser(userId);
      loadConversations();
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  }, [loadConversations]);

  const unblockUser = useCallback((userId: string) => {
    try {
      chatService.unblockUser(userId);
      loadConversations();
    } catch (err) {
      console.error('Error unblocking user:', err);
    }
  }, [loadConversations]);

  const searchMessages = useCallback((query: string): Message[] => {
    return chatService.searchMessages(query, conversationId);
  }, [conversationId]);

  const getNotifications = useCallback((): ChatNotification[] => {
    return chatService.getNotifications();
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    chatService.markNotificationAsRead(notificationId);
  }, []);

  const getConversationStats = useCallback(() => {
    return chatService.getConversationStats();
  }, []);

  // Initialize chat service with current user
  useEffect(() => {
    chatService.setCurrentUser(userId);
    setLoading(true);
    
    // Load initial data
    loadConversations();
    loadMessages();
    loadTypingUsers();
    
    setLoading(false);
  }, [userId, loadConversations, loadMessages, loadTypingUsers]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadConversations();
      loadMessages();
      loadTypingUsers();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadConversations, loadMessages, loadTypingUsers]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    typingUsers,
    getConversation,
    getOrCreateConversation,
    archiveConversation,
    unarchiveConversation,
    blockUser,
    unblockUser,
    searchMessages,
    getNotifications,
    markNotificationAsRead,
    getConversationStats
  };
}

// Hook for conversation list
export interface UseConversationListOptions {
  userId: string;
  filters?: ChatFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseConversationListReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refreshConversations: () => void;
  searchConversations: (query: string) => Conversation[];
  getConversationStats: () => {
    totalConversations: number;
    unreadMessages: number;
    activeConversations: number;
    archivedConversations: number;
  };
}

export function useConversationList({
  userId,
  filters = {},
  autoRefresh = false,
  refreshInterval = 10000
}: UseConversationListOptions): UseConversationListReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(() => {
    try {
      setError(null);
      const userConversations = chatService.getConversations(filters);
      setConversations(userConversations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  const searchConversations = useCallback((query: string): Conversation[] => {
    const searchTerm = query.toLowerCase();
    return conversations.filter(conv =>
      conv.participants.some(p => p.name.toLowerCase().includes(searchTerm)) ||
      conv.propertyTitle?.toLowerCase().includes(searchTerm) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm)
    );
  }, [conversations]);

  const getConversationStats = useCallback(() => {
    return chatService.getConversationStats();
  }, []);

  // Initialize
  useEffect(() => {
    chatService.setCurrentUser(userId);
    loadConversations();
  }, [userId, loadConversations]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadConversations();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadConversations]);

  return {
    conversations,
    loading,
    error,
    refreshConversations,
    searchConversations,
    getConversationStats
  };
}
