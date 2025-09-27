import { useState, useEffect, useCallback } from 'react';
import { matchingService, MatchingFilters, MatchResult } from '@/lib/matchingService';

export interface UseMatchingOptions {
  userId: string;
  filters?: MatchingFilters;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseMatchingReturn {
  matches: MatchResult[];
  loading: boolean;
  error: string | null;
  refreshMatches: () => Promise<void>;
  searchMatches: (query: string) => MatchResult[];
  getMatchDetails: (propertyId: string) => MatchResult | null;
  getCompatibilityBreakdown: (propertyId: string) => MatchResult['matchingFactors'] | null;
  getMatchReasoning: (propertyId: string) => string[] | null;
  getMatchRecommendations: (propertyId: string) => string[] | null;
  updateFilters: (newFilters: MatchingFilters) => Promise<void>;
  getMatchStatistics: () => {
    totalMatches: number;
    averageCompatibility: number;
    topCategories: Array<{ category: string; score: number }>;
    recommendations: string[];
  };
}

export function useMatching({
  userId,
  filters = {},
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}: UseMatchingOptions): UseMatchingReturn {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<MatchingFilters>(filters);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newMatches = matchingService.getMatchesForUser(userId, currentFilters);
      setMatches(newMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, currentFilters]);

  const refreshMatches = useCallback(async () => {
    await loadMatches();
  }, [loadMatches]);

  const searchMatches = useCallback((query: string): MatchResult[] => {
    if (!query.trim()) {
      return matches;
    }
    return matchingService.searchMatches(userId, query);
  }, [matches, userId]);

  const getMatchDetails = useCallback((propertyId: string): MatchResult | null => {
    return matchingService.getMatchDetails(userId, propertyId);
  }, [userId]);

  const getCompatibilityBreakdown = useCallback((propertyId: string): MatchResult['matchingFactors'] | null => {
    return matchingService.getCompatibilityBreakdown(userId, propertyId);
  }, [userId]);

  const getMatchReasoning = useCallback((propertyId: string): string[] | null => {
    return matchingService.getMatchReasoning(userId, propertyId);
  }, [userId]);

  const getMatchRecommendations = useCallback((propertyId: string): string[] | null => {
    return matchingService.getMatchRecommendations(userId, propertyId);
  }, [userId]);

  const updateFilters = useCallback(async (newFilters: MatchingFilters) => {
    setCurrentFilters(newFilters);
    await loadMatches();
  }, [loadMatches]);

  const getMatchStatistics = useCallback(() => {
    return matchingService.getMatchStatistics(userId);
  }, [userId]);

  // Load matches on mount and when dependencies change
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadMatches();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadMatches]);

  return {
    matches,
    loading,
    error,
    refreshMatches,
    searchMatches,
    getMatchDetails,
    getCompatibilityBreakdown,
    getMatchReasoning,
    getMatchRecommendations,
    updateFilters,
    getMatchStatistics
  };
}

// Hook for property owners to find compatible users
export interface UsePropertyMatchingOptions {
  propertyId: string;
  filters?: MatchingFilters;
}

export interface UsePropertyMatchingReturn {
  compatibleUsers: MatchResult[];
  loading: boolean;
  error: string | null;
  refreshCompatibleUsers: () => Promise<void>;
  getCompatibleUserDetails: (userId: string) => MatchResult | null;
  updateFilters: (newFilters: MatchingFilters) => Promise<void>;
}

export function usePropertyMatching({
  propertyId,
  filters = {}
}: UsePropertyMatchingOptions): UsePropertyMatchingReturn {
  const [compatibleUsers, setCompatibleUsers] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<MatchingFilters>(filters);

  const loadCompatibleUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const users = matchingService.getCompatibleUsersForProperty(propertyId, currentFilters);
      setCompatibleUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load compatible users');
      console.error('Error loading compatible users:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId, currentFilters]);

  const refreshCompatibleUsers = useCallback(async () => {
    await loadCompatibleUsers();
  }, [loadCompatibleUsers]);

  const getCompatibleUserDetails = useCallback((userId: string): MatchResult | null => {
    return compatibleUsers.find(match => match.user.id === userId) || null;
  }, [compatibleUsers]);

  const updateFilters = useCallback(async (newFilters: MatchingFilters) => {
    setCurrentFilters(newFilters);
    await loadCompatibleUsers();
  }, [loadCompatibleUsers]);

  useEffect(() => {
    loadCompatibleUsers();
  }, [loadCompatibleUsers]);

  return {
    compatibleUsers,
    loading,
    error,
    refreshCompatibleUsers,
    getCompatibleUserDetails,
    updateFilters
  };
}

// Hook for match statistics and analytics
export interface UseMatchAnalyticsOptions {
  userId: string;
}

export interface UseMatchAnalyticsReturn {
  statistics: {
    totalMatches: number;
    averageCompatibility: number;
    topCategories: Array<{ category: string; score: number }>;
    recommendations: string[];
  };
  loading: boolean;
  error: string | null;
  refreshStatistics: () => void;
}

export function useMatchAnalytics({ userId }: UseMatchAnalyticsOptions): UseMatchAnalyticsReturn {
  const [statistics, setStatistics] = useState({
    totalMatches: 0,
    averageCompatibility: 0,
    topCategories: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStatistics = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = matchingService.getMatchStatistics(userId);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshStatistics();
  }, [refreshStatistics]);

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  };
}
