import { Button } from '@/ui/button';
import { ErrorState, LoadingState } from '@/ui/feedback-states';
import { TiwaloText } from '@/ui/tiwalo-text';
import { useSession } from './use-session';

export function SessionEntry() {
  const { view, signIn, signOut, retry, switchAccount } = useSession();
  switch (view.status) {
    case 'unconfigured': return <TiwaloText>Secure sign-in is unavailable in this build.</TiwaloText>;
    case 'restoring': return <LoadingState title="Checking your session…" />;
    case 'signingOut': return <LoadingState title="Clearing your session…" />;
    case 'authorizing': return <><LoadingState title="Signing in with Keycloak…" /><Button label="Cancel sign-in" variant="secondary" onPress={() => void signOut?.()} /></>;
    case 'retry': return <><ErrorState title="We couldn’t verify your session" description="Check your connection and try again." onRetry={retry} /><Button label="Sign out" variant="secondary" onPress={() => void signOut?.()} /></>;
    case 'cleanup': return <ErrorState title="Session cleanup is incomplete" description="Customer access is locked." onRetry={signOut} />;
    case 'denied': return <><ErrorState title="Customer access denied" description="This identity cannot access customer banking." /><Button label="Switch account" onPress={() => void switchAccount?.()} /></>;
    case 'authenticated': return null;
    default: return <>
      {view.status === 'invalid' && <ErrorState title="Please sign in again" description="Your session could not be verified." />}
      {view.status === 'interrupted' && <TiwaloText>Sign-in was interrupted. You can start again.</TiwaloText>}
      <Button label="Sign in" onPress={() => void signIn?.()} />
    </>;
  }
}
