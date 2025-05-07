import { v4 as uuidv4 } from "uuid";
import { Client, EstateEntry, Invoice } from "@/types";
import { getAllEstates } from "./estateData";

// Mock data for clients
const mockClients: Client[] = [
  {
    id: "1",
    uniqueId: "C001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254712345678",
    company: "Doe Enterprises",
    type: "Individual",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    properties: 2,
    totalAmount: 1250000,
    totalPaid: 500000,
  },
  {
    id: "2",
    uniqueId: "C002",
    name: "Alice Maina",
    email: "alice.maina@example.com",
    phone: "+254722333444",
    type: "Individual",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    properties: 1,
    totalAmount: 750000,
    totalPaid: 750000,
  },
];

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: "INV-1001",
    clientId: "1",
    clientName: "John Doe",
    amount: 250000,
    amountPaid: 250000,
    status: "Paid",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    issuedDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    notes: "First payment for Westlands Estate plots",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
  },
  {
    id: "INV-1002",
    clientId: "1",
    clientName: "John Doe",
    amount: 250000,
    amountPaid: 250000,
    status: "Paid",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    issuedDate: new Date().toISOString(),
    notes: "Second payment for Westlands Estate plots",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Client functions
export const getAllClients = async (): Promise<Client[]> => {
  // Get all estates to populate the clients list
  const estates = await getAllEstates();
  
  // Create a map of existing client IDs
  const existingClientIds = new Set(mockClients.map(client => client.id));
  
  // Process all estate entries and create clients if they don't exist
  for (const estate of estates) {
    for (const entry of estate.entries) {
      // Skip if no client ID is available
      if (!entry.clientId) continue;
      
      // If client already exists in our mock data, skip
      if (existingClientIds.has(entry.clientId)) continue;
      
      // Create a new client from the entry data
      const newClient: Client = {
        id: entry.clientId,
        uniqueId: entry.uniqueId || `C${Math.floor(1000 + Math.random() * 9000)}`,
        name: entry.clientName,
        email: entry.email || "",
        phone: entry.phoneNumber || "",
        type: "Individual",
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to mock clients
      mockClients.push(newClient);
      existingClientIds.add(entry.clientId);
    }
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClients);
    }, 200);
  });
};

export const getClientById = async (id: string): Promise<Client | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const client = mockClients.find((client) => client.id === id);
      resolve(client);
    }, 200);
  });
};

export const findClientsByUniqueId = async (query: string): Promise<Client[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredClients = mockClients.filter((client) => 
        client.uniqueId.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredClients);
    }, 200);
  });
};

export const createClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClient: Client = {
        id: uuidv4(),
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClients.push(newClient);
      resolve(newClient);
    }, 200);
  });
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockClients.findIndex((client) => client.id === id);
      if (index !== -1) {
        mockClients[index] = {
          ...mockClients[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockClients[index]);
      } else {
        reject(new Error("Client not found"));
      }
    }, 200);
  });
};

export const deleteClient = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockClients.findIndex((client) => client.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

// Get properties for a specific client by aggregating entries from all estates
export const getClientProperties = async (clientId: string): Promise<EstateEntry[]> => {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      const estates = await getAllEstates();
      const properties: EstateEntry[] = [];
      
      for (const estate of estates) {
        const clientEntries = estate.entries.filter(
          (entry) => entry.clientId === clientId
        );
        
        // Add estate name to each entry
        const entriesWithEstateName = clientEntries.map(entry => ({
          ...entry,
          estateName: estate.name, // Use estate.name instead of estate.id
          estateId: estate.id, // Add estateId to make navigation easier
        }));
        
        properties.push(...entriesWithEstateName);
      }
      
      resolve(properties);
    }, 200);
  });
};

// Get invoices for a specific client
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = mockInvoices.filter((invoice) => invoice.clientId === clientId);
      resolve(invoices);
    }, 200);
  });
};

// Create a new invoice for a client
export const createClientInvoice = async (
  clientId: string, 
  invoiceData: Partial<Invoice>
): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const client = await getClientById(clientId);
        if (!client) {
          throw new Error("Client not found");
        }
        
        const newInvoice: Invoice = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          clientId,
          clientName: client.name,
          amount: invoiceData.amount || 0,
          amountPaid: invoiceData.amountPaid || 0,
          status: invoiceData.status || "Pending",
          dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          issuedDate: invoiceData.issuedDate || new Date().toISOString(),
          notes: invoiceData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        mockInvoices.push(newInvoice);
        resolve(newInvoice);
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
};
