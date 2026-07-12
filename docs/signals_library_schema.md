# Signal Helper - Signals Library Schema

**Version:** 0.1.0
**Updated Date:** 2026-07-12
**Firebase Collection:** `signals_library`

## Collection: `signals_library`

### Document ID Convention

`<sourceType>__<signalId>`

Examples:
- `algoforest__20666`
- `internal__GH1001`
- `internal__MNL001`

### Core Fields

| Field | Type | Values | Description |
|---|---|---|---|
| `sourceType` | string | `algoforest`, `internal` | Signal source category |
| `tradeMode` | string | `algoforest_ea`, `external_ea`, `manual` | Trade execution type |
| `signalId` | string | e.g. `20666`, `GH1001` | Signal ID |
| `signalName` | string | e.g. `FF48 Gary` | Signal display name |
| `eaName` | string | e.g. `VM13-5SMA5CCY` | EA name (without version) |
| `eaVersion` | string | e.g. `V1`, `V2` | EA version |
| `eaFullName` | string | e.g. `VM13-5SMA5CCY-V1` | EA name + version combined |
| `eaCategory` | string | `algoforest`, `non_algoforest`, `manual` | EA category |
| `operatorType` | string | `ea`, `manual` | Execution operator type |
| `strategyTag` | string | e.g. `5SMA5CCYBUY` | Strategy tag from comment |

### File & Version Fields

| Field | Type | Description |
|---|---|---|
| `csvFileName` | string | Full CSV filename e.g. `Signal-G-Helper_VM13-5SMA5CCY-V1_20260712_150000_20666.csv` |
| `schemaVersion` | string | Schema version e.g. `v1` |
| `recordStatus` | string | `active`, `archived`, `testing` |

### Time Fields (UTC stored, HKT displayed)

| Field | Type | Description |
|---|---|---|
| `generatedAt` | Timestamp | When the record was first generated (UTC) |
| `importedAt` | Timestamp | When the CSV was imported (UTC) |
| `latestTradeTime` | Timestamp | Latest trade closeTime or openTime in CSV (UTC) |
| `generatedAtHKT` | string | HKT string for display e.g. `2026-07-12T15:00:00+08:00` |
| `importedAtHKT` | string | HKT string for display |
| `latestTradeTimeHKT` | string | HKT string for display |

### Summary Stats Fields

Stored as a nested `summaryStats` map:

| Field | Type | Description |
|---|---|---|
| `totalTrades` | number | Total number of closed trades |
| `grossProfit` | number | Sum of positive netProfit |
| `grossLoss` | number | Sum of negative netProfit |
| `winRate` | number | Percentage of winning trades |
| `lossRate` | number | Percentage of losing trades |
| `profitFactor` | number | grossProfit / abs(grossLoss) |
| `expectedPayoff` | number | Net profit / totalTrades |
| `averageProfit` | number | Average profit of winning trades |
| `averageLoss` | number | Average loss of losing trades |
| `maxDrawdown` | number | Maximum drawdown (simplified equity curve) |
| `growthPercent` | number | Net profit / base equity * 100 |

### Data Integrity Fields

| Field | Type | Description |
|---|---|---|
| `rawCsvHash` | string | 32-bit hash of raw CSV content for change detection |

## Keep-Latest Logic

1. Compute `latestTradeTime` from new CSV (max of closeTime / openTime)
2. Query Firestore by `sourceType__signalId`
3. If no document exists: create new document
4. If document exists:
   - Compare new `latestTradeTime` vs existing `latestTradeTime`
   - If new is later: overwrite document with new data
   - If existing is same or later: skip write, keep existing

## CSV Schema (Aligned with Algo Forest)

Internal CSV files must follow this column order:

| Column | Type | Notes |
|---|---|---|
| Open Time | datetime | Format: YYYY.MM.DD HH:MM |
| Type | string | buy / sell |
| Lots | number | Trade size |
| Symbol | string | e.g. EURUSD |
| Open Price | number | Entry price |
| Close Time | datetime | Format: YYYY.MM.DD HH:MM |
| Close Price | number | Exit price |
| Commission | number | Commission fee |
| Swap | number | Overnight swap |
| Net Pips | number | Net pips gained/lost |
| Net Profit | number | Net profit in account currency |
| Max Profit | number | Maximum floating profit |
| Max Profit Pips | number | Max profit in pips |
| Max Loss | number | Maximum floating loss |
| Max Loss Pips | number | Max loss in pips |
| Magic Number | number | EA magic number (0 for manual) |
| Comment | string | Trade comment / EA tag |
| Holding Time Hours | number | Duration in hours |
| Holding Time | string | Duration formatted |

## Internal CSV Naming Convention

`Signal-G-Helper_EANAME-VER_YYYYMMDD_HHMMSS_SIGNALID.csv`

- Time: HKT (UTC+8), fixed, no DST
- EA name: English letters and numbers only
- Version: prefixed with `V` e.g. `V1`, `V2`
- Signal ID: always placed last
- No special characters, no brackets

## Subcollection: `trades` (Optional, Phase 2+)

Path: `signals_library/{sourceType__signalId}/trades/{tradeId}`

Each document represents one trade row with normalized fields matching the CSV schema above.
