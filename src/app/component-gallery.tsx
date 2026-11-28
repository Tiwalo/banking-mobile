import { Redirect } from 'expo-router';
import { previewBuild } from '@/auth/runtime';

export default function GalleryRoute() {
  if (__DEV__ && previewBuild()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Strip the gallery and examples from production bundles.
    const { ComponentGallery }: typeof import('@/dev/component-gallery') = require('@/dev/component-gallery');
    return <ComponentGallery />;
  }

  return <Redirect href="/" />;
}
