This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

# AGENTS.md — Tiwalo Banking Mobile

## Scope and authority
`banking-mobile` is a native Expo/React Native/TypeScript customer app for a simulated Philippine digital bank. Synthetic identities and fictional PHP only; disclose simulation. No real funds, external rails, operations portal, AI, notifications, biometrics or analytics in MVP. `banking-core-api` (Spring Boot) owns authorization, accounts, financial state, ledger, transfers, receipts, audit and reconciliation; `banking-web` shares the contract and visual identity. Mobile owns presentation, secure session lifecycle and permitted API commands only. Never change another repo without explicit approval.

## Expo and repository rules
- Preserve any actual Expo-generated AGENTS instructions, native configuration and working scaffold. This file supplements those instructions; merge, do not erase them. Inspect Git status/branch, package.json, lockfile, app config, router, scripts and existing code first. Never reset or re-scaffold existing work.
- Check exact installed Expo SDK, React Native and Router versions; use matching official documentation and relevant installed official Expo skills. Use `npx expo install` for compatible Expo packages when approved; use existing package manager and scripts. Do not hand-edit generated native folders or run destructive prebuild/reset without approval. Expo Go is for suitable UI previews, not proof of production OIDC redirect behavior.
- Expo Router, strict TypeScript, native UI. Keycloak owns identity; system-browser Authorization Code + PKCE, public client, no embedded secret. SecureStore owns sensitive persistence; a typed adapter owns API transport; backend remains sole financial authority. Server-state library and styling implementation require decision gate; avoid a second styling or state system. GitHub Actions owns deterministic CI; EAS owns approved mobile build/distribution. Do not move responsibilities silently.

## Work protocol
- For substantial work: understand relevant code/docs, ask only consequential unresolved questions, plan using `prompts/template.md`, stop for approval, implement one approved feature, verify, review by risk, report. Plan mode is read-only: no file edits, installs, builds, migrations or Git mutations. Persist approved plans in implementation mode. Small scoped fixes need no separate plan unless they affect security, contracts or money.
- Use `CODEX_PLAN_MVP.md` for roadmap; `CODEX_IMPLEMENT_MVP.md` and `CODEX_REVIEW_MVP.md` for execution/review. Read only relevant skill(s), ADRs and docs; avoid loading transcripts, unrelated plans or whole docs collections. Fresh session per substantial feature with approved plan and short handoff. Do not repeatedly replan resolved decisions.
- Record consequential approved decisions in `docs/adr/`; update this file only for durable rules not inferable from code. No speculative dependencies, scope creep or duplicate implementations. Report deviations and stop for new consequential choices.
- Default one coding agent; independent read-only reviewer for material changes, two distinct perspectives for auth and transfers. Parallel workers only on approved disjoint tasks in isolated worktrees, after interfaces agreed. No uncontrolled delegation or recursive review loops.

## Non-negotiable security and financial rules
- Pin immutable backend OpenAPI 3.1 revision (`api/openapi/banking-v1.yaml`, `/api/v1`); generate types and track availability separately from spec. Never invent routes, DTOs, status semantics, recipient names, history or receipts. Read `docs/contracts/BACKEND_MVP_ALIGNMENT.md` for planned gates; verify actual state. Missing contract or service = BLOCKED for live integration.
- PHP amounts are decimal-string minor units; validate/format losslessly, respect backend signed-long bounds. Never use JS floating-point arithmetic, authoritative local balance changes or optimistic financial postings.
- One strong idempotency key per reviewed logical transfer; preserve same actor-bound canonical payload and key across retries/restart. Changed request requires explicit new review/key, but do not silently discard unresolved original. Timeout, connection loss and interrupted submission = unknown outcome; only contracted lookup or explicit same-key replay resolves it. No offline queue, automatic POST retries, auto-submit on foreground/reconnect or false success. Definite declines remain definitive for the original attempt. Backend enforces funds, caps, ownership and account states.
- Use RFC 9457 and actual contract semantics for 401/403/409/422/503 and replay. Never leak tokens, full identifiers, PII or financial payloads in logs, screenshots, deep links or analytics. Use HTTPS outside controlled local dev. SecureStore for tokens, not AsyncStorage. Clear actor-scoped caches and secrets on logout/switch; unresolved attempt recovery must not leak or replay across users. Plan secure recovery persistence and retention; if state is lost, do not fabricate a new attempt. No release mock auth or live-looking fixture results.

## Design and features
- `docs/design/TIWALO_MVP_DESIGN_SPEC.md` is the approved written design; its PNG is illustrative. Tiwala: *Tiwala sa bawat daloy.* Flat shared navy logo (approved source asset only; temporary wordmark if absent), Inter, semantic tokens, original subtle banknote-inspired motifs. No tracing actual banknotes or mockup logo. Implement tokens and primitives first, development-only gallery next, then screens. Use existing components; do not duplicate raw hex values. Contrast, text+icon statuses, safe areas, keyboard, font scaling, reduced motion and native accessibility take priority. Light-only MVP is a proposed decision, not an approved scope change.
- Five tabs: Home, Accounts, Send, Activity, Profile. Receipt is a detail screen, not a sixth tab. Home balance/quick actions; accounts masked/owned; send source/opaque recipient/amount/review/confirm/result or unresolved guidance; activity/history only where contracted; receipt definitive backend evidence; minimal profile/logout. No invented merchant payments, notification badges or sample financial values in live UI.

## Guardrails and delivery
- Human approval for dependency additions, architectural changes, credentials, external actions, worktree/branch creation, commits/pushes/merges/tags and publishing builds. Never force-push, bypass permissions, delete unrelated files, access credential stores or production DBs, execute unreviewed remote scripts, or print secrets. AGENTS is guidance, not enforcement: use sandbox, least privilege, branch protections and CI. Work from approved short-lived branch; protect main.
- Deterministic lint/typecheck/unit/component/contract tests and relevant Maestro/device tests; preserve critical-path coverage. Use on-demand Expo Simulators when available; M5 optional Agentic CI, M6 optional bounded QA swarm. No secret-bearing untrusted PRs, no production credentials, no agent writes to financial data outside isolated synthetic API flows. See `docs/qa/EXPO_QA_SETUP.md`.
- Report actual changed files, command outcomes, device/OS/build evidence, contract revision, blockers, skipped checks, risks and next step. Never claim tests/builds/integrations that did not run. Financial safety > authorization/privacy > contract > accessibility > visual fidelity > feature breadth. Human approval before merge/release.
