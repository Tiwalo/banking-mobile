# M0-01 — Reproducible Expo foundation

Status: Implemented  
Branch and base SHA: chore/mobile-verification from b7a0ec58e7a3acef15186819ff3d66ef03372407

## Goal and acceptance criteria

A clean checkout installs the locked dependencies and passes lint, strict typecheck and a native entry screen smoke test noninteractively. Preserve the scaffold and both sets of agent instructions. CI runs the same checks with read-only repository access.

## Prerequisites and sources

SDK 58 scaffold, generated and Tiwalo AGENTS instructions, [MVP roadmap](../docs/MVP_ROADMAP.md), Expo SDK 58 docs, and Tiwalo mobile testing guidance. Backend API 1.1.0 at fc06aebdc53ae2e4a28e54aaeb875294e317e8c1 is the roadmap reference. The foundation has no service prerequisite.

## Decisions

Use Node 26.1.0 and npm 11.14.0, Expo lint config, Jest Expo and React Native Testing Library. Preserve Expo Router, strict TypeScript and generated native configuration. ADR 0001 records the accepted foundation decision.

## Scope / out of scope

Foundation tooling, CI, instruction merge, public environment example and local setup. Design gallery, feature routes, live authentication, financial commands and EAS provisioning are later features.

## Steps

1. Preserve the existing checkout in a separate worktree and merge the instruction sets.
2. Pin tools and repair scripts and lockfile.
3. Configure lint, strict typecheck and a smoke test of the actual entry.
4. Document public environment and credential-free start.
5. Add CI, validate from a clean installation, and independently review.

## Safety and privacy

The smoke test renders the scaffold only. No service tokens or financial fixtures are needed. Example URLs are reserved, non-routable names.

## Verification

Use npm ci, lint, typecheck, Jest in band, SDK package check and Expo Doctor. Record available native device evidence separately.

## Completion report (after execution)

Implemented on the isolated verification worktree. Merged the generated Expo instructions with the supplied Tiwalo supplement and included its referenced planning, design, contract, QA and skill files unchanged. Added the toolchain pins, npm scripts and repaired lockfile, ESLint/Jest configuration, entry screen smoke test, public environment example and ignores, GitHub Actions workflow, README, and ADR 0001. Removed the broken reset command. App routes and native config retain their base contents.

- The baseline npm ci failed on missing React Native Metro/Babel peers. Regenerated the lock with npm 11.14.0 and the SDK installer, without forced peer overrides. Expo 58.0.26, RN 0.88.1, Router 58.0.32 and React 19.3.0 were retained.
- A disposable local checkout with the candidate files and no node_modules passed npm ci --no-audit --no-fund --prefer-offline (1,349 packages). npm run lint, npm run typecheck, and npm test -- --runInBand passed there (one native component test). All 54 checkout inputs matched the feature tree by SHA-256 after the checks. TypeScript 6 required explicit Jest types.
- npx expo install --check reported dependencies up to date. npx --yes expo-doctor@1.21.8 passed 20/20. Git diff whitespace check passed. The hosted Linux workflow awaits a pushed revision.
- npm reported 22 moderate advisories across the full dependency tree. npm audit --omit=dev reported 20 moderate, zero high or critical. React and import lint plugins currently declare ESLint 9 compatibility, and npm marks this major deprecated. Reassess the SDK-compatible dependency set during maintenance.
- Android 14 Pixel 3a API 34 emulator: launch BLOCKED. Expo Go 58.0.5 APK installation failed during boot, the package service returned a broken pipe and Android logged DeadSystemException. A separate read-only cold boot did not complete within three minutes. No on-screen app launch verified. iOS was not run on this Windows host. No native development builds, live banking API, or cloud services were exercised.
- Independent foundation review found missing referenced inputs. Included 23 unchanged inputs and the reviewer verified their hashes. Final static review of the manifest, lock, CI, and tests has no open findings.
- M0-01 deterministic acceptance passed. Ready for human PR review. Commit, hosted CI, merge, and native smoke evidence remain pending. The next feature is M0-02 design system and dev-only gallery. Use the temporary wordmark while the shared vector awaits stable provenance. Native Inter and the gallery are M0-02 implementation tasks. Later integration still needs a reachable native Keycloak environment. History and recipient-name lookup remain contract gaps.

## Durable documentation updates

[ADR 0001](../docs/adr/0001-mobile-foundation.md), merged AGENTS guidance and README setup instructions.
