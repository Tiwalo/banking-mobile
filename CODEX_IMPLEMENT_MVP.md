# Codex implementation mode — one approved feature

Inputs: approved milestone/feature plan path or approved plan in current conversation, expected branch, explicitly authorized actions. If missing, stop and identify the missing input. Do not implement the whole MVP.

1. Read AGENTS.md, selected feature plan, relevant ADR(s), and only matching skills. Inspect Git status/branch and impacted code; preserve user changes. If branch or contract differs, report blocker; do not switch automatically.
2. Confirm goal, scope, prerequisites and acceptance gates in a short note. Record the approved plan in prompts/ if authorized and not already present. Do not reopen settled decisions; stop for scope/architecture/dependency changes.
3. Implement smallest coherent increment, reuse tokens/components and existing adapters. Use official version-matched documentation as needed. Isolate synthetic fixtures and never bypass production auth. No unrelated cleanup.
4. Run relevant deterministic checks, targeted regressions and requested native QA; record commands/outcomes, not assumptions. Do not repeatedly run expensive suites unnecessarily; final relevant CI gates remain mandatory. Do not enable EAS services, install dependencies or alter credentials without approval.
5. For substantial changes invoke independent review only when authorized; use CODEX_REVIEW_MVP.md. For auth/financial changes obtain two independent perspectives, fix confirmed blocking findings and rerun affected checks. No endless review loops.
6. Update approved ADRs and durable project rules only as needed; write completion report to feature plan. Return changed files, actual verification, device limitations, contract pin, open blockers and next step. Never claim release ready on fixture-only verification. No commit/push/merge/publish without explicit permission.
