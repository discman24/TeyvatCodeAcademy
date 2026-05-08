// Verifies the Pyodide-returned namespace against a mission's successCriteria.
// Returns { ok: boolean, failures: string[] }

export function verifyMission(criteria, namespace) {
  const failures = [];
  for (const [varName, spec] of Object.entries(criteria || {})) {
    const v = namespace[varName];
    if (v === undefined) {
      failures.push(`Variable '${varName}' is not defined`);
      continue;
    }

    const t = spec.type;
    const isNum = typeof v === 'number' && !Number.isNaN(v);
    const isInt = isNum && Number.isInteger(v);
    const isFloat = isNum && !Number.isInteger(v);

    if (t === 'str' && typeof v !== 'string') failures.push(`'${varName}' should be a string`);
    if (t === 'int' && !isInt) failures.push(`'${varName}' should be a whole number (int)`);
    if (t === 'float' && !isFloat) failures.push(`'${varName}' should be a decimal number (float, e.g. 12.5)`);
    if (t === 'number' && !isNum) failures.push(`'${varName}' should be a number`);
    if (t === 'bool' && typeof v !== 'boolean') failures.push(`'${varName}' should be True or False`);
    if (t === 'list' && !Array.isArray(v)) failures.push(`'${varName}' should be a list`);
    if (t === 'dict' && (typeof v !== 'object' || Array.isArray(v) || v === null)) failures.push(`'${varName}' should be a dict`);

    if (spec.notEmpty) {
      const empty = (typeof v === 'string' && v.trim() === '') ||
                    (Array.isArray(v) && v.length === 0) ||
                    (v == null);
      if (empty) failures.push(`'${varName}' must not be empty`);
    }
    if (spec.equals !== undefined && v !== spec.equals) {
      failures.push(`'${varName}' should equal ${JSON.stringify(spec.equals)}, got ${JSON.stringify(v)}`);
    }
    if (spec.min !== undefined && isNum && v < spec.min) {
      failures.push(`'${varName}' should be ≥ ${spec.min}`);
    }
    if (spec.max !== undefined && isNum && v > spec.max) {
      failures.push(`'${varName}' should be ≤ ${spec.max}`);
    }
    if (spec.contains && typeof v === 'string') {
      for (const part of spec.contains) {
        if (!v.includes(String(part))) failures.push(`'${varName}' should contain ${JSON.stringify(part)}`);
      }
    }
  }
  return { ok: failures.length === 0, failures };
}
