import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { configuration } from './protocol';
import { Session } from './session';

export function previewBuild() {
  return __DEV__ && process.env.EXPO_PUBLIC_NAVIGATION_PREVIEW === '1' &&
    !process.env.EXPO_PUBLIC_OIDC_ISSUER && !process.env.EXPO_PUBLIC_OIDC_CLIENT_ID &&
    !process.env.EXPO_PUBLIC_BANKING_API_BASE_URL;
}

let instance: Session | undefined;
export function nativeSession() {
  if (instance) return instance;
  if ((Platform.OS !== 'android' && Platform.OS !== 'ios') || isRunningInExpoGo()) return;
  const config = configuration(process.env.EXPO_PUBLIC_OIDC_ISSUER, process.env.EXPO_PUBLIC_OIDC_CLIENT_ID,
    process.env.EXPO_PUBLIC_BANKING_API_BASE_URL);
  if (!config) return;
  // Keep the unconfigured entry and Expo Go gallery usable without the native identity modules.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { nativeDependencies }: typeof import('./native') = require('./native');
    instance = new Session(config, nativeDependencies(config));
  } catch {
    return;
  }
  return instance;
}
