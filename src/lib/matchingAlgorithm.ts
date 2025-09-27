export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
  lifestyle: {
    cleanliness: number; // 1-5 scale
    socialLevel: number; // 1-5 scale
    noiseLevel: number; // 1-5 scale
    smoking: boolean;
    pets: boolean;
    earlyRiser: boolean;
    partyLover: boolean;
    fitness: boolean;
    cooking: boolean;
    gaming: boolean;
    reading: boolean;
    music: boolean;
    travel: boolean;
  };
  preferences: {
    budget: { min: number; max: number };
    location: string[];
    propertyType: string[];
    moveInDate: string;
    duration: number; // months
  };
  compatibility: number;
  lastActive: string;
}

export interface PropertyProfile {
  id: string;
  hostId: string;
  title: string;
  location: string;
  propertyType: string;
  rent: number;
  availableSlots: number;
  totalSlots: number;
  moveInDate: string;
  amenities: string[];
  houseRules: string[];
  images: string[];
  host: {
    id: string;
    name: string;
    age: number;
    bio: string;
    lifestyle: UserProfile['lifestyle'];
    verified: boolean;
    rating: number;
  };
}

export interface MatchResult {
  user: UserProfile;
  property: PropertyProfile;
  compatibilityScore: number;
  matchingFactors: {
    lifestyle: number;
    budget: number;
    location: number;
    preferences: number;
    availability: number;
    hostCompatibility: number;
  };
  reasoning: string[];
  recommendations: string[];
}

class AdvancedMatchingAlgorithm {
  private weights = {
    lifestyle: 0.25,
    budget: 0.20,
    location: 0.15,
    preferences: 0.15,
    availability: 0.10,
    hostCompatibility: 0.15
  };

  calculateLifestyleCompatibility(user: UserProfile, host: UserProfile): number {
    const lifestyle = user.lifestyle;
    const hostLifestyle = host.lifestyle;
    
    let score = 0;
    let factors = 0;

    // Cleanliness compatibility
    const cleanlinessDiff = Math.abs(lifestyle.cleanliness - hostLifestyle.cleanliness);
    score += Math.max(0, 1 - cleanlinessDiff / 4); // 4 is max difference
    factors++;

    // Social level compatibility
    const socialDiff = Math.abs(lifestyle.socialLevel - hostLifestyle.socialLevel);
    score += Math.max(0, 1 - socialDiff / 4);
    factors++;

    // Noise level compatibility
    const noiseDiff = Math.abs(lifestyle.noiseLevel - hostLifestyle.noiseLevel);
    score += Math.max(0, 1 - noiseDiff / 4);
    factors++;

    // Smoking compatibility
    if (lifestyle.smoking === hostLifestyle.smoking) {
      score += 1;
    } else {
      score += 0.3; // Some tolerance for differences
    }
    factors++;

    // Pets compatibility
    if (lifestyle.pets === hostLifestyle.pets) {
      score += 1;
    } else {
      score += 0.2; // Lower tolerance for pet differences
    }
    factors++;

    // Activity-based compatibility
    const activities = ['earlyRiser', 'partyLover', 'fitness', 'cooking', 'gaming', 'reading', 'music', 'travel'];
    activities.forEach(activity => {
      if (lifestyle[activity as keyof typeof lifestyle] === hostLifestyle[activity as keyof typeof hostLifestyle]) {
        score += 0.8;
      } else {
        score += 0.4; // Partial compatibility
      }
      factors++;
    });

    return (score / factors) * 100;
  }

  calculateBudgetCompatibility(user: UserProfile, property: PropertyProfile): number {
    const userBudget = user.preferences.budget;
    const propertyRent = property.rent;

    if (propertyRent >= userBudget.min && propertyRent <= userBudget.max) {
      // Perfect match within budget
      const budgetRange = userBudget.max - userBudget.min;
      const distanceFromMin = propertyRent - userBudget.min;
      const optimalPosition = distanceFromMin / budgetRange;
      
      // Prefer properties closer to the lower end of budget
      return Math.max(80, 100 - (optimalPosition * 20));
    } else if (propertyRent < userBudget.min) {
      // Below budget - still good but not ideal
      return Math.max(60, 80 - ((userBudget.min - propertyRent) / userBudget.min * 20));
    } else {
      // Above budget - poor match
      const overBudget = propertyRent - userBudget.max;
      const budgetRatio = overBudget / userBudget.max;
      return Math.max(0, 50 - (budgetRatio * 50));
    }
  }

  calculateLocationCompatibility(user: UserProfile, property: PropertyProfile): number {
    const userLocations = user.preferences.location.map(loc => loc.toLowerCase());
    const propertyLocation = property.location.toLowerCase();

    // Exact match
    if (userLocations.includes(propertyLocation)) {
      return 100;
    }

    // Partial match (area-based)
    let bestMatch = 0;
    userLocations.forEach(userLoc => {
      if (propertyLocation.includes(userLoc) || userLoc.includes(propertyLocation)) {
        bestMatch = Math.max(bestMatch, 80);
      }
    });

    // City-level match
    const userCities = userLocations.map(loc => loc.split(',')[0].trim());
    const propertyCity = propertyLocation.split(',')[0].trim();
    
    if (userCities.includes(propertyCity)) {
      bestMatch = Math.max(bestMatch, 70);
    }

    return bestMatch || 30; // Default compatibility for different locations
  }

  calculatePreferencesCompatibility(user: UserProfile, property: PropertyProfile): number {
    const userPrefs = user.preferences;
    let score = 0;
    let factors = 0;

    // Property type match
    if (userPrefs.propertyType.includes(property.propertyType)) {
      score += 100;
    } else {
      score += 30; // Some tolerance
    }
    factors++;

    // Move-in date compatibility
    const userMoveIn = new Date(userPrefs.moveInDate);
    const propertyMoveIn = new Date(property.moveInDate);
    const daysDiff = Math.abs((userMoveIn.getTime() - propertyMoveIn.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      score += 100;
    } else if (daysDiff <= 30) {
      score += 80;
    } else if (daysDiff <= 60) {
      score += 60;
    } else {
      score += 40;
    }
    factors++;

    return score / factors;
  }

  calculateAvailabilityCompatibility(user: UserProfile, property: PropertyProfile): number {
    // Check if property has available slots
    if (property.availableSlots <= 0) {
      return 0;
    }

    // Prefer properties with more available slots (more flexibility)
    const availabilityRatio = property.availableSlots / property.totalSlots;
    
    if (availabilityRatio >= 0.5) {
      return 100;
    } else if (availabilityRatio >= 0.25) {
      return 80;
    } else {
      return 60;
    }
  }

  calculateHostCompatibility(user: UserProfile, host: UserProfile): number {
    // Age compatibility (prefer similar age groups)
    const ageDiff = Math.abs(user.age - host.age);
    let ageScore = 100;
    if (ageDiff > 10) ageScore = 80;
    if (ageDiff > 20) ageScore = 60;
    if (ageDiff > 30) ageScore = 40;

    // Host rating
    const ratingScore = host.rating * 20; // Convert 5-star to 100-point scale

    // Verification status
    const verificationScore = host.verified ? 100 : 70;

    // Bio compatibility (basic keyword matching)
    const userInterests = user.interests.map(i => i.toLowerCase());
    const hostBio = host.bio.toLowerCase();
    let bioScore = 50; // Base score
    userInterests.forEach(interest => {
      if (hostBio.includes(interest)) {
        bioScore += 10;
      }
    });
    bioScore = Math.min(100, bioScore);

    return (ageScore * 0.3 + ratingScore * 0.3 + verificationScore * 0.2 + bioScore * 0.2);
  }

  generateMatchReasoning(factors: MatchResult['matchingFactors'], user: UserProfile, property: PropertyProfile): string[] {
    const reasoning: string[] = [];

    if (factors.lifestyle >= 80) {
      reasoning.push("Excellent lifestyle compatibility - similar cleanliness and social preferences");
    } else if (factors.lifestyle >= 60) {
      reasoning.push("Good lifestyle match with some differences in preferences");
    } else {
      reasoning.push("Lifestyle compatibility could be improved");
    }

    if (factors.budget >= 90) {
      reasoning.push("Perfect budget match within your range");
    } else if (factors.budget >= 70) {
      reasoning.push("Good budget compatibility");
    } else if (factors.budget < 50) {
      reasoning.push("Budget may be above your preferred range");
    }

    if (factors.location >= 90) {
      reasoning.push("Ideal location match");
    } else if (factors.location >= 70) {
      reasoning.push("Good location compatibility");
    } else {
      reasoning.push("Location is different from your preferences");
    }

    if (factors.hostCompatibility >= 80) {
      reasoning.push("Great host compatibility with verified profile");
    } else if (factors.hostCompatibility >= 60) {
      reasoning.push("Good host match");
    }

    if (factors.availability >= 80) {
      reasoning.push("Multiple slots available for flexible move-in");
    } else if (factors.availability < 60) {
      reasoning.push("Limited availability - act quickly");
    }

    return reasoning;
  }

  generateRecommendations(factors: MatchResult['matchingFactors'], user: UserProfile, property: PropertyProfile): string[] {
    const recommendations: string[] = [];

    if (factors.lifestyle < 70) {
      recommendations.push("Consider discussing lifestyle preferences with the host");
    }

    if (factors.budget > user.preferences.budget.max) {
      recommendations.push("Budget exceeds your range - negotiate or reconsider budget");
    }

    if (factors.availability < 50) {
      recommendations.push("Limited availability - schedule viewing soon");
    }

    if (factors.hostCompatibility < 70) {
      recommendations.push("Ask detailed questions about host expectations");
    }

    recommendations.push("Schedule a viewing to assess real-world compatibility");
    recommendations.push("Discuss house rules and expectations in detail");

    return recommendations;
  }

  calculateMatch(user: UserProfile, property: PropertyProfile): MatchResult {
    const lifestyleScore = this.calculateLifestyleCompatibility(user, property.host);
    const budgetScore = this.calculateBudgetCompatibility(user, property);
    const locationScore = this.calculateLocationCompatibility(user, property);
    const preferencesScore = this.calculatePreferencesCompatibility(user, property);
    const availabilityScore = this.calculateAvailabilityCompatibility(user, property);
    const hostScore = this.calculateHostCompatibility(user, property.host);

    const matchingFactors = {
      lifestyle: lifestyleScore,
      budget: budgetScore,
      location: locationScore,
      preferences: preferencesScore,
      availability: availabilityScore,
      hostCompatibility: hostScore
    };

    const compatibilityScore = 
      lifestyleScore * this.weights.lifestyle +
      budgetScore * this.weights.budget +
      locationScore * this.weights.location +
      preferencesScore * this.weights.preferences +
      availabilityScore * this.weights.availability +
      hostScore * this.weights.hostCompatibility;

    const reasoning = this.generateMatchReasoning(matchingFactors, user, property);
    const recommendations = this.generateRecommendations(matchingFactors, user, property);

    return {
      user,
      property,
      compatibilityScore: Math.round(compatibilityScore),
      matchingFactors,
      reasoning,
      recommendations
    };
  }

  findBestMatches(user: UserProfile, properties: PropertyProfile[], limit: number = 10): MatchResult[] {
    const matches = properties.map(property => this.calculateMatch(user, property));
    
    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Filter out very low compatibility matches
    return matches.filter(match => match.compatibilityScore >= 30).slice(0, limit);
  }

  findCompatibleUsers(property: PropertyProfile, users: UserProfile[], limit: number = 10): MatchResult[] {
    const matches = users.map(user => this.calculateMatch(user, property));
    
    // Sort by compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    // Filter out very low compatibility matches
    return matches.filter(match => match.compatibilityScore >= 30).slice(0, limit);
  }
}

export const matchingAlgorithm = new AdvancedMatchingAlgorithm();

// Helper functions for data transformation
export function transformUserToProfile(user: any): UserProfile {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    gender: user.gender,
    bio: user.bio,
    interests: user.interests || [],
    lifestyle: {
      cleanliness: user.cleanliness || 3,
      socialLevel: user.socialLevel || 3,
      noiseLevel: user.noiseLevel || 3,
      smoking: user.smoking || false,
      pets: user.pets || false,
      earlyRiser: user.earlyRiser || false,
      partyLover: user.partyLover || false,
      fitness: user.fitness || false,
      cooking: user.cooking || false,
      gaming: user.gaming || false,
      reading: user.reading || false,
      music: user.music || false,
      travel: user.travel || false,
    },
    preferences: {
      budget: user.budget || { min: 0, max: 50000 },
      location: user.preferredLocation ? [user.preferredLocation] : [],
      propertyType: user.propertyType || ['any'],
      moveInDate: user.moveInDate || new Date().toISOString(),
      duration: user.duration || 12,
    },
    compatibility: 0,
    lastActive: new Date().toISOString(),
  };
}

export function transformPropertyToProfile(property: any): PropertyProfile {
  return {
    id: property.id,
    hostId: property.hostId,
    title: property.title,
    location: property.location,
    propertyType: property.propertyType,
    rent: property.rent,
    availableSlots: property.availableSlots,
    totalSlots: property.totalSlots,
    moveInDate: property.moveInDate,
    amenities: property.amenities || [],
    houseRules: property.houseRules || [],
    images: property.images || [],
    host: {
      id: property.host.id,
      name: property.host.name,
      age: property.host.age,
      bio: property.host.bio,
      lifestyle: property.host.lifestyle,
      verified: property.host.verified,
      rating: property.host.rating,
    },
  };
}
