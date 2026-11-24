# Ambiguous transfer and restart

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
Use approved fault injection to lose response after backend commit. Verify unknown outcome, no success or definite failure, no auto retry or fresh key on restart/reconnect. Recover explicitly by contracted lookup or same-key replay. Test canonical request preservation, actor switch denial, conflict 409, stored 422 and transient 503 via approved fixtures/harness. Verify backend posted once; if fault injection or live API unavailable mark BLOCKED, not passed.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
