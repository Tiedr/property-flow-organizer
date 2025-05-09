
// Generate a client ID in the format "CL-XXXX"
export const generateClientId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `CL-${randomPart}`;
};

// Validates if a string is a valid ID format for use in database operations
// This function now accepts both UUID format and numeric IDs
export const isValidUUID = (id: string | number): boolean => {
  if (id === undefined || id === null) {
    return false;
  }
  
  // Convert to string if it's a number
  const idStr = String(id);
  
  // Check for standard UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  // Check for numeric ID format (1, 2, etc.)
  const numericIdRegex = /^\d+$/;
  
  return uuidRegex.test(idStr) || numericIdRegex.test(idStr);
};
