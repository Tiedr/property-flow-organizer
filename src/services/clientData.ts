
import { supabase } from "@/integrations/supabase/client";
import { Client, Invoice, EstateEntry, ClientDetails } from "@/types";
import { randomUUID } from 'crypto';

// Function to get all clients with pagination
export const getClients = async (page = 1, limit = 10, searchTerm = "") => {
  try {
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabase
      .from("clients")
      .select("*", { count: "exact" });

    // Add search filtering if provided
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,unique_id.ilike.%${searchTerm}%`);
    }

    // Add pagination
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    // Execute the query
    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    // Transform the data to match our Client type
    const clients: Client[] = data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      company: item.company || undefined,
      type: item.type as "Individual" | "Company",
      status: item.status as "Active" | "Inactive" | "Lead",
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      uniqueId: item.unique_id,
    }));

    return {
      clients,
      total: count || 0,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Function to create a new client
export const createClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
  try {
    // Generate a unique identifier for the client if not provided
    const uniqueId = clientData.uniqueId || generateClientId();

    const { data, error } = await supabase
      .from("clients")
      .insert([{
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        type: clientData.type,
        status: clientData.status,
        unique_id: uniqueId,
      }])
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    // Transform the response to match our Client type
    return {
      id: data.id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || undefined,
      type: data.type as "Individual" | "Company",
      status: data.status as "Active" | "Inactive" | "Lead",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      uniqueId: data.unique_id,
    } as Client;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Function to get a client by ID
export const getClientById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    // Transform the response to match our Client type
    return {
      id: data.id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || undefined,
      type: data.type as "Individual" | "Company",
      status: data.status as "Active" | "Inactive" | "Lead",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      uniqueId: data.unique_id,
      // The address field doesn't exist in the database, so we're setting it to an empty string
      address: "", // This matches our Client type which expects an optional address
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

// Function to update a client
export const updateClient = async (id: string, clientData: Partial<Client>) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        type: clientData.type,
        status: clientData.status,
        unique_id: clientData.uniqueId,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    // Transform the response to match our Client type
    return {
      id: data.id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || undefined,
      type: data.type as "Individual" | "Company",
      status: data.status as "Active" | "Inactive" | "Lead",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      uniqueId: data.unique_id,
    } as Client;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Function to delete a client
export const deleteClient = async (id: string) => {
  try {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

// Generate a client ID in the format "CL-XXXX"
export const generateClientId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `CL-${randomPart}`;
};

// Function to create an invoice for a client
export const createClientInvoice = async (clientId: string, invoiceData: { amount: number, status: string, dueDate?: string }) => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .insert([{
        client_id: clientId,
        amount: invoiceData.amount,
        amount_paid: 0, // Initialize as 0
        status: invoiceData.status || 'Pending',
        due_date: invoiceData.dueDate || null,
      }])
      .select("*, clients(name)")
      .single();

    if (error) throw new Error(error.message);

    // Transform the response to match our Invoice type
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: data.clients?.name || "",
      amount: data.amount,
      amountPaid: data.amount_paid,
      status: data.status as "Paid" | "Partial" | "Pending" | "Overdue",
      dueDate: data.due_date,
      issuedDate: data.issued_date,
      notes: data.notes || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as Invoice;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Get all invoices for a client
export const getClientInvoices = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_items(*)")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Transform the response to match our Invoice type
    return data.map(item => ({
      id: item.id,
      clientId: item.client_id,
      amount: item.amount,
      amountPaid: item.amount_paid,
      status: item.status as "Paid" | "Partial" | "Pending" | "Overdue",
      dueDate: item.due_date,
      issuedDate: item.issued_date,
      notes: item.notes || undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      items: item.invoice_items ? item.invoice_items.map((invoiceItem: any) => ({
        id: invoiceItem.id,
        invoiceId: invoiceItem.invoice_id,
        estateEntryId: invoiceItem.estate_entry_id,
        description: invoiceItem.description,
        amount: invoiceItem.amount,
        createdAt: invoiceItem.created_at,
      })) : [],
    })) as Invoice[];
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    throw error;
  }
};

// Add the missing function - findClientsByUniqueId
export const findClientsByUniqueId = async (query: string) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .or(`unique_id.ilike.%${query}%,name.ilike.%${query}%`)
      .limit(5);

    if (error) throw new Error(error.message);

    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      company: item.company || undefined,
      type: item.type as "Individual" | "Company",
      status: item.status as "Active" | "Inactive" | "Lead",
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      uniqueId: item.unique_id,
    })) as Client[];
  } catch (error) {
    console.error("Error finding clients by unique ID:", error);
    throw error;
  }
};

// Add the missing function - getAllClients
export const getAllClients = async () => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Transform the data to match our Client type
    return data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email || "",
      phone: item.phone || "",
      company: item.company || undefined,
      type: item.type as "Individual" | "Company",
      status: item.status as "Active" | "Inactive" | "Lead",
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      uniqueId: item.unique_id,
    })) as Client[];
  } catch (error) {
    console.error("Error fetching all clients:", error);
    throw error;
  }
};

// Add the missing function - getClientProperties
export const getClientProperties = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("estate_entries")
      .select("*, estates(name)")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Transform the data to match our EstateEntry type
    return data.map(item => ({
      id: item.id,
      clientName: item.client_name,
      uniqueId: item.unique_id || "",
      representative: item.representative || "",
      plotNumbers: item.plot_numbers || [],
      amount: item.amount,
      amountPaid: item.amount_paid,
      documentsReceived: item.documents_received || [],
      phoneNumber: item.phone_number || "",
      email: item.email || "",
      address: item.address || "",
      paymentStatus: item.payment_status as "Paid" | "Partial" | "Pending" | "Overdue",
      nextDueDate: item.next_due_date,
      clientId: item.client_id,
      estateId: item.estate_id,
      estateName: item.estates?.name || "Unknown"
    })) as EstateEntry[];
  } catch (error) {
    console.error("Error fetching client properties:", error);
    throw error;
  }
};
