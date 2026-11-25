# App launch and navigation

Use an approved SDK 58 local development preview and an authorized native release-mode build. Use synthetic fixtures. Follow [Expo QA setup](../../docs/qa/EXPO_QA_SETUP.md) before any cloud work.

## Development preview

1. Cold launch to public entry. Confirm simulation disclosure and sign-in availability. Open the component gallery, confirm it shows synthetic examples, and return to public entry. Open navigation preview separately.
2. Verify exactly five tabs in order: Home, Accounts, Send, Activity, Profile. Tap each and verify the label, selection indicator and selected announcement. Check the Home shortcuts. With TalkBack on Android and VoiceOver on iOS, verify clean focus order, native back labels, and tab and detail announcements.
3. Open the sample account from Accounts. Back returns to Accounts. Open the sample receipt from Send. The receipt has no tab bar, is labeled as a sample, and Back returns to Send. On Android use system Back, including from another tab root to Home. On iOS exercise the header Back button and the edge swipe.
4. In Send, focus Sample amount. Check that the tab bar hides and the input and hint remain reachable. Dismiss the keyboard and verify the bar returns. Open the receipt with the keyboard up and verify it closes. Repeat at large font sizes on a small-screen phone with a bottom system inset and inspect status bar, header, tab bar and scroll content for clipping or duplicated insets.
5. Exit preview from Profile. Back and a direct account or receipt link must leave the app at public entry. Reopen preview and verify it starts on Home. Cold restart and confirm preview starts closed.

## Release mode

Cold launch and warm-open the application scheme for each tab, an account detail, a receipt, and the gallery. For example, use `bankingmobile://accounts/demo-navigation-account`, `bankingmobile://receipts/demo-navigation-receipt`, and `bankingmobile://component-gallery`. For each link the public entry remains the only accessible screen, with no preview actions or sample data. Verify the production bundle separately for gallery and fixture exclusion. Record Expo Go UI checks separately from app-scheme results in a release-mode build.

## Report

Record device, OS, build/commit, mode, and actual observations. Separate deterministic, bundle, and native evidence. Mark each check PASS, FAIL or BLOCKED, with redacted references and reasons for missing devices, screen readers or builds. Contract revision is inapplicable for this fixture-only milestone.
