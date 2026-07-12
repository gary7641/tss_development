# Signal Helper - Mind Map

**Version:** 0.1.0
**Updated Date:** 2026-07-12

## Mind Map

```
Signal Helper v0.1.0
|
+-- Environment Strategy
|     +-- Dev Firebase: ai-signal-portal
|     +-- Prod Firebase: shenxu-signal-helper
|     +-- Dev Repo: tss_development
|     +-- Prod Repo: signalhelper
|
+-- UI Direction
|     +-- Header / Style from A2 (Trading History Analytics)
|     +-- Sidebar from A1 (Trading Signals Studio)
|     +-- Web Mode
|     +-- Mobile Mode
|
+-- Sidebar (by Priority)
|     +-- Priority 1
|     |     +-- Dashboard
|     |     +-- My Signals
|     |     +-- Register Signal
|     |     +-- User Profile
|     |
|     +-- Priority 2
|     |     +-- Cross Power
|     |     +-- Open THA
|     |     +-- User Signal Reference
|     |     +-- Signal Directory
|     |
|     +-- Priority 3
|     |     +-- World Monitor
|     |     +-- Export Trading History
|     |     +-- Admin Console
|     |
|     +-- Priority 4
|           +-- Environment Center
|           +-- User Management
|           +-- Module Control
|           +-- Release History
|
+-- Core Modules
|     +-- Signal Registration
|     +-- Signal Detail
|     +-- User Profile & Signal Reference
|     +-- Admin Console
|     +-- Environment Center
|     +-- THA Integration
|     +-- CSV Library
|     +-- World Monitor
|     +-- Cross Power
|
+-- Signal Rules
|     +-- 6-digit Signal ID
|     +-- identityHash
|     +-- Broker Server + Account binding
|     +-- Visibility: Public / Member Only / Private
|     +-- Show All / Show From Date
|     +-- Delete keeps identity only
|     +-- Re-register restores same Signal ID
|
+-- CSV Library
|     +-- Source Types
|     |     +-- algoforest (e.g. algoforest__20666)
|     |     +-- internal (e.g. internal__GH1001)
|     |
|     +-- Trade Modes
|     |     +-- algoforest_ea
|     |     +-- external_ea
|     |     +-- manual
|     |
|     +-- Keep Latest Logic
|     |     +-- Compare latestTradeTime
|     |     +-- One record per sourceType + signalId
|     |
|     +-- Internal CSV Naming
|           +-- Signal-G-Helper_EANAME-VER_YYYYMMDD_HHMMSS_SIGNALID.csv
|           +-- Time: HKT (UTC+8)
|           +-- Signal ID always last
|
+-- THA Integration
|     +-- Flow 1: Upload CSV -> EA/Manual -> Analyse -> Menu -> Reset
|     +-- Flow 2: Live Signal -> Direct Analyse -> Menu -> Reset
|     +-- Save to CSV Library
|     +-- Reset: clean all state -> return to Upload CSV
|
+-- Admin Console
|     +-- Environment Center
|     +-- Member Level Control
|     +-- Signal Visibility Control
|     +-- Module On/Off Control
|     +-- Release History
|     +-- Update Full List (Docs Viewer)
|           +-- 01 Project Detail
|           +-- 02 Site Map & Architecture
|           +-- 03 Flow Chart
|           +-- 04 Mind Map
|           +-- 05 Files & Version Inventory
|           +-- 06 Project Status
|
+-- Security / Access
      +-- Owner-only User Signal Reference export
      +-- Admin cannot export User Signal Reference
      +-- Signal CSV is signal-level shared action
      +-- 4 Member Levels: Admin / Supervisor / Senior / User
```

## Version Roadmap

```
0.1.0 -> Planning & Documentation Baseline
0.2.0 -> Files plan + Schema plan confirmed
0.3.0 -> Dev Portal foundation built
0.5.0 -> Core signal flow complete
0.7.0 -> Admin Console core complete
0.9.0 -> UAT / fix / release prep
1.0.0 -> First stable production release
```
