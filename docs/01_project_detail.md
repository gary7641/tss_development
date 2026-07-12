# Signal Helper - Project Detail

**Project:** Signal Helper
**Version:** 0.1.0
**Release Status:** Initial Development / Internal Planning Release
**Updated Date:** 2026-07-12
**Environment:** Development Portal (tss_development)

## Project Overview

Signal Helper is a trading signal management and analysis portal with strict Dev/Prod environment separation. Dev Portal uses Firebase Project `ai-signal-portal` and repo `gary7641/tss_development`. Prod Portal uses Firebase Project `shenxu-signal-helper` and repo `gary7641/signalhelper`.

UI direction: Header and overall style follow Trading History Analytics (A2). Sidebar structure follows Trading Signals Studio (A1). Supports Web and Mobile modes.

## Core Project Direction

- Development Repo: `gary7641/tss_development`
- Production Repo: `gary7641/signalhelper`
- Development Firebase: `ai-signal-portal`
- Production Firebase: `shenxu-signal-helper`
- Baseline Version: `0.1.0`
- Target Release Version: `1.0.0`

## Sidebar Structure (Priority Order)

### Priority 1 (MVP - Build First)
- Dashboard
- My Signals
- Register Signal
- User Profile

### Priority 2
- Cross Power
- Open THA
- User Signal Reference
- Signal Directory

### Priority 3
- World Monitor
- Export Trading History
- Admin Console

### Priority 4
- Environment Center
- User Management
- Module Control
- Release History

## THA Integration

### Flow 1 - Manual Analysis
1. Upload CSV
2. Select EA / Manual
3. Click Start Analysis
4. Enter result system with Menu navigation
5. Reset -> clean all state -> return to Upload CSV

### Flow 2 - Live Signal Direct Analysis
1. Click Start Analysis on Live Signal
2. Jump directly to THA and analyse
3. Enter result system with Menu navigation
4. Reset -> clean all state -> return to Upload CSV

### Save to CSV Library
- Save analysis result to CSV Library
- Categorised by: Algo Forest Signal ID vs Internal Signal ID
- One record per sourceType + signalId (latest data wins)

## CSV Library Rules

### Source Types
| sourceType | Description |
|---|---|
| `algoforest` | From Algo Forest Signal Page |
| `internal` | From Internal Portal |

### Trade Modes
| tradeMode | Description |
|---|---|
| `algoforest_ea` | Algo Forest EA |
| `external_ea` | Non-Algo Forest EA |
| `manual` | Manual Trading |

### Internal CSV Naming
`Signal-G-Helper_EANAME-VER_YYYYMMDD_HHMMSS_SIGNALID.csv`
- Time: HKT (UTC+8), fixed, no DST
- EA name + version: English and numbers only, use `-`
- Signal ID always last
- No special characters

Examples:
- `Signal-G-Helper_VM13-5SMA5CCY-V1_20260712_150000_20666.csv`
- `Signal-G-Helper_ManualTrade-V1_20260712_150000_MNL001.csv`

### Keep Latest Logic
1. Compute new CSV latestTradeTime
2. Query Firestore by sourceType__signalId
3. No record -> create new
4. Existing record -> compare latestTradeTime, keep newer

## Signal Model

### Identity Layer (Permanent)
- Signal ID (6-digit)
- Broker Server
- Account No
- identityHash

### Registration Layer (Active)
- Visibility: Public / Member Only / Private
- Show Mode: Show All / Show From Date
- Published / Hidden Status

### Delete Rule
Preserve: broker server + account + signal ID + identityHash only.
Re-registration restores same Signal ID.

## Member Levels
- Admin
- Supervisor
- Senior
- User

## User Signal Reference (Private)
- Broker, Server, Account, Investor Password
- Location (VPS/VM/Input), MT4 Number
- EA/Manual, Signal Name, Deposit, Leverage
- Profit, Balance, MDD, Start Date
- Owner export only. Admin cannot export.

## Signal-Level Actions
- Export Trading History CSV
- Open THA
- Start Analysis (Live Signal Flow 2)
