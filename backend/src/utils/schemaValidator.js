// Helper utilities for schema validation (used by validateResponse middleware)
export const isValidNumber = (value) => {
  return !isNaN(Number(value)) && isFinite(value);
};

export const isValidOption = (value, options, multiple = false) => {
  if (multiple) {
    if (!Array.isArray(value)) return false;
    return value.every(v => options.includes(v));
  }
  return options.includes(value);
};

export const validateFieldValue = (field, value) => {
  if (field.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: `${field.label} is required` };
  }
  
  if (!field.required && (value === undefined || value === null || value === '')) {
    return { valid: true };
  }

  if (field.type === 'number') {
    if (!isValidNumber(value)) {
      return { valid: false, error: `${field.label} must be a number` };
    }
  }

  if (field.type === 'select') {
    if (!isValidOption(value, field.options || [], field.multiple)) {
      return { valid: false, error: `Invalid option for ${field.label}` };
    }
  }

  return { valid: true };
};