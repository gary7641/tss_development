# Signal Helper - Files & Version Update Inventory

**Version:** 0.1.0
**Updated Date:** 2026-07-12

## Version History

| Version | Date | Status | Summary |
|---|---|---|---|
| 0.1.0 | 2026-07-12 | Initial Development | First planning baseline. Docs, schema, CSV library rules, EA categories, HKT naming, THA flows, Sidebar priority confirmed. |

## Documentation Files

| File | Purpose | Version | Status |
|---|---|---|---|
| `docs/01_project_detail.md` | Master project definition | 0.1.0 | Active |
| `docs/02_site_map_architecture.md` | Site map and architecture diagram | 0.1.0 | Active |
| `docs/03_flow_chart.md` | Core user/admin/system/THA/deploy flows | 0.1.0 | Active |
| `docs/04_mind_map.md` | Idea structure and scope map | 0.1.0 | Active |
| `docs/05_files_version_inventory.md` | Version and file tracking | 0.1.0 | Active |
| `docs/06_project_status.md` | Phase / schedule / task tracking | 0.1.0 | Active |
| `docs/signals_library_schema.md` | Firestore signals_library schema definition | 0.1.0 | Active |

## Code Files

| File | Purpose | Version | Status |
|---|---|---|---|
| `js/csv-library.js` | CSV parse, summaryStats, buildLibraryRecord, importCsvToLibrary | 0.1.0 | Planned |
| `js/firebase-library-service.js` | Firestore saveOrUpdateSignalRecord, getSignalRecord, listSignalRecords | 0.1.0 | Planned |
| `js/signal-helper-export.js` | Internal CSV export with HKT naming rule | 0.1.0 | Planned |
| `css/signalhelper.css` | Portal styles (Header from A2, Sidebar from A1) | 0.1.0 | Planned |
| `admin/index.html` | Admin Console Dev Portal (includes Update Full List Docs Viewer) | 0.1.0 | Planned |
| `index.html` | Main portal entry point | 0.1.0 | Planned |

## CSV Library Rules Summary

| Rule | Value |
|---|---|
| Uniqueness Key | sourceType + signalId |
| Keep Logic | Compare latestTradeTime, keep newer |
| Internal Naming | Signal-G-Helper_EANAME-VER_YYYYMMDD_HHMMSS_SIGNALID.csv |
| Time Standard | HKT (UTC+8), fixed, no DST |
| Source Types | algoforest, internal |
| Trade Modes | algoforest_ea, external_ea, manual |

## Next Version Targets

| Version | Target |
|---|---|
| 0.2.0 | Files plan + Firebase schema confirmed |
| 0.3.0 | Dev Portal foundation built |
| 0.5.0 | Core signal flow complete |
| 0.7.0 | Admin Console core complete |
| 0.9.0 | UAT / fix / release prep |
| 1.0.0 | First stable production release |
