
// Generate a client ID in the format "CL-XXXX"
export const generateClientId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `CL-${randomPart}`;
};

// Validates if a string is a valid UUID format
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};
