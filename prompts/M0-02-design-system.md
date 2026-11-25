# M0-02 — Tiwalo Mobile Design System and Development Component Gallery

Status: Implemented

Branch and base SHA: `codex/m0-02-design-system` from `13f178aa4c87a2711a998b02b4f47d33aec8366b`

## Goal and acceptance criteria

Develop reusable native Tiwalo banking components and demonstrate their interaction and accessibility states in a clearly labeled, development-only gallery. Keep the production entry free of gallery code, fixture content, and access routes.

## Prerequisites and sources

M0-01 merged in PR #2, with both hosted verification runs passing on `a0a8bc3`. Follow the [approved written design](../docs/design/TIWALO_MVP_DESIGN_SPEC.md), its [illustrative reference](../docs/design/tiwalo-mvp-ux-reference.png), [ADR 0001](../docs/adr/0001-mobile-foundation.md), the Tiwalo UI and testing skills, and Expo's `building-native-ui` skill for the SDK 58 scaffold. This presentation milestone has no backend or API pin prerequisite.

## Decisions

Use typed React Native StyleSheet tokens and a light gallery palette. Bundle licensed Inter 4.1 Regular and SemiBold and render the Lucide subset shared with the web icon family via the installed Expo Image package. Use the temporary navy wordmark and solid Peso Blue balance card pending approved shared artwork. See [ADR 0002](../docs/adr/0002-design-system-and-assets.md).

## Scope

- Semantic colors, Inter text roles with tabular numerals, an 8-point spacing scale, control and card radii, shared iconography, and a temporary wordmark.
- Native buttons, fields, controlled money input and lossless display, balance and account cards, transaction rows, text-and-icon status badges, selectable receipt detail, and loading, empty, and error states.
- Display-only props and callbacks. Banking screens, tabs, authentication, API bindings, and transaction orchestration are later milestones.

## Steps

1. Define tokens and font and icon loading, then build screen and form primitives.
2. Add presentational banking components and PHP draft and display helpers.
3. Show synthetic examples and interactive component states through a guarded development-only import at the existing root route.
4. Run M0-01 checks and focused coverage, inspect production bundles, verify gallery appearance and accessibility where devices are available, and request independent read-only review.

## Safety and privacy

Amount strings retain full signed-long precision for display. Invalid or incomplete draft text never becomes a financial amount. Cards accept masked references and caller-provided status labels and tones. Receipt samples use labeled synthetic values. Fixture content lives outside the Router route tree and is removed from production. Authentication, vault storage, idempotency, and financial commands do not apply to this presentation increment.

## Verification

Run clean npm installation, lint, strict typecheck, and Jest. Test centavo boundaries, malformed and incomplete inputs, disabled and busy presses, field labels and errors, status text, selectable receipt references, and AA token pair contrast. Compare a small-screen gallery with the reference and cover safe areas, keyboard, font scaling, reduced motion, and TalkBack and VoiceOver on supported devices. Inspect minified Android and iOS production exports for fixture and gallery exclusion and verify root behavior in production mode.

## Completion report

- Implemented theme, fonts, icons, and presentation components in `src/ui`. Wired the gallery through the two existing Expo Router entry files and added usage instructions and focused tests. All gallery data is synthetic. Contract pin does not apply to this milestone.
- The clean npm install, lint, strict typecheck, SDK compatibility check, and all 64 Jest tests passed on Node 26.1.0 and npm 11.14.0. The lockfile and native app configuration match the base.
- Minified Android and iOS production JavaScript exports retained the scaffold entry and excluded gallery markers, fixtures, and the hashes of gallery fonts and icons. A separate browser check of the production-mode server rendered the scaffold.
- Expo Go 58.0.6 on the Android 14 Pixel 3a API 34 emulator rendered the gallery at a 360 dp width. Verified the primary action, persistent disclosure while scrolling, decimal keyboard and entry, and visible focus. Inspected reflow at 150% system font size and restored the prior setting. The emulator recovered from a System UI timeout during its first launch.
- A 360 px Chromium preview verified Inter loading, invalid and overflowing money error associations, retry, persistent disclosure, decorative icons, and horizontal fit under reduced motion. The final preview had no browser hydration warning.
- Independent read-only review checked formatting precision, fonts, asset notices, reduced motion, focus, web accessibility, and fixture isolation. The reviewer separately exercised 2,500 signed 64-bit display values and their nonnegative draft round trips. Reported issues were corrected and rechecked.
- TalkBack was unavailable on the emulator. iOS native layout and VoiceOver remain pending. Local implementation is ready for review on the feature branch. Hosted feature CI and merge approval are delivery gates.

### Visual QA follow-up

- Fixed the Android gallery keyboard overlap. When the amount field is focused, the gallery scrolls only if the field, hint, or validation message would extend beyond the visible area above the keyboard.
- On Android 14 in Expo Go 58.0.6, entered a valid decimal amount, checked the full focus outline and hint, and refocused an invalid amount from below the keyboard's top edge. The outline, hint, and error were visible with the decimal keyboard open at default text size.
- Lint, strict typecheck, and all 64 Jest tests passed. The Jest rerun ran after the emulator stopped. Fresh Android and iOS production JavaScript exports retained the scaffold and excluded the gallery fixtures.
- The temporary wordmark and solid Peso Blue balance card remain the approved fallbacks pending approved artwork. The reference's right-aligned amounts remain a layout difference. A defect in the existing stacked rows has not been established. Native iOS and screen-reader checks remain unverified.

- After updating Android Emulator to 37.3.10, verified the corrected field on Android 14 in Expo Go at 150% text size. The focused decimal input, wrapped hint, and wrapped validation error all stayed above the open keyboard. Restored the previous font scale.

## Durable documentation updates

[ADR 0002](../docs/adr/0002-design-system-and-assets.md) records the approved styling, fonts, icon source, and shared artwork fallback.
