/**
 * csv-library.js
 * Signal Helper - TSS Development
 * Version: 0.1.0
 * 
 * Handles CSV file parsing, validation, normalization,
 * and the Keep-Latest logic for the Signals Library.
 * 
 * CSV Naming Convention:
 *   Signal-G-Helper_EANAME-VER_YYYYMMDD_HHMMSS_SIGNALID.csv
 * 
 * Time Zone: HKT (UTC+8), fixed, no DST
 */

'use strict';

// ─── Constants ───────────────────────────────────────────────────────────────

const CSV_REQUIRED_COLUMNS = [
  'Open Time',
  'Type',
  'Lots',
  'Symbol',
  'Open Price',
  'Close Time',
  'Close Price',
  'Commission',
  'Swap',
  'Net Pips',
  'Net Profit',
  'Magic Number',
  'Comment'
];

const CSV_OPTIONAL_COLUMNS = [
  'Max Profit',
  'Max Profit Pips',
  'Max Loss',
  'Max Loss Pips',
  'Holding Time Hours',
  'Holding Time'
];

const CSV_FILENAME_REGEX =
  /^Signal-G-Helper_([A-Za-z0-9]+)-([A-Za-z0-9]+)_(\d{8})_(\d{6})_([A-Za-z0-9]+)\.csv$/;

// ─── Filename Parser ──────────────────────────────────────────────────────────

/**
 * Parse a CSV filename into its components.
 * @param {string} filename
 * @returns {{ eaName: string, version: string, date: string, time: string, signalId: string } | null}
 */
function parseCSVFilename(filename) {
  const match = filename.match(CSV_FILENAME_REGEX);
  if (!match) return null;
  return {
    eaName: match[1],
    version: match[2],
    date: match[3],     // YYYYMMDD
    time: match[4],     // HHMMSS
    signalId: match[5]
  };
}

/**
 * Extract the HKT timestamp from a parsed filename object.
 * @param {{ date: string, time: string }} parsed
 * @returns {Date}
 */
function filenameToTimestamp(parsed) {
  const { date, time } = parsed;
  const year   = parseInt(date.slice(0, 4), 10);
  const month  = parseInt(date.slice(4, 6), 10) - 1;
  const day    = parseInt(date.slice(6, 8), 10);
  const hour   = parseInt(time.slice(0, 2), 10);
  const minute = parseInt(time.slice(2, 4), 10);
  const second = parseInt(time.slice(4, 6), 10);
  // HKT = UTC+8: subtract 8 hours to get UTC for Date object
  return new Date(Date.UTC(year, month, day, hour - 8, minute, second));
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

/**
 * Parse raw CSV text into an array of row objects.
 * @param {string} csvText
 * @returns {{ headers: string[], rows: Object[] }}
 */
function parseCSVText(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = lines[0].split(',').map(h => h.trim());

  const rows = lines.slice(1).map((line, index) => {
    const values = splitCSVLine(line);
    if (values.length !== headers.length) {
      console.warn(`Row ${index + 2} column count mismatch. Skipping.`);
      return null;
    }
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i].trim();
    });
    return row;
  }).filter(row => row !== null);

  return { headers, rows };
}

/**
 * Split a single CSV line respecting quoted fields.
 * @param {string} line
 * @returns {string[]}
 */
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate that a parsed CSV has all required columns.
 * @param {string[]} headers
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateCSVHeaders(headers) {
  const missing = CSV_REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  return { valid: missing.length === 0, missing };
}

/**
 * Validate and normalize a single CSV row's field types.
 * @param {Object} row
 * @returns {{ valid: boolean, errors: string[], normalized: Object }}
 */
function validateAndNormalizeRow(row) {
  const errors = [];
  const normalized = { ...row };

  // Datetime fields
  ['Open Time', 'Close Time'].forEach(field => {
    if (row[field]) {
      const dt = parseTradeDateTime(row[field]);
      if (!dt) {
        errors.push(`Invalid datetime format for "${field}": ${row[field]}`);
      } else {
        normalized[field] = dt;
      }
    }
  });

  // Number fields
  const numberFields = [
    'Lots', 'Open Price', 'Close Price', 'Commission', 'Swap',
    'Net Pips', 'Net Profit', 'Magic Number',
    'Max Profit', 'Max Profit Pips', 'Max Loss', 'Max Loss Pips',
    'Holding Time Hours'
  ];
  numberFields.forEach(field => {
    if (row[field] !== undefined && row[field] !== '') {
      const num = parseFloat(row[field]);
      if (isNaN(num)) {
        errors.push(`Invalid number for "${field}": ${row[field]}`);
      } else {
        normalized[field] = num;
      }
    }
  });

  // Type validation
  if (row['Type'] && !['buy', 'sell'].includes(row['Type'].toLowerCase())) {
    errors.push(`Invalid Type value: ${row['Type']}. Must be "buy" or "sell".`);
  } else if (row['Type']) {
    normalized['Type'] = row['Type'].toLowerCase();
  }

  return { valid: errors.length === 0, errors, normalized };
}

/**
 * Parse a trade datetime string in format "YYYY.MM.DD HH:MM".
 * @param {string} str
 * @returns {Date | null}
 */
function parseTradeDateTime(str) {
  const match = str.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  // Trade times are in HKT (UTC+8)
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute));
}

// ─── Keep-Latest Logic ────────────────────────────────────────────────────────

/**
 * Apply Keep-Latest logic: for each unique (source + signalId), retain
 * only the record from the newest CSV file (by filename timestamp).
 *
 * @param {Array<{ meta: Object, rows: Object[] }>} csvDataArray
 *   Each element has `meta` (from parseCSVFilename + timestamp) and `rows`.
 * @returns {Object[]} Merged array of rows with the latest data per signal.
 */
function applyKeepLatest(csvDataArray) {
  // Map: key = `${eaName}_${signalId}` => { timestamp, rows }
  const latestMap = new Map();

  csvDataArray.forEach(({ meta, rows }) => {
    const key = `${meta.eaName}_${meta.signalId}`;
    const existing = latestMap.get(key);

    if (!existing || meta.timestamp > existing.timestamp) {
      latestMap.set(key, { timestamp: meta.timestamp, meta, rows });
    }
  });

  // Flatten all winning rows
  const mergedRows = [];
  latestMap.forEach(({ rows }) => {
    rows.forEach(row => mergedRows.push(row));
  });

  return mergedRows;
}

// ─── Main Entry Points ────────────────────────────────────────────────────────

/**
 * Process a File object from an <input type="file"> element.
 * Returns a promise resolving to { meta, headers, rows, errors }.
 *
 * @param {File} file
 * @returns {Promise<{ meta: Object|null, headers: string[], rows: Object[], errors: string[] }>}
 */
function processCSVFile(file) {
  return new Promise((resolve, reject) => {
    const meta = parseCSVFilename(file.name);
    if (!meta) {
      resolve({
        meta: null,
        headers: [],
        rows: [],
        errors: [`Filename does not match naming convention: ${file.name}`]
      });
      return;
    }

    meta.timestamp = filenameToTimestamp(meta);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { headers, rows } = parseCSVText(e.target.result);
        const headerValidation = validateCSVHeaders(headers);

        const errors = [];
        if (!headerValidation.valid) {
          errors.push(`Missing required columns: ${headerValidation.missing.join(', ')}`);
        }

        const normalizedRows = [];
        rows.forEach((row, index) => {
          const { valid, errors: rowErrors, normalized } = validateAndNormalizeRow(row);
          if (!valid) {
            rowErrors.forEach(err => errors.push(`Row ${index + 2}: ${err}`));
          }
          normalizedRows.push(normalized);
        });

        resolve({ meta, headers, rows: normalizedRows, errors });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsText(file);
  });
}

/**
 * Process multiple CSV files and apply Keep-Latest logic.
 *
 * @param {FileList|File[]} files
 * @returns {Promise<{ mergedRows: Object[], allErrors: Object[] }>}
 */
async function processMultipleCSVFiles(files) {
  const allErrors = [];
  const csvDataArray = [];

  for (const file of Array.from(files)) {
    try {
      const result = await processCSVFile(file);
      if (result.errors.length > 0) {
        allErrors.push({ file: file.name, errors: result.errors });
      }
      if (result.meta && result.rows.length > 0) {
        csvDataArray.push({ meta: result.meta, rows: result.rows });
      }
    } catch (err) {
      allErrors.push({ file: file.name, errors: [err.message] });
    }
  }

  const mergedRows = applyKeepLatest(csvDataArray);
  return { mergedRows, allErrors };
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  parseCSVFilename,
  filenameToTimestamp,
  parseCSVText,
  validateCSVHeaders,
  validateAndNormalizeRow,
  parseTradeDateTime,
  applyKeepLatest,
  processCSVFile,
  processMultipleCSVFiles,
  CSV_REQUIRED_COLUMNS,
  CSV_OPTIONAL_COLUMNS,
  CSV_FILENAME_REGEX
};
