# Signal Helper - Project Status

**Version:** 0.1.0
**Updated Date:** 2026-07-12

## Current Phase

**Phase:** Phase 1 - Planning & System Definition
**Status:** In Progress
**Environment:** Development Portal (tss_development)

## Phase Overview

| Phase | Focus | Status |
|---|---|---|
| Phase 1 | Requirement confirmation, scope locking, documentation baseline | In Progress |
| Phase 2 | Files plan + Firebase schema + page/module breakdown | Pending |
| Phase 3 | Dev Portal foundation (layout, routing, auth, Firebase setup) | Pending |
| Phase 4 | Core signal flow (registration, detail, CSV, THA, profile) | Pending |
| Phase 5 | Admin Console core + Environment Center | Pending |
| Phase 6 | Prod Portal setup + release flow | Pending |
| Phase 7 | UAT + fixes + 1.0.0 readiness review | Pending |

## Schedule (Version Milestones)

| Version | Target | Status |
|---|---|---|
| 0.1.0 | Planning & Documentation Baseline | Completed |
| 0.2.0 | Files plan + Firebase schema confirmed | Pending |
| 0.3.0 | Dev Portal foundation built | Pending |
| 0.5.0 | Core signal flow complete | Pending |
| 0.7.0 | Admin Console core complete | Pending |
| 0.9.0 | UAT / fix / release prep | Pending |
| 1.0.0 | First stable production release | Pending |

## Task Details

### Confirmed / Completed

| Priority | Task | Status |
|---|---|---|
| High | Lock dual Firebase project structure | Confirmed |
| High | Lock Dev / Prod repo mapping | Confirmed |
| High | Lock Admin Console scope | Confirmed |
| High | Add Environment Center module | Confirmed |
| High | Add Update Full List (Docs Viewer) to Admin Console | Confirmed |
| High | Lock Signal ID + identityHash rule | Confirmed |
| High | Lock delete / re-register identity retention rule | Confirmed |
| High | Lock User Signal Reference owner-only export rule | Confirmed |
| High | Lock signal-level CSV + THA actions | Confirmed |
| High | Lock THA Flow 1 (Upload CSV) and Flow 2 (Live Signal) | Confirmed |
| High | Lock CSV Library sourceType + tradeMode categories | Confirmed |
| High | Lock internal CSV naming rule (HKT, EA name, Signal ID last) | Confirmed |
| High | Lock keep-latest logic by latestTradeTime | Confirmed |
| High | Lock Sidebar priority order (Priority 1-4) | Confirmed |
| High | Add World Monitor + Cross Power to Sidebar | Confirmed |
| High | Establish signals_library_schema.md | Confirmed |
| High | Begin csv-library.js planning | Confirmed |

### Pending

| Priority | Task | Status |
|---|---|---|
| High | Complete csv-library.js v0.1.0 | Pending |
| High | Complete firebase-library-service.js v0.1.0 | Pending |
| High | Complete signal-helper-export.js v0.1.0 | Pending |
| Medium | Define exact Admin Console page layout | Pending |
| Medium | Define Public / Member Portal page structure | Pending |
| Medium | Define Firebase collections / storage structure | Pending |
| Medium | Define THA handoff format (Flow 2 data passing) | Pending |
| Medium | Define web/mobile UI behaviour rules | Pending |
| Medium | Build Dev Portal index.html skeleton | Pending |
| Medium | Build Admin Console admin/index.html skeleton | Pending |
| Low | Define advanced audit logging | Pending |
| Low | Define scheduled release process | Pending |

## Immediate Next Steps

1. Complete remaining docs files in GitHub (signals_library_schema.md)
2. Build js/ files: csv-library.js, firebase-library-service.js, signal-helper-export.js
3. Build css/signalhelper.css skeleton
4. Build admin/index.html with Update Full List (Docs Viewer) section
5. Build index.html main portal skeleton
6. Define Admin Console page modules in detail
7. Define Public Portal page structure
