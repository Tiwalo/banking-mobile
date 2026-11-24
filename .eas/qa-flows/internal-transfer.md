# Confirmed internal transfer

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
Use funded isolated synthetic source and permitted recipient. Record authorized source/recipient balances through approved API/test harness. Enter reviewed PHP amount; submit once and verify definitive receipt and updated backend-backed balances; exercise duplicate tap with deterministic test. Verify original receipt on replay using test harness and backend posting evidence. Never use real funds or direct DB writes.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
