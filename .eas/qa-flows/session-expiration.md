# Session expiry during transfer

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
Using test harness expire token around pending submission. Check secure reauth, no auto-submit, actor-scoped recovery and no disclosure on switch; reconcile original attempt using contract. Ensure cached sensitive data cleared. Never capture tokens.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
