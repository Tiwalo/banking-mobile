export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  if (__DEV__ && !initial) {
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
