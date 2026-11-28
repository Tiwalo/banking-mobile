# M2-02 — Tiwalo Authenticated Customer Dashboard

Status: approved and implemented locally. The M2-01 Android storage regression and rebuild passed. Integrated acceptance still requires native session and accessibility checks and funded B3 evidence.

Branch `feat/mobile-auth-accounts`, base `4e7503cddf88562e485f27e4e53812ab5ae06d6f`. The working tree also contains the preceding M2-01 changes.

## Goal and acceptance criteria

Customers land on a branded Home with a welcome, balance card, account summaries, and shortcuts after successful sign-in. Accounts supports explicit cursor pagination and refresh. Profile provides sign-out and account switching. The five customer tabs and simulated-banking disclosure follow the approved design.

## Prerequisites and sources

- [Design specification](../docs/design/TIWALO_MVP_DESIGN_SPEC.md) and [visual reference](../docs/design/tiwalo-mvp-ux-reference.png).
- [Design system](../docs/adr/0002-design-system-and-assets.md), [banking contract](../docs/adr/0003-banking-api-contract.md), and [native identity](../docs/adr/0004-native-identity.md).
- [OpenAPI pin](../api/openapi/pin.json) for API 1.1.0 under `/api/v1` at `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`. The customer must be mapped and hold `accounts:read`.
- The backend source contains B3 and reads from `account_posted_balance`. The authorized synthetic deployment still needs funded-account ledger evidence. [M2-01 device and storage gates](M2-01-native-session.md) apply to integrated acceptance.

## Decisions and implementation

- Reuse the temporary Tiwalo wordmark, Inter, tokens, balance and account cards, status badges, and feedback primitives. Home uses a generic welcome. View accounts opens the Accounts tab. Send and Activity shortcuts display their availability on Home.
- Share one 20-account initial request through the existing per-session cache and authenticated read interface. Home previews up to three accounts. Accounts loads additional pages on demand. Show Deposit account, a four-character account suffix, and the contracted status. Account detail remains in M3.
- Default to unavailable amounts. `EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL` enables amounts only when it matches the configured API base URL exactly. Configure it for a reviewed synthetic B3 deployment after reconciling funded reads against the ledger. Calculate a total only from a nonempty first page without a next cursor. Preserve exact centavos and reject aggregate overflow.
- Show loading, empty, unavailable, access-denied, retryable-error, and expired-session states. Refresh restarts at page one. A failed additional page retains earlier rows, an invalid cursor restarts pagination, and access denial hides account data. The existing session controller handles expiry and sign-out.
- Use scoped customer reads only. Transfer commands, account detail, activity and receipt enumeration, profile retrieval, and notifications are outside this change. The [contract gap register](../docs/contracts/BACKEND_MVP_ALIGNMENT.md) records the missing capabilities.

## Safety, verification, and rollback

Only the masked account suffix enters the UI. Authorization, response validation, GET cancellation, secure storage, revocation, and actor isolation use the existing adapter and session controller. The approved plan includes deterministic UI and session tests, contract drift checks, independent read-only review, and redacted Android and iOS verification against two synthetic customers. Live acceptance requires authorization boundaries, pagination, funded and zero balances, expiry, sign-out, and account switching. Device review covers large text, contrast, touch targets, VoiceOver and TalkBack, safe areas, announcements, and focus.

To disable numeric balances in a build, clear the B3 verified base URL and rebuild the bundle. The dashboard introduces no storage migration.

## Completion report

- Implemented Home, the owned Accounts list, and Profile session controls on the approved milestone branch. Added shared account queries, dashboard tests, and a deployment-specific B3 configuration example. The existing authentication implementation and contract pin are retained.
- Lint, typecheck, contract drift verification, and whitespace checks passed. The full Jest run passed 162 tests in 11 suites. After the independent review fix, the focused dashboard and authenticated navigation rerun passed 7 tests in 2 suites.
- Production-mode Android and iOS exports both contained the dashboard marker and excluded the six checked preview and fixture markers.
- Integrated acceptance remains pending. Live funded B3 responses, native accessibility, and Android/iOS session behavior were outside the local verification. The M2-01 Android SecureStore durability issue and pending device checks still apply. Keep the B3 deployment setting unset until funded ledger evidence is available.

### Review findings and resolution

- **High · Closed.** The [shared query](../src/dashboard/owned-accounts.ts) and [Accounts screen](../src/app/(customer)/(tabs)/accounts/index.tsx) replace the account placeholders with authorized reads, masked summaries, cursor pagination, and scoped feedback.
- **Medium · Closed.** [Home](../src/app/(customer)/(tabs)/home/index.tsx) displays a generic welcome and balance card, and explains the unavailable Send and Activity shortcuts before navigation.
- **Low · Closed.** The [shared query](../src/dashboard/owned-accounts.ts) disables automatic retry on tab mount. [Authenticated navigation coverage](../tests/auth-navigation.test.tsx) exercises a first-page failure, a tab change, and explicit retry.

The existing implementation contains all three corrections. The follow-up required only this documentation update. Lint, typecheck, contract drift verification, and whitespace checks passed again. All 7 focused tests passed across the authenticated navigation and dashboard balance suites. M2-01 prerequisites and live device and B3 verification remain acceptance gaps.

### Review follow-up — 2026-11-28

- **Medium · Open.** The installed Android `expo-secure-store` 58.0.3 implementation still ignores the result of `SharedPreferences.commit()` when saving an encrypted record. A failed disk write can appear successful and be lost on process restart. The [published stable releases](https://www.npmjs.com/package/expo-secure-store?activeTab=versions) and [SDK 58 changelog](https://github.com/expo/expo/blob/sdk-58/packages/expo-secure-store/CHANGELOG.md) show 58.0.3 as the newest stable SDK 58 release. The [upstream fix](https://github.com/expo/expo/pull/52131) is merged on Expo main. [M2-01](M2-01-native-session.md#review-corrections) requires a compatible release or separate approval for a native backport, followed by a rebuilt Android binary and a check that a failed disk commit rejects the write.
- The review identified no new M2-02 dashboard defects. Integrated acceptance still requires the native session and accessibility checks and funded B3 ledger evidence.
- ESLint, TypeScript, contract drift, and whitespace checks passed. The focused rerun passed 27 tests across native auth, session, authenticated navigation, and dashboard balances. These tests did not exercise a failed disk commit on Android.

### Android storage backport

The approved [M2-01 backport](M2-01-native-session.md#review-corrections) supplies the upstream Android fix while retaining SDK 58. The Android API 35 regression passed and the rebuilt x86_64 APK included the patched code. The dashboard still requires native session and accessibility checks and funded B3 ledger evidence.
