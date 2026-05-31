export const validateResponse = (form, answers) => {
  const errors = [];
  
  for (const field of form.fields) {
    const answer = answers[field.id];
    
    // Check required fields
    if (field.required && (answer === undefined || answer === null || answer === '')) {
      errors.push(`Field "${field.label}" is required`);
      continue;
    }
    
    // Skip validation if not required and no answer
    if (!field.required && (answer === undefined || answer === null || answer === '')) {
      continue;
    }
    
    // Type validation
    if (field.type === 'number') {
      if (isNaN(Number(answer))) {
        errors.push(`Field "${field.label}" must be a number`);
      }
    }
    
    // Select validation
    if (field.type === 'select') {
      if (field.multiple) {
        if (!Array.isArray(answer)) {
          errors.push(`Field "${field.label}" must be an array`);
        } else {
          for (const val of answer) {
            if (!field.options.includes(val)) {
              errors.push(`"${val}" is not a valid option for "${field.label}"`);
            }
          }
        }
      } else {
        if (!field.options.includes(answer)) {
          errors.push(`"${answer}" is not a valid option for "${field.label}"`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};