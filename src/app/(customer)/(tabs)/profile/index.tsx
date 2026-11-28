import { useContext } from 'react';

import { CustomerScreen, PreviewContext } from '@/navigation/shell';
import { Button } from '@/ui/button';
import { useSession } from '@/auth/use-session';
import { TiwaloText } from '@/ui/tiwalo-text';

export default function Profile() {
  const preview = useContext(PreviewContext);
  const { view, signOut, switchAccount } = useSession();

  return (
    <CustomerScreen>
      {view.status === 'authenticated' && <>
        <TiwaloText accessibilityRole="header" variant="heading">Session</TiwaloText>
        <Button label="Sign out" onPress={() => void signOut?.()} />
        <Button label="Switch account" variant="secondary" onPress={() => void switchAccount?.()} />
      </>}
      {__DEV__ && preview?.active && (
        <Button label="Exit preview" variant="secondary" onPress={() => preview.setActive(false)} />
      )}
    </CustomerScreen>
  );
}
