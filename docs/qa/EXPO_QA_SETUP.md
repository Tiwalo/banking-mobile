# Progressive Expo QA setup (not yet provisioned)

## M0–M2: local and on-demand device verification
- Verify installed official Expo skills/plugin and version-specific docs; use Expo Go only for supported UI previews. Use development builds for native auth and redirects. Windows supports Android tooling; use an available cloud iOS simulator/build or authorized Mac/physical device for iOS verification. Do not claim iOS verified from Android or web.
- Follow https://docs.expo.dev/eas/simulators/get-started/ and https://docs.expo.dev/eas/simulators/how-to/verify-a-change-with-an-agent/. Check account access, credits, app build compatibility and session budget before launch. One bounded session/platform as needed; stop and clean up. No cloud services required to start planning.
- Use synthetic preview API + Keycloak reachable from devices, consistent HTTPS issuer and registered native redirects; localhost on developer PC is not cloud localhost. No production endpoint or real accounts. Separate test users/fixtures per lane and reset only via approved backend test tooling, not direct financial DB edits. Never ship QA credentials in app binaries.

## M5: optional trusted Agentic CI
Reference: https://docs.expo.dev/agentic-workflows/setup/ and https://docs.expo.dev/agentic-workflows/agentic-ci/ (verify current steps at implementation time). Connect only banking-mobile GitHub repository to intended Expo project. Review EAS project and build profiles, keep simulator profiles distinct from physical-device builds where needed. Create dedicated Expo robot with narrowest supported permission; store token only in approved secret environment. Configure Codex runner credentials per official instructions, separate API billing from ChatGPT subscription. Confirm spend limits before enabling.

Use dedicated isolated QA preview environment with no unrelated secrets; agent runner can read worker environment. Do not run secret-bearing workflows on untrusted PR/fork content; require human review/trigger of trusted revision and enforce server-side environment permissions. Do not rely on prompt guardrails alone. GitHub write token not needed for initial read-only QA; if required for PR evidence, grant least privilege, repository scope, expiry and rotate. Never grant broad content write merely for comments; use platform-native mechanism where supported. No automatic issue-to-PR or merges. Keep workflow YAML absent until actual EAS config/runner requirements verified and approved. Do not copy sample tokens into files or prompts.

Use deterministic lint/type/unit/contract/E2E gates on appropriate PRs; Agentic CI is supplemental exploratory evidence for significant UI/integration work. For each run: specific commit, one approved flow, budget/time limit, no source edits, redacted screenshots/report, PASS/FAIL/BLOCKED; close sessions. No token-saving guarantee. Do not fail or pass financial correctness solely on an agent verdict.

## M6: optional bounded QA swarm
Run selected independent flows on Android and iOS release candidates only if access/cost approved; isolate fixtures, cap parallelism, stop on budget. See https://docs.expo.dev/agentic-workflows/introduction/. Require human release approval and deterministic/backend evidence regardless of swarm availability.

## Evidence format
Commit/build ID; platform/OS/device; fixture vs integrated; contract SHA; flow; steps and observations; sanitized artifact references; PASS/FAIL/BLOCKED; skipped tests and reason. No credentials, tokens, full identifiers, real financial data. Keep evidence access restricted and redact before posting PR comments. No unsupported data claims.
