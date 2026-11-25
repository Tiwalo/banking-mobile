# Owned accounts and activity

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
Using live preview API, compare displayed balances and masked references to authorized responses. Verify no other customer data, loading/empty/error/refresh, correct PHP formatting. Test history and pagination only if contracted; record BLOCKED otherwise. No fake values or optimistic mutation.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
