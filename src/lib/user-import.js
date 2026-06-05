import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const EMAIL_PATTERN = /[\w.+-]+@[\w.-]+\.\w+/;

const HEADER_ALIASES = {
  name: ['name', 'full name', 'fullname', 'full_name', 'user', 'user name'],
  email: ['email', 'email address', 'e-mail'],
  department: ['department', 'dept', 'department name'],
  designation: ['designation', 'title', 'job title', 'position', 'role title'],
};

const REQUIRED_FIELD_LABELS = {
  name: 'Full Name',
  email: 'Email',
  department: 'Department',
  designation: 'Designation',
};

const REQUIRED_FIELDS_ERROR =
  'The document must include Full Name, Email, Department, and Designation for each user.';

/**
 * @typedef {Object} ParsedImportUser
 * @property {string} fullName
 * @property {string} email
 * @property {string} department
 * @property {string} designation
 */

function normalizeHeader(value) {
  return String(value || '').trim().toLowerCase();
}

function findHeaderIndex(headers, aliases) {
  return headers.findIndex((header) => aliases.includes(normalizeHeader(header)));
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  values.push(current.trim());
  return values;
}

function rowFromValues(values, mapping) {
  const getValue = (index, fallbackIndex) => {
    if (index >= 0 && values[index]) return values[index].trim();
    if (fallbackIndex >= 0 && values[fallbackIndex]) return values[fallbackIndex].trim();
    return '';
  };

  return {
    fullName: getValue(mapping.name, 0),
    email: getValue(mapping.email, 1),
    department: getValue(mapping.department, 2),
    designation: getValue(mapping.designation, 3),
  };
}

function buildHeaderMapping(headers) {
  return {
    name: findHeaderIndex(headers, HEADER_ALIASES.name),
    email: findHeaderIndex(headers, HEADER_ALIASES.email),
    department: findHeaderIndex(headers, HEADER_ALIASES.department),
    designation: findHeaderIndex(headers, HEADER_ALIASES.designation),
  };
}

function missingRequiredFieldLabels(mapping) {
  return Object.entries(REQUIRED_FIELD_LABELS)
    .filter(([key]) => mapping[key] < 0)
    .map(([, label]) => label);
}

function validateHeaderMapping(mapping, formatLabel) {
  const missing = missingRequiredFieldLabels(mapping);
  if (missing.length) {
    throw new Error(
      `The ${formatLabel} is missing required columns: ${missing.join(', ')}. ${REQUIRED_FIELDS_ERROR}`,
    );
  }
}

function rowHasAllRequiredFields(row) {
  return Boolean(
    row.fullName?.trim()
    && row.email?.trim()
    && row.department?.trim()
    && row.designation?.trim(),
  );
}

function looksLikeHeader(values) {
  const headers = values.map(normalizeHeader);
  const mapping = buildHeaderMapping(headers);
  return missingRequiredFieldLabels(mapping).length === 0;
}

function validatePdfFieldLabels(text) {
  const normalized = text.toLowerCase();
  const missing = Object.entries(HEADER_ALIASES)
    .filter(([, aliases]) => !aliases.some((alias) => normalized.includes(alias)))
    .map(([key]) => REQUIRED_FIELD_LABELS[key]);

  if (missing.length) {
    throw new Error(
      `The PDF is missing required field labels: ${missing.join(', ')}. ${REQUIRED_FIELDS_ERROR}`,
    );
  }
}

/**
 * @param {ParsedImportUser[]} rows
 */
export function validateImportDocument(rows) {
  if (!rows?.length) {
    throw new Error('No users were found in this document.');
  }

  if (!rows.some(rowHasAllRequiredFields)) {
    throw new Error(
      `The document does not contain complete user records. ${REQUIRED_FIELDS_ERROR}`,
    );
  }
}

/**
 * @param {string} text
 * @returns {ParsedImportUser[]}
 */
export function parseCsvUsers(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];

  const firstValues = parseCsvLine(lines[0]);
  const hasHeader = looksLikeHeader(firstValues);
  if (!hasHeader) {
    throw new Error(
      `The CSV must include a header row with columns: ${Object.values(REQUIRED_FIELD_LABELS).join(', ')}.`,
    );
  }

  const headers = firstValues.map(normalizeHeader);
  const mapping = buildHeaderMapping(headers);
  validateHeaderMapping(mapping, 'CSV file');

  return lines
    .slice(1)
    .map((line) => rowFromValues(parseCsvLine(line), mapping))
    .filter((row) => row.fullName || row.email || row.department || row.designation);
}

/**
 * @param {string} line
 * @returns {ParsedImportUser | null}
 */
function parseLooseLine(line) {
  const emailMatch = line.match(EMAIL_PATTERN);
  if (!emailMatch) return null;

  const email = emailMatch[0];
  const commaParts = line.split(',').map((part) => part.trim()).filter(Boolean);

  if (commaParts.length >= 3) {
    const emailIndex = commaParts.findIndex((part) => part.includes(email));
    const name = emailIndex > 0 ? commaParts[0] : commaParts.find((part) => !part.includes('@')) || '';
    const department = commaParts[emailIndex + 1] || commaParts[2] || '';
    const designation = commaParts[emailIndex + 2] || commaParts[3] || '';
    return {
      fullName: name.replace(email, '').trim() || name,
      email,
      department,
      designation,
    };
  }

  const withoutEmail = line.replace(email, ' ').replace(/\s+/g, ' ').trim();
  const splitParts = withoutEmail.split(/\s{2,}|\t| - /).map((part) => part.trim()).filter(Boolean);

  return {
    fullName: splitParts[0] || withoutEmail,
    email,
    department: splitParts[1] || '',
    designation: splitParts[2] || '',
  };
}

/**
 * @param {string} text
 * @returns {ParsedImportUser[]}
 */
export function parsePdfUsers(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    if (looksLikeHeader(line.split(/\s{2,}|,|\t/).map(normalizeHeader))) continue;
    const row = parseLooseLine(line);
    if (row) rows.push(row);
  }

  if (rows.length) return rows;

  const csvLike = lines.join('\n');
  return parseCsvUsers(csvLike);
}

/**
 * @param {File} file
 */
export async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(pageText);
  }

  return pages.join('\n');
}

/**
 * @param {File} file
 * @returns {Promise<ParsedImportUser[]>}
 */
export async function parseUserImportFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    const text = await file.text();
    const rows = parseCsvUsers(text);
    validateImportDocument(rows);
    return rows;
  }

  if (extension === 'pdf') {
    const text = await extractPdfText(file);
    validatePdfFieldLabels(text);
    const rows = parsePdfUsers(text);
    validateImportDocument(rows);
    return rows;
  }

  throw new Error('Unsupported file type. Upload a CSV or PDF document.');
}

function matchByName(items, value) {
  if (!value?.trim()) return null;
  const normalized = value.trim().toLowerCase();
  return items.find((item) => item.name.trim().toLowerCase() === normalized) || null;
}

/**
 * @param {ParsedImportUser[]} rows
 * @param {{
 *   departments: Array<{ id: string, name: string }>,
 *   designations: Array<{ id: string, name: string }>,
 *   existingEmails: Set<string>,
 * }} context
 */
export function validateImportRows(rows, { departments, designations, existingEmails }) {
  const seenEmails = new Set();

  return rows.map((row, index) => {
    const issues = [];
    const email = row.email.trim().toLowerCase();

    if (!row.fullName.trim()) issues.push('Missing name');
    if (!row.email.trim()) issues.push('Missing email');
    else if (!EMAIL_PATTERN.test(row.email.trim())) issues.push('Invalid email format');
    else if (existingEmails.has(email)) issues.push('Email already exists in the system');
    else if (seenEmails.has(email)) issues.push('Duplicate email in file');
    else seenEmails.add(email);

    if (!row.department.trim()) issues.push('Missing department');
    if (!row.designation.trim()) issues.push('Missing designation');

    const department = matchByName(departments, row.department);
    const designation = matchByName(designations, row.designation);

    if (row.department.trim() && !department) {
      issues.push(`Unknown department: ${row.department}`);
    }
    if (row.designation.trim() && !designation) {
      issues.push(`Unknown designation: ${row.designation}`);
    }

    return {
      ...row,
      rowNumber: index + 1,
      departmentId: department?.id || null,
      designationId: designation?.id || null,
      issues,
      valid: issues.length === 0,
    };
  });
}
