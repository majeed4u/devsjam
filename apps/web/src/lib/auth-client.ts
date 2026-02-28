import { createAuthClient } from "better-auth/react";
import { SERVER_URL } from "@/config";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  plugins: [adminClient()],
});
