import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';

export function usePreviewDetailLink(param: 'linkedAccount' | 'linkedReceipt') {
  const router = useRouter();
  const reference = useLocalSearchParams()[param];

  useFocusEffect(useCallback(() => {
    if (!__DEV__ || typeof reference !== 'string' || !reference) return;
    router.setParams({ [param]: undefined });
    if (param === 'linkedAccount') {
      router.push({ pathname: '/accounts/[accountRef]', params: { accountRef: reference } });
    } else {
      router.push({ pathname: '/receipts/[transferRef]', params: { transferRef: reference } });
    }
  }, [param, reference, router]));
}
