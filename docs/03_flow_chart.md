# Signal Helper - Flow Chart

**Version:** 0.1.0
**Updated Date:** 2026-07-12

## Main User Flow

```
START
  |
  v
User / Admin Login
  |
  +---> User Portal
  |       |
  |       +---> Dashboard
  |       |
  |       +---> Register Signal
  |       |       |
  |       |       +--> Check broker server + account
  |       |       |       |
  |       |       |       +--> Exists: reuse old Signal ID
  |       |       |       +--> Not exists: create new 6-digit Signal ID
  |       |       |
  |       |       +--> Select Visibility: Public / Member Only / Private
  |       |       +--> Select Show Mode: Show All / Show From Date
  |       |       +--> Save active registration
  |       |
  |       +---> My Signals
  |       |       |
  |       |       +--> Signal Detail
  |       |               |
  |       |               +--> Export Trading History CSV
  |       |               +--> Open THA (Flow 1)
  |       |               +--> Start Analysis (Flow 2 - Live Signal)
  |       |
  |       +---> User Profile
  |               |
  |               +--> View User Signal Reference
  |               +--> Export Excel (Owner Only)
  |
  +---> Admin Console
          |
          +--> Environment Center
          |       +--> Environment Mapping
          |       +--> Release Status
          |       +--> Health Status
          |       +--> Operations
          |
          +--> User Management
          +--> Signal Control
          +--> Module Control
          +--> Release History
          +--> Update Full List (Docs Viewer)
END
```

## THA Flow 1 - Manual Analysis

```
Enter THA
  |
  v
Upload CSV
  |
  v
Select EA / Manual
  |
  v
Click Start Analysis
  |
  v
Enter Analysis Result System
  |
  v
Menu Navigation -> Different Analysis Sections
  |
  +--> [Save to CSV Library]
  |       |
  |       +--> Check sourceType + signalId in Firestore
  |       |       |
  |       |       +--> No record -> Create new
  |       |       +--> Existing -> Compare latestTradeTime
  |       |                           |
  |       |                           +--> New is newer -> Overwrite
  |       |                           +--> Old is newer -> Keep old
  |       |
  |       +--> Update CSV Library
  |
  +--> [Reset]
          |
          +--> Clean all state
          +--> Return to Upload CSV
```

## THA Flow 2 - Live Signal Direct Analysis

```
Live Signal Page
  |
  v
Click Start Analysis
  |
  v
Jump directly to THA
  |
  v
Direct Analysis (skip Upload step)
  |
  v
Enter Analysis Result System
  |
  v
Menu Navigation -> Different Analysis Sections
  |
  +--> [Save to CSV Library] (same as Flow 1)
  |
  +--> [Reset]
          |
          +--> Clean all state
          +--> Return to Upload CSV
```

## CSV Library Save Flow

```
User clicks Save to CSV Library
  |
  v
Compute latestTradeTime from CSV
  |
  v
Compute rawCsvHash
  |
  v
Query Firestore: sourceType__signalId
  |
  +--> No record found
  |       |
  |       v
  |     Create new document
  |     (sourceType, signalId, eaName, tradeMode,
  |      csvFileName, summaryStats, latestTradeTime,
  |      importedAtHKT, schemaVersion)
  |
  +--> Record exists
          |
          v
        Compare new vs old latestTradeTime
          |
          +--> New is newer -> Overwrite document
          +--> Same or older -> Keep existing, skip write
```

## Delete / Re-register Flow

```
User deletes Signal
  |
  v
Remove active registration
  |
  v
Preserve identity only:
  - Signal ID
  - Broker Server
  - Account No
  - identityHash
  |
  v
User re-registers same broker + account
  |
  v
System finds existing identity -> Restore same Signal ID
```

## Deploy Flow (Dev to Prod)

```
Build in Dev Portal (tss_development)
  |
  v
Test in Dev Admin Console
  |
  v
Validate in UAT
  |
  v
Confirm release readiness
  |
  v
Deploy to Prod Portal (signalhelper)
  |
  v
Record in Release History
  - Version number
  - Release time (HKT)
  - Operator
  - Release notes
END
```
