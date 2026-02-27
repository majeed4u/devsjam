/**
 * Performance monitoring utility
 * Tracks API response times and database query performance
 */

type PerformanceMetric = {
  path: string;
  method: string;
  duration: number;
  timestamp: number;
  status: number;
};

type DatabaseQueryMetric = {
  operation: string;
  duration: number;
  timestamp: number;
};

const metrics: PerformanceMetric[] = [];
const queryMetrics: DatabaseQueryMetric[] = [];
const MAX_METRICS = 1000; // Keep last 1000 metrics

/**
 * Record API request performance
 */
export function recordMetric(metric: PerformanceMetric) {
  metrics.push(metric);

  // Keep only the last MAX_METRICS
  if (metrics.length > MAX_METRICS) {
    metrics.shift();
  }

  // Log slow requests (> 1 second)
  if (metric.duration > 1000) {
    console.warn(`🐌 Slow request: ${metric.method} ${metric.path} - ${metric.duration}ms`);
  }
}

/**
 * Record database query performance
 */
export function recordQueryMetric(metric: DatabaseQueryMetric) {
  queryMetrics.push(metric);

  if (queryMetrics.length > MAX_METRICS) {
    queryMetrics.shift();
  }

  // Log slow queries (> 100ms)
  if (metric.duration > 100) {
    console.warn(`🐌 Slow query: ${metric.operation} - ${metric.duration}ms`);
  }
}

/**
 * Get performance statistics
 */
export function getPerformanceStats() {
  const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
  const slowRequests = metrics.filter((m) => m.duration > 1000);
  const avgQueryDuration = queryMetrics.reduce((sum, m) => sum + m.duration, 0) / queryMetrics.length;
  const slowQueries = queryMetrics.filter((m) => m.duration > 100);

  return {
    requests: {
      total: metrics.length,
      avgDuration: Math.round(avgDuration),
      slowRequests: slowRequests.length,
      p95Duration: calculatePercentile(metrics, 95),
      p99Duration: calculatePercentile(metrics, 99),
    },
    queries: {
      total: queryMetrics.length,
      avgDuration: Math.round(avgQueryDuration),
      slowQueries: slowQueries.length,
      p95Duration: calculatePercentile(queryMetrics, 95),
      p99Duration: calculatePercentile(queryMetrics, 99),
    },
  };
}

/**
 * Calculate percentile from metrics
 */
function calculatePercentile(
  metricArray: Array<{ duration: number }>,
  percentile: number,
): number {
  if (metricArray.length === 0) return 0;

  const sorted = [...metricArray].sort((a, b) => a.duration - b.duration);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return Math.round(sorted[index]?.duration || 0);
}

/**
 * Get recent slow requests
 */
export function getSlowRequests(limit = 10) {
  return metrics
    .filter((m) => m.duration > 500)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit)
    .map((m) => ({
      ...m,
      slowBy: m.duration > 1000 ? "1s+" : "500ms+",
    }));
}

/**
 * Get recent slow queries
 */
export function getSlowQueries(limit = 10) {
  return queryMetrics
    .filter((m) => m.duration > 50)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
}

/**
 * Clear all metrics
 */
export function clearMetrics() {
  metrics.length = 0;
  queryMetrics.length = 0;
}
