
// Re-export all client-related functions from the modularized files
// This maintains backward compatibility with existing import statements

export { 
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  findClientsByUniqueId,
  getAllClients
} from './clientAPI';

export { generateClientId, isValidUUID, isValidClientId } from './clientUtils';

export {
  createClientInvoice,
  getClientInvoices
} from './invoiceAPI';

export { getClientProperties } from './propertyAPI';
