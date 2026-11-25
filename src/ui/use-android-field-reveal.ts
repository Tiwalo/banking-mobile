import { type ComponentRef, useCallback, useEffect, useRef } from 'react';
import { Keyboard, type ScrollView, type View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { space } from './tokens';

export function useAndroidFieldReveal() {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const fieldRef = useRef<ComponentRef<typeof View>>(null);
  const focused = useRef(false);
  const { top } = useSafeAreaInsets();

  const reveal = useCallback(() => {
    if (process.env.EXPO_OS !== 'android' || !focused.current) return;

    const keyboard = Keyboard.metrics();
    const scroll = scrollRef.current;
    const viewport = scroll?.getNativeScrollRef();
    const content = scroll?.getInnerViewRef();
    const field = fieldRef.current;
    if (!keyboard || !scroll || !viewport || !content || !field) return;

    viewport.measureInWindow((_x, viewportTop, _width, viewportHeight) => {
      field.measureInWindow((_fieldX, fieldTop, _fieldWidth, fieldHeight) => {
        // Keyboard coordinates include the system bar. Window measurements can exclude it.
        const visibleBottom = Math.min(viewportTop + viewportHeight, keyboard.screenY - top);
        const overlap = fieldTop + fieldHeight + space.sm - visibleBottom;
        if (overlap <= 0) return;

        content.measureInWindow((_contentX, contentTop) => {
          if (focused.current && Keyboard.isVisible()) {
            scroll.scrollTo({ y: viewportTop - contentTop + overlap, animated: false });
          }
        });
      });
    });
  }, [top]);

  useEffect(() => {
    if (process.env.EXPO_OS !== 'android') return;
    const subscription = Keyboard.addListener('keyboardDidShow', reveal);
    return () => subscription.remove();
  }, [reveal]);

  return {
    scrollRef,
    fieldRef,
    reveal,
    onFocus: () => {
      focused.current = true;
      requestAnimationFrame(reveal);
    },
    onBlur: () => { focused.current = false; },
  };
}
