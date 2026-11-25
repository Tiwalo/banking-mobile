---
name: tiwalo-mobile-security
description: Implement or review Keycloak OIDC PKCE, secure token lifecycle, protected routes and mobile privacy.
---
# tiwalo-mobile-security

Consult matching Expo/AuthSession/SecureStore and Keycloak docs. Public native client, system browser, authorization code + PKCE, state and applicable nonce, approved issuer/audience and exact registered redirects. No embedded secret or credential-entry clone. Validate callback, storage failure, refresh concurrency, expiry, logout and actor switches. Clear user-scoped cache and credentials; protect deep links and sensitive evidence. Secure recovery data scoped to actor; no auto replay after reauth. Development build verification on Android/iOS; Expo Go alone insufficient. Do not access production DB or credentials.
