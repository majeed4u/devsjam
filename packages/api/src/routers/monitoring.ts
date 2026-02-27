import { z } from "zod";
import { protectedProcedure } from "../index";
import {
  clearMetrics,
  getPerformanceStats,
  getSlowQueries,
  getSlowRequests,
} from "../lib/monitoring";

export const monitoringRouter = {
  // Get performance statistics
  getStats: protectedProcedure.handler(async () => {
    return getPerformanceStats();
  }),

  // Get slow requests
  getSlowRequests: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(10) }))
    .handler(async ({ input }) => {
      return getSlowRequests(input.limit);
    }),

  // Get slow queries
  getSlowQueries: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(10) }))
    .handler(async ({ input }) => {
      return getSlowQueries(input.limit);
    }),

  // Clear metrics (admin only)
  clearMetrics: protectedProcedure.handler(async () => {
    clearMetrics();
    return { success: true, message: "Metrics cleared" };
  }),
};
