# Tiwalo Banking Mobile

Expo SDK 58 customer app scaffold for a simulated Philippine bank. Use synthetic identities and fictional PHP funds.

## Local setup

Use Node 26.1.0 and npm 11.14.0, matching CI. After selecting the Node version in `.nvmrc`, use `npm install --global npm@11.14.0` if needed.

```sh
npm ci
npm start
```

The entry screen runs without an environment file. For native sign-in, set the three public service settings in [.env.example](.env.example) to the approved synthetic environment and install a rebuilt development client. The Android and iOS scripts start Metro for an installed client. Credential entry takes place in the system browser. [Native configuration and verification](.eas/qa-flows/authentication.md)

## Development component gallery

Set `EXPO_PUBLIC_NAVIGATION_PREVIEW=1` with the three service settings absent. Run `npm start` and open the root screen in a compatible Expo Go client. The gallery opens with labeled synthetic examples. To check the production entry, use `npx expo start --no-dev --minify` and reload the client. See the [M0-02 plan](prompts/M0-02-design-system.md) for component and device verification.

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
