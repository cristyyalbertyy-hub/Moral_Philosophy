export function parseQuestionCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field.trim());
      field = '';
    } else if (c === '\n' || (c === '\r' && next === '\n')) {
      row.push(field.trim());
      field = '';
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      if (c === '\r') i++;
    } else if (c !== '\r') {
      field += c;
    }
  }

  if (field.length || row.length) {
    row.push(field.trim());
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows
    .filter((r) => r.length >= 2)
    .map(([question, answer]) => ({ question, answer }));
}
