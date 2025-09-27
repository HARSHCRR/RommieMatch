export interface User {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: string;
  verified: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  read: boolean;
  edited?: boolean;
  replyTo?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    thumbnailUrl?: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'direct' | 'group';
  propertyId?: string; // For property-related conversations
  propertyTitle?: string;
  status: 'active' | 'archived' | 'blocked';
  createdAt: string;
  updatedAt: string;
  metadata?: {
    matchScore?: number;
    propertyImages?: string[];
    propertyLocation?: string;
    propertyRent?: number;
  };
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface ChatNotification {
  id: string;
  type: 'message' | 'typing' | 'read' | 'system';
  conversationId: string;
  userId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatFilters {
  unreadOnly?: boolean;
  type?: 'direct' | 'group';
  propertyId?: string;
  search?: string;
}

export class ChatService {
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private users: Map<string, User> = new Map();
  private typingUsers: Map<string, Set<string>> = new Map();
  private notifications: ChatNotification[] = [];
  private currentUserId: string | null = null;

  // Initialize with mock data
  initializeMockData() {
    // Mock users
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: 'https://picsum.photos/seed/alex/100/100',
        online: true,
        verified: true,
      },
      {
        id: 'user2',
        name: 'Priya Sharma',
        avatar: 'https://picsum.photos/seed/priya/100/100',
        online: true,
        verified: true,
      },
      {
        id: 'user3',
        name: 'Raj Patel',
        avatar: 'https://picsum.photos/seed/raj/100/100',
        online: false,
        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        verified: true,
      },
      {
        id: 'user4',
        name: 'Aisha Khan',
        avatar: 'https://picsum.photos/seed/aisha/100/100',
        online: true,
        verified: true,
      },
    ];

    mockUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        participants: [mockUsers[0], mockUsers[2]], // Alex and Raj
        type: 'direct',
        propertyId: 'prop1',
        propertyTitle: 'Modern 2BHK in Bandra West',
        status: 'active',
        unreadCount: 2,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        metadata: {
          matchScore: 92,
          propertyImages: ['https://picsum.photos/seed/prop1-1/400/300'],
          propertyLocation: 'Bandra West, Mumbai',
          propertyRent: 22000,
        },
      },
      {
        id: 'conv2',
        participants: [mockUsers[0], mockUsers[1]], // Alex and Priya
        type: 'direct',
        propertyId: 'prop2',
        propertyTitle: 'Cozy Studio in Andheri West',
        status: 'active',
        unreadCount: 0,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        metadata: {
          matchScore: 88,
          propertyImages: ['https://picsum.photos/seed/prop2-1/400/300'],
          propertyLocation: 'Andheri West, Mumbai',
          propertyRent: 18000,
        },
      },
    ];

    mockConversations.forEach(conversation => {
      this.conversations.set(conversation.id, conversation);
    });

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: 'msg1',
        conversationId: 'conv1',
        senderId: 'user3', // Raj
        content: 'Hi Alex! I saw your interest in my 2BHK property. Would you like to schedule a viewing?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: true,
      },
      {
        id: 'msg2',
        conversationId: 'conv1',
        senderId: 'user1', // Alex
        content: 'Hi Raj! Yes, I\'d love to see the property. I\'m available this weekend. What times work for you?',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        read: true,
      },
      {
        id: 'msg3',
        conversationId: 'conv1',
        senderId: 'user3', // Raj
        content: 'Perfect! How about Saturday at 2 PM? I can show you around the place and answer any questions.',
        type: 'text',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        read: false,
      },
      {
        id: 'msg4',
        conversationId: 'conv2',
        senderId: 'user1', // Alex
        content: 'Hi Priya! I\'m interested in your studio apartment. Is it still available?',
        type: 'text',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: true,
      },
      {
        id: 'msg5',
        conversationId: 'conv2',
        senderId: 'user2', // Priya
        content: 'Yes, it\'s still available! The rent is ₹18,000 per month. Would you like to know more about the amenities?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: true,
      },
    ];

    mockMessages.forEach(message => {
      const conversationMessages = this.messages.get(message.conversationId) || [];
      conversationMessages.push(message);
      this.messages.set(message.conversationId, conversationMessages);
    });

    // Update last messages in conversations
    mockConversations.forEach(conversation => {
      const conversationMessages = this.messages.get(conversation.id) || [];
      if (conversationMessages.length > 0) {
        conversation.lastMessage = conversationMessages[conversationMessages.length - 1];
      }
    });
  }

  // Set current user
  setCurrentUser(userId: string) {
    this.currentUserId = userId;
  }

  // Get all conversations for current user
  getConversations(filters?: ChatFilters): Conversation[] {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    let conversations = Array.from(this.conversations.values()).filter(conv =>
      conv.participants.some(p => p.id === this.currentUserId)
    );

    if (filters) {
      if (filters.unreadOnly) {
        conversations = conversations.filter(conv => conv.unreadCount > 0);
      }

      if (filters.type) {
        conversations = conversations.filter(conv => conv.type === filters.type);
      }

      if (filters.propertyId) {
        conversations = conversations.filter(conv => conv.propertyId === filters.propertyId);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        conversations = conversations.filter(conv =>
          conv.participants.some(p => p.name.toLowerCase().includes(searchTerm)) ||
          conv.propertyTitle?.toLowerCase().includes(searchTerm) ||
          conv.lastMessage?.content.toLowerCase().includes(searchTerm)
        );
      }
    }

    // Sort by last message timestamp
    return conversations.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || a.updatedAt;
      const bTime = b.lastMessage?.timestamp || b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }

  // Get messages for a conversation
  getMessages(conversationId: string, limit: number = 50, offset: number = 0): Message[] {
    const messages = this.messages.get(conversationId) || [];
    
    // Sort by timestamp (oldest first)
    const sortedMessages = messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedMessages.slice(offset, offset + limit);
  }

  // Send a message
  sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', metadata?: Message['metadata']): Message {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: this.currentUserId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      metadata,
    };

    // Add message to conversation
    const conversationMessages = this.messages.get(conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(conversationId, conversationMessages);

    // Update conversation
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = new Date().toISOString();
      
      // Update unread count for other participants
      conversation.participants.forEach(participant => {
        if (participant.id !== this.currentUserId) {
          conversation.unreadCount++;
        }
      });
    }

    // Create notification for other participants
    this.createNotification(conversationId, 'message', content);

    return message;
  }

  // Mark messages as read
  markMessagesAsRead(conversationId: string, messageIds?: string[]): void {
    const messages = this.messages.get(conversationId) || [];
    
    if (messageIds) {
      // Mark specific messages as read
      messageIds.forEach(messageId => {
        const message = messages.find(m => m.id === messageId);
        if (message && message.senderId !== this.currentUserId) {
          message.read = true;
        }
      });
    } else {
      // Mark all messages in conversation as read
      messages.forEach(message => {
        if (message.senderId !== this.currentUserId) {
          message.read = true;
        }
      });
    }

    // Update conversation unread count
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
  }

  // Start typing indicator
  startTyping(conversationId: string): void {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const typingUsers = this.typingUsers.get(conversationId) || new Set();
    typingUsers.add(this.currentUserId);
    this.typingUsers.set(conversationId, typingUsers);

    // Notify other participants
    this.createNotification(conversationId, 'typing', 'is typing...');
  }

  // Stop typing indicator
  stopTyping(conversationId: string): void {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    const typingUsers = this.typingUsers.get(conversationId) || new Set();
    typingUsers.delete(this.currentUserId);
    this.typingUsers.set(conversationId, typingUsers);
  }

  // Get typing users for a conversation
  getTypingUsers(conversationId: string): User[] {
    const typingUserIds = this.typingUsers.get(conversationId) || new Set();
    const typingUsers: User[] = [];
    
    typingUserIds.forEach(userId => {
      if (userId !== this.currentUserId) {
        const user = this.users.get(userId);
        if (user) {
          typingUsers.push(user);
        }
      }
    });

    return typingUsers;
  }

  // Create or get conversation
  getOrCreateConversation(participantId: string, propertyId?: string): Conversation {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    // Check if conversation already exists
    const existingConversation = Array.from(this.conversations.values()).find(conv =>
      conv.participants.length === 2 &&
      conv.participants.some(p => p.id === this.currentUserId) &&
      conv.participants.some(p => p.id === participantId) &&
      conv.type === 'direct'
    );

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const participant = this.users.get(participantId);
    const currentUser = this.users.get(this.currentUserId);
    
    if (!participant || !currentUser) {
      throw new Error('Participant or current user not found');
    }

    const conversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [currentUser, participant],
      type: 'direct',
      propertyId,
      status: 'active',
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.set(conversation.id, conversation);
    this.messages.set(conversation.id, []);

    return conversation;
  }

  // Get user by ID
  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  // Get conversation by ID
  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  // Archive conversation
  archiveConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.status = 'archived';
      conversation.updatedAt = new Date().toISOString();
    }
  }

  // Unarchive conversation
  unarchiveConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.status = 'active';
      conversation.updatedAt = new Date().toISOString();
    }
  }

  // Block user
  blockUser(userId: string): void {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    // Find conversation with this user
    const conversation = Array.from(this.conversations.values()).find(conv =>
      conv.participants.some(p => p.id === this.currentUserId) &&
      conv.participants.some(p => p.id === userId) &&
      conv.type === 'direct'
    );

    if (conversation) {
      conversation.status = 'blocked';
      conversation.updatedAt = new Date().toISOString();
    }
  }

  // Unblock user
  unblockUser(userId: string): void {
    if (!this.currentUserId) {
      throw new Error('No current user set');
    }

    // Find conversation with this user
    const conversation = Array.from(this.conversations.values()).find(conv =>
      conv.participants.some(p => p.id === this.currentUserId) &&
      conv.participants.some(p => p.id === userId) &&
      conv.type === 'direct'
    );

    if (conversation) {
      conversation.status = 'active';
      conversation.updatedAt = new Date().toISOString();
    }
  }

  // Create notification
  private createNotification(conversationId: string, type: ChatNotification['type'], content: string): void {
    const notification: ChatNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      conversationId,
      userId: this.currentUserId!,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.push(notification);
  }

  // Get notifications
  getNotifications(): ChatNotification[] {
    return this.notifications.filter(notif => !notif.read);
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  // Search messages
  searchMessages(query: string, conversationId?: string): Message[] {
    let messages: Message[] = [];

    if (conversationId) {
      messages = this.messages.get(conversationId) || [];
    } else {
      // Search all conversations for current user
      const userConversations = this.getConversations();
      userConversations.forEach(conv => {
        const convMessages = this.messages.get(conv.id) || [];
        messages.push(...convMessages);
      });
    }

    const searchTerm = query.toLowerCase();
    return messages.filter(message =>
      message.content.toLowerCase().includes(searchTerm)
    );
  }

  // Get conversation statistics
  getConversationStats(): {
    totalConversations: number;
    unreadMessages: number;
    activeConversations: number;
    archivedConversations: number;
  } {
    const conversations = this.getConversations();
    
    return {
      totalConversations: conversations.length,
      unreadMessages: conversations.reduce((sum, conv) => sum + conv.unreadCount, 0),
      activeConversations: conversations.filter(conv => conv.status === 'active').length,
      archivedConversations: conversations.filter(conv => conv.status === 'archived').length,
    };
  }
}

// Export singleton instance
export const chatService = new ChatService();

// Initialize with mock data
chatService.initializeMockData();
