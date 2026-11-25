# Tiwalo Banking Mobile

Expo SDK 58 customer app scaffold for a simulated Philippine bank. Use synthetic identities and fictional PHP funds.

## Local setup

Use Node 26.1.0 and npm 11.14.0, matching CI. After selecting the Node version in `.nvmrc`, use `npm install --global npm@11.14.0` if needed.

```sh
npm ci
npm start
```

The entry screen runs without service credentials or an environment file. The Android, iOS, and web scripts start the Expo dev server for those targets. Keep screens in `src/app`. The optional `.env.example` documents public settings reserved for later integration. Anything prefixed with `EXPO_PUBLIC_` is visible in the app bundle.

## Verify a change

```sh
npm run lint
npm run typecheck
npm test -- --runInBand
```

The smoke test renders the current entry screen with Jest Expo and React Native Testing Library. Update its expectation when the entry screen changes. CI runs the same checks after a clean install. For SDK diagnostics, run `npx expo install --check` and `npx expo-doctor@1.21.8` with registry access. Device launches, native callbacks, and banking integration require separate verification.

See the [MVP roadmap](docs/MVP_ROADMAP.md) for feature dependencies, acceptance gates, and the current delivery status.
