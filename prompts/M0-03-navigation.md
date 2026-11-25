# M0-03 — Tiwalo Mobile Navigation and Application Shell

Status: implemented. Native verification gates remain open.

Branch and base SHA: `codex/m0-03-navigation` from `7d45db7e2f381bf2a0509d6c2be2d0e81bd2850e` (M0-02 merge).

## Goal and acceptance criteria

Release opens a branded public entry with simulation and sign-in availability copy. An explicit development preview exposes Home, Accounts, Send, Activity and Profile in that order. Nested account detail and receipt screens preserve back navigation. Closing preview clears its history and data. Release links to the customer group and component gallery return to public entry.

## Prerequisites and sources

Use the [MVP roadmap](../docs/MVP_ROADMAP.md), [written design](../docs/design/TIWALO_MVP_DESIGN_SPEC.md), [ADR 0001](../docs/adr/0001-mobile-foundation.md), [ADR 0002](../docs/adr/0002-design-system-and-assets.md), Tiwalo UI and testing skills, and Expo's Router and Native UI skills. The merged design system uses Expo 58.0.26, React Native 0.88.1 and Expo Router 58.0.32. Backend and contract pin are unnecessary for this increment.

## Decisions

Use SDK 58 JavaScript tabs with Inter and the existing Lucide renderer, and native stacks for account and receipt details. Reuse the temporary wordmark and light surfaces while leaving the app-wide appearance decision open. Keep the entire customer group behind a root protected route. Only an explicit in-memory development preview can open it until M2 supplies a real session.

## Scope and steps

1. Replace the scaffold at `/`. Add protected `/home`, `/accounts`, `/send`, `/activity`, and `/profile` tabs. Home links to Accounts, Send and Activity. Use availability states for absent capabilities.
2. Nest `/accounts/[accountRef]` in the Accounts stack. Push `/receipts/[transferRef]` above the tabs so Back can return to Send or a future contracted Activity entry. Anchor link entry to Accounts or Home. Android Back from another tab root returns to Home.
3. Keep gallery and navigation fixture modules outside `src/app` behind compile-time development branches. Provide distinct entry actions, a sample account and receipt, and an editable sample field. Clear the preview on exit or process restart.
4. Reuse ScreenContainer and native header and tab insets. Hide tabs while typing, keep the input and hint above the keyboard, and dismiss the keyboard when leaving Send. Expose tab labels, selected state, a visible selection indicator and touch targets at least 44 pt on iOS and 48 dp on Android.

## Safety and privacy

Only opaque references belong in URLs. Resolve known sample references only in preview, and show an unavailable state for unknown ones. No Keycloak, persisted session data, live API commands, financial changes or idempotency apply. The gallery is protected independently of preview.

## Verification

Run npm lint, strict typecheck and Jest, including actual Router routes for release access, development tabs, detail destinations and preview exit. Inspect minified Android and iOS production exports for fixture exclusion. Follow the [native verification flow](../.eas/qa-flows/app-launch-navigation.md) and obtain independent read-only review. Record unrun checks and prerequisites.

## Completion report

- Implemented the public entry and protected customer routes under `src/app`, shared chrome in `src/navigation/shell.tsx`, and isolated navigation and gallery examples under `src/dev`. Added two pinned Lucide SVGs and reused the gallery's Android field-reveal behavior in Send. Replaced the scaffold test with `tests/navigation.test.tsx` and updated the navigation QA flow.
- Offline `npm ci`, lint, strict typecheck, all 76 Jest tests, and `git diff --check` passed. Regression coverage includes Android Back behavior through the tab router, both detail paths, the preview exit and reentry, denied release links, warm-link destinations, repeated receipt links, and opaque reference encoding.
- The minified Android and iOS production JavaScript exports retained the public entry and excluded all ten checked preview and gallery markers. The exported bundles were local JavaScript artifacts without native signing.
- Android 14 API 34, Pixel 3a AVD, Expo Go 58.0.6, SDK 58 local worktree. Verified all five tabs, account detail and receipt Back paths, and preview exit. Verified decimal entry, visible hint, and tabs hiding and returning on Android Back at 150% system font size. Restored the original font setting. The emulator initially required recovery from a System UI timeout. A fresh Metro and app launch resolved the Expo Go error during the large-text retry.
- Android Expo Go with minified production JavaScript showed public entry and denied cold account-detail, receipt and gallery links through the Expo Go scheme. iOS native navigation, screen-reader checks, and cold and warm `bankingmobile://` links in signed native builds remain unverified.
- Independent read-only review found SDK 58 tab-role and warm-link issues. Corrected the platform selectors and the external detail Back destinations, then added regressions for repeated links and reference encoding. Contract pin does not apply to M0-03. Hosted CI, native verification gaps and human merge approval remain open.

### Review follow-up

- Resolved the low-severity production bundle finding. Home and Accounts load their warm-link handlers through development-only imports. Existing route tests still cover the account and receipt Back destinations.
- `npm run lint`, `npm run typecheck`, `npm test -- --runInBand --no-cache` (76 tests), and whitespace checks passed. The first lint attempt hit a worktree cache permission error. The standard lint command passed with permission to write that cache.
- Fresh minified Android and iOS JavaScript exports retained the public entry and omitted all 13 checked markers, including the ten original gallery and fixture markers plus `linkedAccount`, `linkedReceipt`, and `usePreviewDetailLink`.
- No confirmed findings remain open. Native QA was not rerun for this correction. iOS navigation, screen readers, small-screen layout, large-text tab legibility, measured touch targets, cold and warm application-scheme links in native release-mode builds, hosted CI, and human merge approval remain open.

## Durable documentation updates

Keep navigation decisions here. Update the native verification flow and reserve the session ADR for M2.
