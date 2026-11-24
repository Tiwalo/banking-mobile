# Codex Plan mode — banking-mobile MVP v2

Read AGENTS.md and this file. **PLAN ONLY.** No edits, installs, branch changes, builds, code generation or external account changes. Act as a senior Expo/mobile banking engineer, security and test architect. Deliver a dependency-aware roadmap, not a codebase.

## Inspect first
Inspect actual branch/status, package manager, scaffold, Expo SDK/Router, native config, current tests, skills and relevant official version-matched docs. Preserve Expo-generated agent instructions; propose a merge if absent from supplied AGENTS. Read the written design and mockup under docs/design. Read docs/contracts/BACKEND_MVP_ALIGNMENT.md and inspect accessible backend OpenAPI and implementation evidence; report source SHA and runtime availability or missing access. Check web design token/asset parity if accessible, without altering web. Do not pretend to inspect unavailable sibling repos.

## Ask and Build gate
Keep settled decisions (Expo, Router, TS, Keycloak PKCE, SecureStore, PHP minor strings, backend authority, five tabs, approved design). For unresolved consequential choices offer 2–3 viable alternatives with recommendation, compatibility, security, maintenance and effort. Ask only about decisions not safely inferable. Specifically evaluate stable NativeWind vs existing StyleSheet/token solution (no prerelease default); TanStack Query vs minimal equivalent; form tooling; icon family matching web; auth refresh/revocation and recovery persistence; build profiles/redirect URIs; light-only design; test tools. Do not install new dependencies or enable paid services. Mark decisions proposed until approved; record ADRs later. Official Expo skills first; load only task-relevant custom skills. No VPS/multi-subscription/unbounded multi-agent setup.

## Milestones (planned backend gates, not current availability)
| Milestone / proposed branch | Scope and acceptance |
| --- | --- |
| M0 `chore/mobile-verification` (reuse existing if appropriate) | Audit scaffold, clean reproducible scripts/CI, instructions, environment examples, design tokens/Inter/shared logo gap, primitives, dev-only gallery, five-tab shell with protected routing placeholders; no live auth bypass. Verify native UI, safe areas, accessibility; smoke Android and iOS when available; report actual device gaps. |
| M1 `feat/mobile-api-contract` | B1: immutable OpenAPI pin, generated types, typed adapter, RFC 9457, lossless money, contract-compatible fixture tests and drift checks. No speculative endpoints. |
| M2 `feat/mobile-auth-accounts` | B2: Keycloak public native client PKCE, secure session lifecycle, protected routes, logout/cache clear, owner-scoped account list/dashboard when endpoints available. Prove real callbacks in dev builds on both platforms; no embedded password collection. |
| M3 `feat/mobile-account-balances` | B3: ledger-backed balances, account details, bounded activity/history if contracted, empty/offline/error/refresh states. No optimistic balance writes; history gap is explicit. |
| M4 `feat/mobile-internal-transfers` | B4: source/opaque recipient/amount/review/confirm, idempotent command, definitive receipt or unresolved outcome, durable actor-bound recovery, no auto POST, no new key on retry. Test lost response after commit, duplicate tap, app kill, expiry, 409/422/503, ownership and large money. |
| M5 `chore/mobile-mvp-hardening` | Accessibility, privacy, integration, deterministic E2E, optional trusted preview Agentic CI after approval, independent risk review. B5 operations is web-only; no mobile operator work. |
| M6 `chore/mobile-release-verification` | Internal Android/iOS builds, real integrated journey, final review, bounded simulator QA if funded, evidence and human release gate. No store submission by default. |

Use GitHub Flow: branches from current main after prerequisite merges, except existing approved M0 branch. Never create/switch branches in planning. Propose feature files under prompts/ (one per substantive scope), use template; do not pre-generate all plans. M0 split foundation → design system/gallery → navigation. M1 contract before real API use; M2 identity before protected reads; M4 transfer UI fixture previews may precede B4 but live acceptance cannot. Retain feature safety even when preview fixtures are used.

## UX and integration requirements
Approved design spec governs colors, Inter, semantic tokens, brand assets and component behavior. Mockup sample balances, merchant examples, alerts, names and dates are not API facts. Plan reusable Button/Text/TextField/MoneyInput/MoneyText/BalanceCard/AccountCard/TransactionRow/StatusBadge/ScreenContainer/ReceiptCard and loading/empty/error primitives as needed; not a sprawling library. Gallery excluded from release access/bundles as feasible and verified. Build presentation with explicitly isolated fixtures, then wire genuine API. Auth entry is branded; actual credential entry remains Keycloak-hosted. Five tabs and nested receipt; test accessibility and smaller screens on Android/iOS. No fake recipient validation, activity or profile fields. Track gaps and safe blocked states.

## Verification and delivery
Use existing scripts and compatible Jest/RNTL/Maestro or equivalent. Design focused risk-based tests, not redundant snapshots. Specify Windows local Android and physical device setup; cloud iOS via EAS where available; TLS and reachable isolated backend/Keycloak with consistent issuer and redirects. Use docs/qa/EXPO_QA_SETUP.md for progressive simulator QA. Deterministic checks mandatory; no paid API/agentic workflow assumption. M4 independently verify backend posting and replay evidence; UI screenshot cannot prove double-entry integrity. Integrated release gate: mobile A sends synthetic PHP, web B reads updated balance and contracted history, authorized operator checks B5 findings; external dependencies must be explicitly marked blocked if not available.

## Return
1. Actual repo/SDK/branch and asset/skill/contract inventory; unknowns.
2. Consequential decisions table and questions, then proposed ADR list.
3. Responsibility boundaries, feature-first folders, route map, auth/transfer state transitions and recovery/security model.
4. Milestone/feature plan index, dependencies and branch sequence; acceptance criteria and risk-based review/test matrix.
5. API gaps, device environments, cost/security prerequisites for EAS, release blockers.
6. First M0 feature plan in `prompts/template.md` format as response text only. Stop for approval. Do not execute.
