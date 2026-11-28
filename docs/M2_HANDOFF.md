# M2 handoff — Native session and customer dashboard

**Implemented and pushed. Integrated acceptance is blocked.** This record covers `feat/mobile-auth-accounts` at `af864efee0158cac2e56ddcc241ceb24df56014f` against approved base `4e7503cddf88562e485f27e4e53812ab5ae06d6f`. The app handles synthetic customers and fictional PHP.

## Implementation and decisions

- [M2-01 · Native session](../prompts/M2-01-native-session.md) implements hosted Keycloak Authorization Code + PKCE, checks customer admission through an authorized account read, guards customer routes, and clears credentials and actor-scoped account data on logout or account switch. It includes the approved Android SecureStore backport.
- [M2-02 · Customer dashboard](../prompts/M2-02-authenticated-dashboard.md) implements branded Home, masked owner-scoped accounts, shared in-memory reads, explicit cursor pagination and refresh, and Profile session controls. Amounts display only for the verified B3 API URL. Account detail remains in M3. Display name, profile fields, and transaction history remain contract gaps. [Backend gaps](contracts/BACKEND_MVP_ALIGNMENT.md#m2-02-contract-gaps)
- Accepted decisions are [ADR 0001 · Mobile foundation](adr/0001-mobile-foundation.md), [ADR 0002 · Design system and assets](adr/0002-design-system-and-assets.md), [ADR 0003 · Banking contract, precision, and server state](adr/0003-banking-api-contract.md), and [ADR 0004 · Native identity](adr/0004-native-identity.md). ADR 0004 was accepted for M2-01.
- The unchanged banking-core-api pin is `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`, API `1.1.0` at `/api/v1`, OpenAPI `3.1.1`. The artifact SHA-256 is `b3247ef65918185e10281d1162407a0cb9d623a4da62ebcbc8ef89bdde16bb49`. The inspected backend source derives account and cursor ownership from the mapped customer, requires `accounts:read`, and reads `account_posted_balance`. Source inspection and contract drift checks leave deployed B3 ledger reconciliation open. [Contract pin](../api/openapi/pin.json)

## Verification and review

- **Passed locally.** ESLint, TypeScript, contract drift, and whitespace checks passed. The M2-02 review ran 163 Jest tests across 11 suites before the backport. The follow-up ran 27 focused tests, and 20 focused auth tests passed after the backport. The feature plans record Android and iOS production-mode JavaScript exports and their fixture-marker checks before the backport.
- **Android build verified by the user.** The earlier Pixel 3a API 34 run recorded a warm Keycloak sign-in and Home. The visual review observed Home with an empty account list and unavailable total, and Profile with session controls. The later APK `6e9411e14033a2904a24fdefd0b1386a5b94e16d973b30217589adf82c59a6f4` included the patch, installed, and opened the development launcher on API 34. The API 35 Robolectric regression verified failed-write rejection and preservation of the previous value. The user confirmation establishes Android build verification. Detailed acceptance case results are limited to the observations recorded here. [Android evidence](../prompts/M2-01-native-session.md#review-corrections)
- **Earlier reviews satisfied.** M2-01 records two independent read-only reviewers and passing regressions for their corrections. M2-02 records its independent integration review and resolved findings. The later review raised the inherited SecureStore issue, which was backported and tested. An independent recheck of the final native backport remains unverified. [Review requirements](../CODEX_REVIEW_MVP.md)
- **Blocked or unverified.** iOS native verification remains pending with no scheduled completion. Detailed evidence remains open for native session lifecycle cases beyond the Android observations above, two-customer ownership and pagination, populated account-card layout, accessibility, and funded and zero balances reconciled to the ledger. A full Jest rerun and production-mode export reruns after the backport are unrecorded. Hosted CI and PR approval for `af864ef` could not be verified. iOS signing and publication are outside this handoff. [GitHub Actions](https://github.com/Tiwalo/banking-mobile/actions?query=branch%3Afeat%2Fmobile-auth-accounts)

## Handoff to M3

The mobile and identity owners need reachable HTTPS services, the registered public S256 client and exact redirect, and two mapped synthetic customers with `accounts:read` for the remaining integrated checks. The backend owner needs to supply a B3 deployment with reconciled funded and zero-balance accounts. Leave `EXPO_PUBLIC_B3_VERIFIED_API_BASE_URL` unset until that evidence is recorded. The approved M2 plan still lists iOS native verification as an acceptance gate. Deferring it for delivery requires an explicit change to that gate. M3 covers ledger-backed balances and owner-scoped account detail. Activity stays unavailable unless the backend publishes an owner-scoped history contract. [Native QA procedure](../.eas/qa-flows/authentication.md) · [M3 roadmap](MVP_ROADMAP.md#feature-sequence-and-acceptance)

## Proposed commit description

**Title** `feat(mobile): integrate native sessions and customer dashboard`

Add hosted Keycloak sign-in, protected customer routes, and session-scoped account reads. Show owned accounts with pagination and refresh, and provide sign-out and account switching in Profile. Gate numeric balances on verified B3 deployment and backport the Android SecureStore disk-write fix.

## Proposed draft pull request description

**Title** `M2 · Native customer sessions and owner-scoped dashboard`

Synthetic customers can sign in through Keycloak, open the protected dashboard, and browse their owned accounts. Logout and account switching clear session data. The dashboard shows availability explicitly and enables numeric balances only for a verified B3 deployment. The Android build uses the SecureStore disk-write backport.

Local checks passed for lint, typecheck, contract drift, and focused auth coverage. The Android build is user-verified and the storage regression passed. iOS native verification remains pending. Hosted CI, detailed integrated QA evidence, funded B3 ledger evidence, and independent recheck of the backport remain open. See the verification and review section for coverage by build.
