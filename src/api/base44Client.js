import { createClient } from '@base44/sdk';

const appId = import.meta.env.VITE_BASE44_APP_ID || '';
const apiKey = import.meta.env.VITE_BASE44_API_KEY || '';

if (!appId) {
  console.warn(
    '[Khonofy] Missing VITE_BASE44_APP_ID. Add it to .env.local — see README.md.'
  );
}

const sdk = createClient({
  appId,
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || '',
  serverUrl: import.meta.env.VITE_BASE44_SERVER_URL || 'https://base44.app',
  headers: apiKey ? { api_key: apiKey } : undefined,
});

/** Ensure register stores the access token like login does. */
async function register(payload) {
  const result = await sdk.auth.register(payload);
  if (result?.access_token) {
    sdk.auth.setToken(result.access_token);
  }
  return result;
}

export const base44 = {
  ...sdk,
  auth: {
    ...sdk.auth,
    register,
  },
};
