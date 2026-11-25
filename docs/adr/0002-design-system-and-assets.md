# ADR 0002 — Native design tokens and shared brand assets

Status: Accepted

Date: 2026-11-25

## Context

M0-02 needs a mobile implementation of the approved Tiwalo design and a fixture-only gallery on the existing Expo SDK 58 scaffold. The web client uses Lucide 0.468.0 and Inter. The shared Tiwalo artwork has no approved source in the mobile checkout.

## Decision

- Define the approved palette once and use typed semantic roles with React Native StyleSheet. The gallery demonstrates the light palette. The app's appearance policy remains open.
- Use the upstream [Inter 4.1 release](https://github.com/rsms/inter/releases/tag/v4.1) static Regular and SemiBold TTFs from `extras/ttf/` and its OFL license. Load the files at runtime through the existing `expo-font` integration so compatible Expo Go builds can preview the UI.
- Bundle the needed [Lucide 0.468.0](https://github.com/lucide-icons/lucide/tree/0.468.0/icons) SVGs with the Lucide ISC and Feather MIT notices and render them through `expo-image`. The app supplies semantic colors and keeps decorative icons out of the accessibility tree.
- Display a temporary navy text wordmark until the shared mark is provided from an approved, stable source. Use a solid Peso Blue balance card pending approved artwork. The illustrative mockup is a reference for layout and hierarchy.
- Load the gallery from the existing root route only in development. Keep its examples outside the route tree and validate production export output before delivery.

## Alternatives and consequences

A styling framework would add setup and a second way to express the same tokens. The existing StyleSheet integration supports this set of native components. Bundled Lucide assets match the web icon family with a small local subset. Add new icons from the same pinned source and retain its notices. The reusable font loader reports readiness or failure so callers can control their loading state.

The source gray `#64748B` meets AA for normal text on paper at 4.76:1. Ivory needs deep ink because the gray pair reaches 4.48:1. The default pale border serves as a decorative divider. Field outlines and focus use stronger palette roles. Verify enabled text and meaningful control cues against their actual background.

## Related records

[ADR 0001](0001-mobile-foundation.md) · [M0-02 plan](../../prompts/M0-02-design-system.md) · [Approved written design](../design/TIWALO_MVP_DESIGN_SPEC.md)
