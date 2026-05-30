import { createClient } from '@base44/sdk';
import { env } from '../config/env.js';

export const base44 = createClient({
  appId: env.base44AppId,
  serverUrl: env.base44ServerUrl,
  appBaseUrl: env.base44AppBaseUrl,
  headers: env.base44ApiKey ? { api_key: env.base44ApiKey } : undefined,
});

export function isBase44Configured() {
  return Boolean(env.base44AppId && env.base44ApiKey);
}
