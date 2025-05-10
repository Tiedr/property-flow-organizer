
// Generate a client ID in the format "CL-XXXX"
export const generateClientId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `CL-${randomPart}`;
};

// Validates if a string is a valid UUID format
// This is specifically checking for the UUID format required by Supabase
export const isValidUUID = (id: string | number): boolean => {
  if (id === undefined || id === null) {
    return false;
  }
  
  // Convert to string if it's a number
  const idStr = String(id);
  
  // Check for standard UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  return uuidRegex.test(idStr);
};
