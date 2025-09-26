import { create } from 'zustand';
import { Profile } from '@/lib/mockData';

export interface SwipeAction {
  profile: Profile;
  action: 'like' | 'dislike' | 'superlike';
  timestamp: number;
}

interface DeckStore {
  // Queue of profiles to show
  queue: Profile[];
  
  // History for undo functionality
  history: SwipeAction[];
  
  // Matches (mutual likes)
  matches: Profile[];
  
  // Current user profile
  currentUser: Profile;
  
  // Actions
  swipeProfile: (profile: Profile, action: 'like' | 'dislike' | 'superlike') => void;
  undoLastSwipe: () => void;
  addToMatches: (profile: Profile) => void;
  removeFromQueue: (profileId: string) => void;
  resetDeck: () => void;
  setCurrentUser: (user: Profile) => void;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  queue: [],
  history: [],
  matches: [],
  currentUser: {
    id: 'current-user',
    name: 'You',
    age: 24,
    bio: 'Looking for a compatible roommate who shares similar interests and lifestyle.',
    college: 'Local University',
    interests: ['music', 'cooking', 'early-riser', 'neat-freak'],
    photos: ['https://picsum.photos/seed/current-user-1/600/800'],
    distanceKm: 0,
    match: false
  },

  swipeProfile: (profile, action) => {
    const { queue, history, matches } = get();
    
    // Add to history for undo
    const swipeAction: SwipeAction = {
      profile,
      action,
      timestamp: Date.now()
    };
    
    // Remove from queue
    const newQueue = queue.filter(p => p.id !== profile.id);
    
    // If it's a like and the profile has match: true, add to matches
    let newMatches = [...matches];
    if (action === 'like' && profile.match) {
      newMatches.push(profile);
    }
    
    set({
      queue: newQueue,
      history: [...history, swipeAction],
      matches: newMatches
    });
  },

  undoLastSwipe: () => {
    const { queue, history, matches } = get();
    
    if (history.length === 0) return;
    
    const lastAction = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    
    // Add profile back to front of queue
    const newQueue = [lastAction.profile, ...queue];
    
    // Remove from matches if it was there
    let newMatches = matches;
    if (lastAction.action === 'like' && lastAction.profile.match) {
      newMatches = matches.filter(p => p.id !== lastAction.profile.id);
    }
    
    set({
      queue: newQueue,
      history: newHistory,
      matches: newMatches
    });
  },

  addToMatches: (profile) => {
    const { matches } = get();
    if (!matches.find(p => p.id === profile.id)) {
      set({ matches: [...matches, profile] });
    }
  },

  removeFromQueue: (profileId) => {
    const { queue } = get();
    set({ queue: queue.filter(p => p.id !== profileId) });
  },

  resetDeck: () => {
    set({
      queue: [],
      history: [],
      matches: []
    });
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
  }
}));
