import { Redirect, useRouter } from 'expo-router';
import { useContext } from 'react';

import { PreviewContext } from '@/navigation/shell';
import { BrandWordmark } from '@/ui/banking-components';
import { Button } from '@/ui/button';
import { ScreenContainer } from '@/ui/screen-container';
import { TiwaloText } from '@/ui/tiwalo-text';

export default function Index() {
  const preview = useContext(PreviewContext);
  const router = useRouter();

  if (__DEV__ && preview?.active) {
    return <Redirect href="/home" />;
  }

  return (
    <ScreenContainer>
      <BrandWordmark />
      <TiwaloText variant="label">Simulated banking</TiwaloText>
      <TiwaloText>Sign-in is unavailable. This app uses fictional Philippine pesos.</TiwaloText>
      {__DEV__ && preview && (
        <>
          <Button label="Open navigation preview" onPress={() => preview.setActive(true)} />
          <Button label="Open component gallery" variant="secondary" onPress={() => router.push('/component-gallery')} />
        </>
      )}
    </ScreenContainer>
  );
}
