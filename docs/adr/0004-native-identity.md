# ADR 0004 — Native authentication, redirects, and actor isolation

Accepted for M2-01. See the [feature plan](../../prompts/M2-01-native-session.md).

## Identity and authorization

Use an environment-specific public Keycloak client with enforced S256, standard flow and `openid`. Use the system browser and require fresh hosted authentication for every interactive sign-in. Credential entry stays with Keycloak. The proposed development namespace and exact private-use redirect must be confirmed by the identity owner. Configure the issuer, client ID and HTTPS API base at build time. The issuer, mobile devices and Spring must agree on the exact realm URL. Bind discovery to the expected Keycloak realm endpoints. Register RS256 for ID tokens, with the mobile client as single audience, and the banking API audience mapper on access tokens.

AuthSession generates the verifier and S256 challenge. The app validates a one-time return before exchanging the code. Token grants use direct HTTPS responses from the discovered token endpoint with redirects disabled. TLS server authentication establishes the issuer under [OIDC Core §3.1.3.7](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation). No identity assertion enters through a link or from locally persisted JWTs. Spring independently verifies access-token signatures, maps exact issuer/subject, and grants banking roles. One validated account read confirms customer admission. An empty page is valid.

## Native storage and lifetime

SecureStore holds one versioned, environment-bound pending request or rotating refresh record. Access and ID tokens stay out of persistence. Bind the record to a random non-secret file in the app cache. Loss of this file, including OS eviction, requires a new sign-in. Use unlocked device-only Keychain accessibility and exclude Android secure preferences from backup. Consume the pending request before exchange. Termination after consumption requires fresh sign-in. Serialize refresh and credential writes. Require a different refresh token on each rotation. A session without a refresh token lasts only in memory.

Logout closes customer access immediately, invalidates restoration and performs best-effort bounded credential revocation. The next explicit login uses Keycloak’s login prompt. Prior-session reads and their results cannot cross a scope change. Data reads expose only the contracted GET methods, and per-session query clients disable retries and automatic refetch. Future financial commands require their own reviewed flow.

## Build and rollback

The SDK 58 development client requires a rebuilt native binary on both platforms. Development package and bundle identifiers are reserved for the synthetic environment. Native network inspection is disabled in the integrated client. A build with explicit fixture preview enabled and no service configuration can open the existing development gallery and preview. Real customer sessions require authenticated API admission.

Rollback disables authentication at public entry, retires the storage namespace, and removes its entries on the next supported launch before any subsequent restoration. A remote realm policy change is coordinated with its owner.
