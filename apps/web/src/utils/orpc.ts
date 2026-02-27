import type { AppRouterClient } from "@devjams/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SERVER_URL } from "@/config";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Data stays fresh for 5 minutes
			staleTime: 5 * 60 * 1000,
			// Cache is kept for 30 minutes (formerly gcTime)
			gcTime: 30 * 60 * 1000,
			// Don't refetch on window focus - reduces unnecessary requests
			refetchOnWindowFocus: false,
			// Don't refetch on mount if data is fresh
			refetchOnMount: false,
			// Retry failed requests once
			retry: 1,
		},
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			toast.error(`Error: ${error.message}`, {
				action: {
					label: "retry",
					onClick: () => query.invalidate(),
				},
			});
		},
	}),
});

export const link = new RPCLink({
	url: `${SERVER_URL}/rpc`,
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
