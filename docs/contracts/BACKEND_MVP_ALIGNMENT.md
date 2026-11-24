# Backend MVP alignment — planning baseline, not runtime contract
Source: previously supplied banking-core-api MVP plan (Pasted text(4).txt); actual branches and API availability must be checked by Codex. No implementation status asserted here.

| Backend milestone | Mobile dependency |
| --- | --- |
| B0 chore/backend-verification | M0 reproducible environment; independent scaffold work possible |
| B1 feat/api-v1-contract | M1 OpenAPI 3.1 `api/openapi/banking-v1.yaml`, `/api/v1`, immutable artifact pin; mark runtime availability separately |
| B2 feat/identity-and-accounts | M2 verified issuer/subject actor mapping, owner-scoped accounts, separate operator roles, opaque recipient references |
| B3 feat/ledger-posting | M3 real funded balances from balanced sealed ledger postings; no holds in planned MVP |
| B4 feat/atomic-internal-transfers | M4 synchronous atomic posting, owner-scoped receipt lookup, actor-scoped idempotency, stored definite declines, rollback releases claim, same key replay |
| B5 feat/reconciliation-investigation | Web operator-only read findings; cross-repo release evidence, no mobile ops |

Backend owns ledger, limits, ownership, statuses and financial data. PHP centavos stored as checked long/BIGINT, decimal strings on wire. B1 plans 201 and replay, 409 conflicting key, 422 definite business decline, retryable 503, RFC 9457; actual schema/semantics must be verified. Technical/network ambiguity stays unresolved until documented lookup or same-key replay; original definite decline replays even after funding. No assumptions about arbitrary transfer status lookup or receipt ID discovery after response loss; use documented same-key replay if lookup is unavailable. Do not invent a customer history feed, recipient name lookup/validation, filters, profile fields, account status enum, or ledger data. Record gaps with owner, required contract change, affected feature and safe interim state. No other repository edits without approval.
