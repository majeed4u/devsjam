import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { orpc } from "@/utils/orpc";

const VIEW_STORAGE_KEY = "devjams_post_views";
const VIEW_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

interface ViewStorage {
  [postId: string]: number; // timestamp of last view
}

/**
 * Hook to track post views with client-side rate limiting
 * Only increments view count once per hour per post per browser
 */
export function useIncrementViews(postId: string | undefined) {
  const hasTrackedRef = useRef(false);

  // Get viewed posts from localStorage
  const getViewedPosts = (): ViewStorage => {
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // Save viewed posts to localStorage
  const saveViewedPosts = (views: ViewStorage) => {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(views));
    } catch (e) {
      console.warn("Failed to save view tracking to localStorage:", e);
    }
  };

  // Check if post should be tracked (respecting cooldown)
  const shouldTrackView = (): boolean => {
    if (!postId) return false; // No postId, don't track

    const viewedPosts = getViewedPosts();
    const lastViewed = viewedPosts[postId];

    if (!lastViewed) {
      return true; // Never viewed
    }

    const now = Date.now();
    return now - lastViewed > VIEW_COOLDOWN;
  };

  // Mark post as viewed
  const markAsViewed = () => {
    if (!postId) return; // No postId, don't mark

    const viewedPosts = getViewedPosts();
    viewedPosts[postId] = Date.now();

    // Clean up old entries (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * VIEW_COOLDOWN;
    const cleaned = Object.fromEntries(
      Object.entries(viewedPosts).filter(([_, timestamp]) => timestamp > thirtyDaysAgo),
    );

    saveViewedPosts(cleaned);
  };

  // Mutation to increment views
  const incrementViews = useMutation(
    orpc.post.incrementViews.mutationOptions({
      onSuccess: () => {
        markAsViewed();
      },
      onError: (error) => {
        console.warn("Failed to increment views:", error);
      },
    }),
  );

  // Effect to track view on mount
  useEffect(() => {
    // Only track once per component mount
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    // Check if we should track this view
    if (!shouldTrackView()) {
      return;
    }

    // Increment views
    if (postId) {
      incrementViews.mutate({ postId });
    }
  }, [postId]);

  return {
    isSuccess: incrementViews.isSuccess,
    isPending: incrementViews.isPending,
  };
}
