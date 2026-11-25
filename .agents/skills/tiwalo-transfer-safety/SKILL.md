---
name: tiwalo-transfer-safety
description: Implement or review Send Money, monetary precision, idempotency, definitive declines and unknown outcome recovery.
---
# tiwalo-transfer-safety

Read actual B4 contract plus relevant ADR. Validate source, opaque recipient, PHP string amount; review before confirm. Generate strong key once per logical attempt and securely preserve canonical payload and actor binding before submission. No parallel tap submission, auto mutation retry or offline queue. On lost response, app kill or timeout show unknown; use documented lookup or explicit same-key replay. Keep unresolved attempt visible even if user edits form; never auto-create new key. A confirmed decline is replayed as original even after funding. Changed payload with old key is conflict. Confirmed receipt/balances from backend only. Test commit-response loss, 409/422/503, expiry, app restart, wrong actor and duplicate tap. Backend evidence proves exactly once; screenshots cannot.
