import { matchingAlgorithm, transformUserToProfile, transformPropertyToProfile, UserProfile, PropertyProfile, MatchResult } from './matchingAlgorithm';

export interface MatchingFilters {
  minCompatibility?: number;
  maxBudget?: number;
  location?: string[];
  propertyType?: string[];
  amenities?: string[];
  moveInDate?: string;
  hostVerified?: boolean;
  minHostRating?: number;
}

export class MatchingService {
  private users: UserProfile[] = [];
  private properties: PropertyProfile[] = [];
  private matches: Map<string, MatchResult[]> = new Map();

  // Initialize with mock data
  initializeMockData() {
    this.users = [
      {
        id: 'user1',
        name: 'Alex Johnson',
        age: 25,
        gender: 'male',
        bio: 'Software engineer who loves fitness and cooking. Looking for a clean, organized living space.',
        interests: ['fitness', 'cooking', 'gaming', 'music'],
        lifestyle: {
          cleanliness: 5,
          socialLevel: 3,
          noiseLevel: 2,
          smoking: false,
          pets: false,
          earlyRiser: true,
          partyLover: false,
          fitness: true,
          cooking: true,
          gaming: true,
          reading: false,
          music: true,
          travel: false,
        },
        preferences: {
          budget: { min: 15000, max: 25000 },
          location: ['bandra west', 'andheri west'],
          propertyType: ['2bhk', '3bhk'],
          moveInDate: '2024-02-01',
          duration: 12,
        },
        compatibility: 0,
        lastActive: new Date().toISOString(),
      },
      {
        id: 'user2',
        name: 'Priya Sharma',
        age: 23,
        gender: 'female',
        bio: 'Design student who loves art and reading. Prefers quiet environments.',
        interests: ['art', 'reading', 'music', 'travel'],
        lifestyle: {
          cleanliness: 4,
          socialLevel: 2,
          noiseLevel: 1,
          smoking: false,
          pets: true,
          earlyRiser: false,
          partyLover: false,
          fitness: false,
          cooking: false,
          gaming: false,
          reading: true,
          music: true,
          travel: true,
        },
        preferences: {
          budget: { min: 10000, max: 20000 },
          location: ['powai', 'andheri east'],
          propertyType: ['1bhk', 'studio'],
          moveInDate: '2024-01-15',
          duration: 6,
        },
        compatibility: 0,
        lastActive: new Date().toISOString(),
      },
    ];

    this.properties = [
      {
        id: 'prop1',
        hostId: 'host1',
        title: 'Modern 2BHK in Bandra West',
        location: 'Bandra West, Mumbai',
        propertyType: '2bhk',
        rent: 22000,
        availableSlots: 2,
        totalSlots: 4,
        moveInDate: '2024-02-01',
        amenities: ['wifi', 'ac', 'parking', 'gym'],
        houseRules: ['no smoking', 'no pets', 'quiet hours after 11pm'],
        images: ['https://picsum.photos/seed/prop1-1/600/800'],
        host: {
          id: 'host1',
          name: 'Raj Patel',
          age: 28,
          bio: 'Marketing professional who loves fitness and cooking. Looking for like-minded roommates.',
          lifestyle: {
            cleanliness: 5,
            socialLevel: 3,
            noiseLevel: 2,
            smoking: false,
            pets: false,
            earlyRiser: true,
            partyLover: false,
            fitness: true,
            cooking: true,
            gaming: false,
            reading: false,
            music: true,
            travel: false,
          },
          verified: true,
          rating: 4.8,
        },
      },
      {
        id: 'prop2',
        hostId: 'host2',
        title: 'Cozy Studio in Andheri West',
        location: 'Andheri West, Mumbai',
        propertyType: 'studio',
        rent: 18000,
        availableSlots: 1,
        totalSlots: 2,
        moveInDate: '2024-01-20',
        amenities: ['wifi', 'ac', 'kitchen'],
        houseRules: ['no smoking', 'pets welcome', 'keep noise low'],
        images: ['https://picsum.photos/seed/prop2-1/600/800'],
        host: {
          id: 'host2',
          name: 'Aisha Khan',
          age: 26,
          bio: 'Artist and yoga instructor. Loves plants and sustainable living.',
          lifestyle: {
            cleanliness: 4,
            socialLevel: 2,
            noiseLevel: 1,
            smoking: false,
            pets: true,
            earlyRiser: false,
            partyLover: false,
            fitness: true,
            cooking: true,
            gaming: false,
            reading: true,
            music: true,
            travel: true,
          },
          verified: true,
          rating: 4.6,
        },
      },
    ];
  }

  // Get matches for a specific user
  getMatchesForUser(userId: string, filters?: MatchingFilters): MatchResult[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    let properties = [...this.properties];

    // Apply filters
    if (filters) {
      properties = this.applyFilters(properties, filters);
    }

    const matches = matchingAlgorithm.findBestMatches(user, properties, 20);
    
    // Cache matches
    this.matches.set(userId, matches);
    
    return matches;
  }

  // Get compatible users for a specific property
  getCompatibleUsersForProperty(propertyId: string, filters?: MatchingFilters): MatchResult[] {
    const property = this.properties.find(p => p.id === propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    let users = [...this.users];

    // Apply filters
    if (filters) {
      users = users.filter(user => {
        if (filters.minCompatibility && user.compatibility < filters.minCompatibility) {
          return false;
        }
        if (filters.maxBudget && user.preferences.budget.max > filters.maxBudget) {
          return false;
        }
        return true;
      });
    }

    const matches = matchingAlgorithm.findCompatibleUsers(property, users, 20);
    
    return matches;
  }

  // Apply filters to properties
  private applyFilters(properties: PropertyProfile[], filters: MatchingFilters): PropertyProfile[] {
    return properties.filter(property => {
      if (filters.maxBudget && property.rent > filters.maxBudget) {
        return false;
      }

      if (filters.location && filters.location.length > 0) {
        const propertyLocation = property.location.toLowerCase();
        const hasLocationMatch = filters.location.some(loc => 
          propertyLocation.includes(loc.toLowerCase())
        );
        if (!hasLocationMatch) {
          return false;
        }
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        if (!filters.propertyType.includes(property.propertyType)) {
          return false;
        }
      }

      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity =>
          property.amenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      if (filters.moveInDate) {
        const propertyMoveIn = new Date(property.moveInDate);
        const filterMoveIn = new Date(filters.moveInDate);
        const daysDiff = Math.abs((propertyMoveIn.getTime() - filterMoveIn.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) { // Allow 30 days tolerance
          return false;
        }
      }

      if (filters.hostVerified !== undefined) {
        if (property.host.verified !== filters.hostVerified) {
          return false;
        }
      }

      if (filters.minHostRating !== undefined) {
        if (property.host.rating < filters.minHostRating) {
          return false;
        }
      }

      return true;
    });
  }

  // Get cached matches for a user
  getCachedMatches(userId: string): MatchResult[] {
    return this.matches.get(userId) || [];
  }

  // Update user preferences and recalculate matches
  updateUserPreferences(userId: string, preferences: Partial<UserProfile['preferences']>): MatchResult[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.preferences = { ...user.preferences, ...preferences };
    user.lastActive = new Date().toISOString();

    // Recalculate matches
    return this.getMatchesForUser(userId);
  }

  // Update user lifestyle and recalculate matches
  updateUserLifestyle(userId: string, lifestyle: Partial<UserProfile['lifestyle']>): MatchResult[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.lifestyle = { ...user.lifestyle, ...lifestyle };
    user.lastActive = new Date().toISOString();

    // Recalculate matches
    return this.getMatchesForUser(userId);
  }

  // Get match details
  getMatchDetails(userId: string, propertyId: string): MatchResult | null {
    const matches = this.getCachedMatches(userId);
    return matches.find(match => match.property.id === propertyId) || null;
  }

  // Get compatibility breakdown
  getCompatibilityBreakdown(userId: string, propertyId: string): MatchResult['matchingFactors'] | null {
    const match = this.getMatchDetails(userId, propertyId);
    return match ? match.matchingFactors : null;
  }

  // Get match reasoning
  getMatchReasoning(userId: string, propertyId: string): string[] | null {
    const match = this.getMatchDetails(userId, propertyId);
    return match ? match.reasoning : null;
  }

  // Get match recommendations
  getMatchRecommendations(userId: string, propertyId: string): string[] | null {
    const match = this.getMatchDetails(userId, propertyId);
    return match ? match.recommendations : null;
  }

  // Search matches with text query
  searchMatches(userId: string, query: string): MatchResult[] {
    const matches = this.getCachedMatches(userId);
    const searchTerm = query.toLowerCase();

    return matches.filter(match => {
      const property = match.property;
      const host = property.host;

      return (
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.propertyType.toLowerCase().includes(searchTerm) ||
        host.name.toLowerCase().includes(searchTerm) ||
        host.bio.toLowerCase().includes(searchTerm) ||
        property.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
      );
    });
  }

  // Get trending matches (most compatible recently)
  getTrendingMatches(userId: string, limit: number = 5): MatchResult[] {
    const matches = this.getMatchesForUser(userId);
    return matches.slice(0, limit);
  }

  // Get similar users based on lifestyle
  getSimilarUsers(userId: string, limit: number = 5): UserProfile[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    const similarities = this.users
      .filter(u => u.id !== userId)
      .map(otherUser => ({
        user: otherUser,
        similarity: this.calculateUserSimilarity(user, otherUser)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.user);

    return similarities;
  }

  // Calculate similarity between two users
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    const lifestyle1 = user1.lifestyle;
    const lifestyle2 = user2.lifestyle;

    let similarity = 0;
    let factors = 0;

    // Compare lifestyle factors
    const lifestyleKeys = Object.keys(lifestyle1) as Array<keyof typeof lifestyle1>;
    lifestyleKeys.forEach(key => {
      if (typeof lifestyle1[key] === 'boolean') {
        if (lifestyle1[key] === lifestyle2[key]) {
          similarity += 1;
        }
      } else {
        const diff = Math.abs(Number(lifestyle1[key]) - Number(lifestyle2[key]));
        similarity += Math.max(0, 1 - diff / 4);
      }
      factors++;
    });

    // Compare interests
    const commonInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    const interestSimilarity = (commonInterests.length * 2) / (user1.interests.length + user2.interests.length);
    similarity += interestSimilarity * 2;
    factors += 2;

    return (similarity / factors) * 100;
  }

  // Get match statistics
  getMatchStatistics(userId: string): {
    totalMatches: number;
    averageCompatibility: number;
    topCategories: Array<{ category: string; score: number }>;
    recommendations: string[];
  } {
    const matches = this.getCachedMatches(userId);
    
    if (matches.length === 0) {
      return {
        totalMatches: 0,
        averageCompatibility: 0,
        topCategories: [],
        recommendations: ['Complete your profile to get better matches']
      };
    }

    const averageCompatibility = matches.reduce((sum, match) => sum + match.compatibilityScore, 0) / matches.length;

    // Calculate top categories
    const categoryScores = {
      lifestyle: 0,
      budget: 0,
      location: 0,
      preferences: 0,
      availability: 0,
      hostCompatibility: 0
    };

    matches.forEach(match => {
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category as keyof typeof categoryScores] += 
          match.matchingFactors[category as keyof typeof match.matchingFactors];
      });
    });

    const topCategories = Object.entries(categoryScores)
      .map(([category, score]) => ({
        category,
        score: Math.round(score / matches.length)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const recommendations: string[] = [];
    if (averageCompatibility < 70) {
      recommendations.push('Consider expanding your budget range');
      recommendations.push('Be more flexible with location preferences');
    }
    if (topCategories.find(c => c.category === 'lifestyle' && c.score < 60)) {
      recommendations.push('Update your lifestyle preferences for better matches');
    }
    if (topCategories.find(c => c.category === 'hostCompatibility' && c.score < 60)) {
      recommendations.push('Consider properties with verified hosts');
    }

    return {
      totalMatches: matches.length,
      averageCompatibility: Math.round(averageCompatibility),
      topCategories,
      recommendations
    };
  }
}

// Export singleton instance
export const matchingService = new MatchingService();

// Initialize with mock data
matchingService.initializeMockData();
