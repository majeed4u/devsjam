/**
 * Simple in-memory cache for development
 * TODO: Replace with Redis for production
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Get cached data
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  console.log(`✅ Cache HIT: ${key}`);
  return entry.data as T;
}

/**
 * Set cached data with TTL (in seconds)
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttl: number = 300,
): Promise<void> {
  const expiresAt = Date.now() + ttl * 1000;
  cache.set(key, { data: value, expiresAt });
  console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
}

/**
 * Delete cached data
 */
export async function cacheDelete(key: string): Promise<void> {
  cache.delete(key);
  console.log(`🗑️  Cache DELETE: ${key}`);
}

/**
 * Delete multiple cache keys by pattern
 */
export async function cacheDeletePattern(pattern: string): Promise<void> {
  const keys = Array.from(cache.keys());
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
  console.log(`🗑️  Cache DELETE pattern: ${pattern}`);
}

/**
 * Clear all cache
 */
export async function cacheClear(): Promise<void> {
  cache.clear();
  console.log("🧹 Cache CLEARED");
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
