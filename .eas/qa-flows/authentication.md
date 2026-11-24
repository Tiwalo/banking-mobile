# Authentication and session lifecycle

Preconditions: approved test environment/build, human-authorized run, isolated synthetic identities; read docs/qa/EXPO_QA_SETUP.md.

## Steps and acceptance
Use approved synthetic account via Keycloak-hosted browser. Check redirect and protected routes, session restoration and logout; test invalid/expired session using approved harness, not real credentials. On logout or switch verify previous account content unavailable. Do not capture credential entry or tokens. Expo Go not proof of native redirect.

## Report
PASS only with observed evidence; FAIL with reproducible defect; BLOCKED if prerequisite or test mechanism missing. Record platform, build SHA, contract SHA, sanitized evidence and limitations. Do not edit code, expose secrets, or claim unrun verification.
