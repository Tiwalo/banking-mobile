import { nativeSession, previewBuild } from '@/auth/runtime';
import { redirectUri } from '@/auth/protocol';

export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  // Keep OAuth parameters out of navigation history, including on malformed returns.
  if (path.startsWith(redirectUri) || /oauth2redirect/i.test(path) || /[?#&](?:code|state|iss|error|access_token|id_token|refresh_token)=/i.test(path)) {
    if (path.startsWith(redirectUri + '?')) void nativeSession()?.callback(path);
    return '/';
  }
  // The supported external detail links carry their opaque reference in the path only.
  path = path.split(/[?#]/, 1)[0];
  if (__DEV__ && previewBuild() && !initial) {
    // Warm native links don't seed SDK 58 stack anchors. Open the back destination first.
    const detail = path.match(
      /^(?:bankingmobile:\/\/\/?|exps?:\/\/[^/]+\/--\/|\/)?(accounts|receipts)\/([^/?#]+)\/?(?:[?#].*)?$/,
    );
    if (detail) {
      const [, section, pathReference] = detail;
      let reference = pathReference;
      try {
        reference = decodeURIComponent(pathReference);
      } catch {
        // Keep a malformed reference opaque so the detail screen can show it as unavailable.
      }
      const queryReference = encodeURIComponent(reference);
      return section === 'accounts'
        ? '/accounts?linkedAccount=' + queryReference
        : '/home?linkedReceipt=' + queryReference;
    }
  }

  return path;
}
