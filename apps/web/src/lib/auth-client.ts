import { createAuthClient } from "better-auth/react";
import { SERVER_URL } from "@/config";

export const authClient = createAuthClient({
	baseURL: SERVER_URL,
});
