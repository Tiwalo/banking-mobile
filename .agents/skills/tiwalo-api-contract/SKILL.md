---
name: tiwalo-api-contract
description: Integrate or review generated API types, contract pinning, RFC 9457 errors and PHP serialization.
---
# tiwalo-api-contract

Read docs/contracts/BACKEND_MVP_ALIGNMENT.md and inspect actual OpenAPI artifact. Record immutable SHA and endpoint availability. Generate types using approved tooling; CI detects drift. Validate fixtures against contract, no handwritten competing DTOs. Preserve decimal-string minor units and signed-long limits; parse/format losslessly. Map exact response/error semantics; mark missing endpoints blocked, never fabricate. Separate fixture adapters from integrated builds. Test cross-account denial and contract examples where applicable.
