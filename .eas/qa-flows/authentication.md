# Authentication and session lifecycle

Use the approved synthetic environment and [QA setup](../../docs/qa/EXPO_QA_SETUP.md). The identity owner confirms the development namespace before registering `com.tiwalo.banking.dev:/oauth2redirect/keycloak` exactly on the public client. Require S256, standard flow, RS256 ID tokens, rotating refresh credentials, the banking API audience and mapped customers A and B. Ensure the device browser, app and Spring use the same trusted HTTPS issuer. Set the three public service values in the build and Metro environment. Keep preview mode off.

Compile an Android internal APK or an iOS Simulator development build with the checked-in development profile. For authorized EAS builds use `npx eas-cli@latest build --profile development --platform android` or `--platform ios`. Install the matching binary and connect it to `npx expo start --dev-client`. Check that network inspection and credential-entry recording are disabled. Expo Go can exercise the fixture gallery only.

## Steps and acceptance
1. Start signed out from Home, account and receipt links. Expect public entry. Start login, dismiss the browser, then start again. Enter A’s credentials only on the Keycloak page and observe the actual warm return to Home.
2. Repeat with the app process absent when the provider returns a live, pending transaction. If the Android development client opens the Expo launcher, select the same Tiwalo project while the pending request is valid. Record whether delivery was direct or required project selection. Verify one exchange and arrival at Home for the path observed. If the OS terminates the browser session, verify safe interruption and fresh sign-in and record that outcome separately.
3. Restart after successful login. Observe restoration and customer admission. Use approved short token lifetimes to exercise online refresh and expiry while offline. Expect locked access, then a successful explicit retry when online.
4. Switch from A to B. Expect fresh hosted authentication, a clean Home, and no previous customer content via Back or deep links. A mapped operator or unmapped synthetic identity should reach access denied. Test offline sign-out, restart and Back. All must stay outside protected navigation.
5. Preserve only sanitized outcomes, device/OS and build references. Never record the credential page, token payloads, full callbacks, full identifiers or account responses.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
