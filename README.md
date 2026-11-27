# Tiwalo Banking Mobile

Expo SDK 58 customer app scaffold for a simulated Philippine bank. Use synthetic identities and fictional PHP funds.

## Local setup

Use Node 26.1.0 and npm 11.14.0, matching CI. After selecting the Node version in `.nvmrc`, use `npm install --global npm@11.14.0` if needed.

```sh
npm ci
npm start
```

The entry screen runs without service credentials or an environment file. The Android, iOS, and web scripts start the Expo dev server for those targets. Keep screens in `src/app`. The optional `.env.example` documents the public banking API base URL and future identity settings. Anything prefixed with `EXPO_PUBLIC_` is visible in the app bundle.

## Development component gallery

Run `npm start` and open the root screen in a compatible Expo Go client. The gallery opens with labeled synthetic examples. To check the production entry, use `npx expo start --no-dev --minify` and reload the client. See the [M0-02 plan](prompts/M0-02-design-system.md) for component and device verification.

## Verify a change

```sh
npm ci --prefix scripts/contract
npm run contract:check
npm run lint
npm run typecheck
npm test -- --runInBand
```

The smoke test renders the current entry screen with Jest Expo and React Native Testing Library. Update its expectation when the entry screen changes. CI runs the same checks after a clean install. For SDK diagnostics, run `npx expo install --check` and `npx expo-doctor@1.21.8` with registry access. Device launches, native callbacks, and banking integration require separate verification.

Contract generation and drift checks run offline after the tooling install. Use `npm run contract:generate` after updating the reviewed contract and pin together. [Banking API contract decision](docs/adr/0003-banking-api-contract.md)

See the [MVP roadmap](docs/MVP_ROADMAP.md) for feature dependencies, acceptance gates, and the current delivery status.
