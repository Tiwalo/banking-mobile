# ADR 0003 — Banking contract, PHP precision, and server state

Status: Accepted for M1-01

Date: 2026-11-25

## Context

The Expo app consumes the Spring backend's OpenAPI 3.1.1 artifact. The app must reproduce generation and verify its boundary on Windows and CI without a banking runtime. The backend owns permissions, balances, and financial outcomes.

## Decision

- Vendor `api/openapi/banking-v1.yaml` byte-for-byte from the immutable banking-core-api Git commit recorded in `api/openapi/pin.json`. Generate declarations and Ajv 2020-12 standalone validators from that source. Keep the build-only generator in `scripts/contract` with its own lock and TypeScript 5 peer. The Expo app uses TypeScript 6 and runs the precompiled validators and their runtime helpers. [Pinned source](https://github.com/Tiwalo/banking-core-api/blob/fc06aebdc53ae2e4a28e54aaeb875294e317e8c1/api/openapi/banking-v1.yaml)
- Require the explicit, public `EXPO_PUBLIC_BANKING_API_BASE_URL` configuration when creating the adapter. Use a trusted HTTPS URL ending in `/api/v1`, with controlled loopback and Android emulator HTTP allowed in development if the platform permits it. Each read receives a caller-supplied bearer token. Validate the response before handing it to a consumer. Normalize RFC 9457 problems to safe errors containing a local message, kind, and optional HTTP status.
- Preserve PHP centavos as canonical decimal strings through `9223372036854775807`. The draft parser uses string operations, the wire checks enforce nonnegative balances and positive transfer amounts, and the existing signed display formatter supports `-9223372036854775808`.
- Use TanStack Query with a fresh in-memory client for each authenticated session and API environment. When a future auth scope changes, unmount old observers, dispose of the old client, and create a fresh client for the next scope. Queries pass their cancellation signal to the adapter. Disable automatic retries, focus/reconnect refetches and offline replay. The fixture transport belongs to Jest.

## Consequences

Run `npm ci` and `npm ci --prefix scripts/contract`, then `npm run contract:check` to compare generated output offline. For a reviewed backend revision, update the vendored bytes and pin together, then run `npm run contract:generate` and review the adapter, declarations, validators and fixture tests as one change. A hand-maintained DTO or schema would duplicate the backend contract. A custom cache would need to provide cancellation, deduplication and actor isolation separately.

M1-01 exposes owned account list/detail and known receipt GETs. The next integration requires a reachable service and issuer, authorized synthetic identities, and device evidence. Future transfer submission relies on the backend's documented status, receipt and idempotency semantics. Roll back the pin, adapter, generated output and both lockfiles together where applicable. [Feature plan](../../prompts/M1-01-api-contract.md)
