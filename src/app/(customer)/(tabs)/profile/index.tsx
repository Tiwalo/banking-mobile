import { useContext } from 'react';

import { CustomerScreen, PreviewContext } from '@/navigation/shell';
import { Button } from '@/ui/button';
import { TiwaloText } from '@/ui/tiwalo-text';

export default function Profile() {
  const preview = useContext(PreviewContext);

  return (
    <CustomerScreen>
      <TiwaloText>Profile information is unavailable.</TiwaloText>
      {__DEV__ && preview?.active && (
        <Button label="Exit preview" variant="secondary" onPress={() => preview.setActive(false)} />
      )}
    </CustomerScreen>
  );
}
