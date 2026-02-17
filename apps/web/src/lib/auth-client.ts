import { SERVER_URL } from "@/config";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
});
