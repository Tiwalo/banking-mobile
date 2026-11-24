# Integrated release journey

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
With approved synthetic accounts, mobile A logs in and sends funds, web B verifies updated balance and contracted activity, authorized operator reviews B5 reconciliation evidence. Record actual API/backend evidence and both platform build identifiers. If web/backend milestone unavailable mark cross-repo gate BLOCKED. No store publishing.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
