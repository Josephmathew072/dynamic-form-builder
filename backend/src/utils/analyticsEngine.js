export const computeAnalytics = (form, responses) => {
  const totalSubmissions = responses.length;
  
  const fieldStats = {};
  
  for (const field of form.fields) {
    if (field.type === 'select') {
      // Count occurrences of each option
      const counts = {};
      for (const response of responses) {
        const answer = response.answers[field.id];
        if (answer) {
          if (field.multiple && Array.isArray(answer)) {
            for (const val of answer) {
              counts[val] = (counts[val] || 0) + 1;
            }
          } else if (!field.multiple && typeof answer === 'string') {
            counts[answer] = (counts[answer] || 0) + 1;
          }
        }
      }
      
      // Find most selected option
      let mostSelected = null;
      let maxCount = 0;
      for (const [option, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          mostSelected = option;
        }
      }
      
      fieldStats[field.id] = {
        type: 'select',
        label: field.label,
        distribution: counts,
        mostSelected,
        mostSelectedCount: maxCount
      };
    } else if (field.type === 'number') {
      // Calculate average
      let sum = 0;
      let count = 0;
      for (const response of responses) {
        const answer = response.answers[field.id];
        if (answer !== undefined && answer !== null && !isNaN(Number(answer))) {
          sum += Number(answer);
          count++;
        }
      }
      
      fieldStats[field.id] = {
        type: 'number',
        label: field.label,
        average: count > 0 ? sum / count : null,
        totalResponses: count
      };
    }
  }
  
  return {
    totalSubmissions,
    fieldStats,
    formId: form._id,
    formTitle: form.title
  };
};