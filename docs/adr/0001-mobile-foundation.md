# ADR-0001 — Verify the existing Expo SDK 58 scaffold

Status: Accepted for M0-01  
Date: 2026-11-24

## Context

The scaffold uses npm, strict TypeScript, Expo Router and generated native projects. It needs checks that run from a clean checkout on Windows and CI without banking services.

## Decision

Keep the current SDK and route root `src/app`. Use Node 26.1.0, npm 11.14.0, the npm lockfile, Expo ESLint config, strict tsc, Jest Expo and React Native Testing Library. GitHub Actions runs the same checks as contributors. Keep diagnostic commands and on-device evidence separate from the deterministic suite.

## Alternatives and consequences

Node's test runner covers pure functions but cannot render this native entry with the SDK mocks. Device-only tests would require native tooling for every foundation change. The test preset and renderer must be checked together when upgrading React or Expo. Revert the foundation change as a unit to roll back. See the [feature plan](../../prompts/M0-01-foundation.md).
