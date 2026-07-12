# Signal Helper - Site Map & Architecture Diagram

**Version:** 0.1.0
**Updated Date:** 2026-07-12

## Site Map

```
Signal Helper
├── Public / Member Portal
│   ├── Dashboard
│   ├── My Signals
│   ├── Register Signal
│   ├── Signal Directory
│   ├── Signal Detail
│   │   ├── Export Trading History CSV
│   │   ├── Open THA
│   │   └── Start Analysis (Live Signal - Flow 2)
│   ├── Cross Power
│   ├── World Monitor
│   ├── Export Trading History
│   ├── Open THA
│   └── User Profile
│       ├── User Signal Reference
│       └── Export Excel (Owner Only)
│
├── Admin Console
│   ├── Admin Dashboard
│   ├── Environment Center
│   │   ├── Environment Mapping
│   │   ├── Release Status
│   │   ├── Health Status
│   │   └── Operations
│   ├── User Management
│   ├── Signal Control
│   ├── Module Control
│   ├── Release History
│   └── Update Full List (Docs Viewer)
│
├── Dev Portal (tss_development)
│   ├── Dev Testing Views
│   ├── Dev Admin Console
│   └── UAT / Preview Release
│
└── THA Integration
    ├── Flow 1: Upload CSV -> Select EA/Manual -> Analyse
    └── Flow 2: Live Signal -> Direct Analyse
```

## Architecture Diagram

```
[tss_development Repo]
  --> [Dev Portal Hosting]
  --> [Firebase: ai-signal-portal]
        ├── Auth
        ├── Firestore
        │   └── signals_library (collection)
        ├── Storage
        └── Dev Admin Console
              └── Update Full List (Docs Viewer)

[signalhelper Repo]
  --> [Prod Portal Hosting]
  --> [Firebase: shenxu-signal-helper]
        ├── Auth
        ├── Firestore
        │   └── signals_library (collection)
        ├── Storage
        └── Prod Admin Console

[Admin Console]
  ├── Environment Center
  ├── User Management
  ├── Signal Control
  ├── Module Control
  ├── Release History
  └── Update Full List (Docs Viewer)
        ├── 01 Project Detail
        ├── 02 Site Map & Architecture
        ├── 03 Flow Chart
        ├── 04 Mind Map
        ├── 05 Files & Version Inventory
        └── 06 Project Status

[CSV Library]
  ├── Source: algoforest (e.g. algoforest__20666)
  └── Source: internal (e.g. internal__GH1001)
        ├── tradeMode: algoforest_ea
        ├── tradeMode: external_ea
        └── tradeMode: manual

[THA]
  ├── Flow 1: Upload CSV -> EA/Manual -> Analyse -> Menu -> Reset
  └── Flow 2: Live Signal -> Direct Analyse -> Menu -> Reset
```

## Folder Structure (Dev Portal)

```
tss_development/
├── docs/
│   ├── 01_project_detail.md
│   ├── 02_site_map_architecture.md
│   ├── 03_flow_chart.md
│   ├── 04_mind_map.md
│   ├── 05_files_version_inventory.md
│   ├── 06_project_status.md
│   └── signals_library_schema.md
├── js/
│   ├── csv-library.js
│   ├── firebase-library-service.js
│   └── signal-helper-export.js
├── css/
│   └── signalhelper.css
├── admin/
│   └── index.html
└── index.html
```
