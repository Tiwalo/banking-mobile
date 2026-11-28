import { useSyncExternalStore } from 'react';
import { nativeSession } from './runtime';
import type { SessionView } from './session';

const unavailable: SessionView = { status: 'unconfigured' };
const snapshot = () => unavailable;
const subscribe = () => () => {};

export function useSession() {
  const session = nativeSession();
  const view = useSyncExternalStore(session?.subscribe ?? subscribe, session?.snapshot ?? snapshot, snapshot);
  return { view, signIn: session?.signIn, retry: session?.retry, signOut: session?.signOut, switchAccount: session?.switchAccount };
}
