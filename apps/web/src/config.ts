// src/config.ts
const getEnvVariable = (key: string): string => {
  // First check for runtime config (from env-config.js)
  if ((window as any).__APP_CONFIG__ && (window as any).__APP_CONFIG__[key]) {
    const value = (window as any).__APP_CONFIG__[key];
    // If it's still a placeholder (starts and ends with __), it wasn't replaced
    if (!value.startsWith("__") && !value.endsWith("__")) {
      console.log(`Using runtime config for ${key}:`, value);
      return value;
    }
  }

  // Fallback to build-time Vite env vars for development
  const viteKey = `VITE_${key}`;
  if (import.meta.env[viteKey]) {
    console.log(`Using Vite env for ${key}:`, import.meta.env[viteKey]);
    return import.meta.env[viteKey];
  }

  // Default fallback
  console.warn(`Environment variable ${key} not found, using fallback`);
  return key === "SERVER_URL" ? "http://localhost:3000" : "development";
};

export const SERVER_URL = getEnvVariable("SERVER_URL");
export const ENV = getEnvVariable("ENV");
