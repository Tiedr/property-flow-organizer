
import { supabase } from "@/integrations/supabase/client";
import { Client, EstateEntry, Invoice, InvoiceItem } from "@/types";

// Fetch all clients
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    return data.map(client => ({
      id: client.id,
      uniqueId: client.unique_id,
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || undefined,
      type: client.type as "Individual" | "Company",
      status: client.status as "Active" | "Inactive" | "Lead",
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Get a client by ID with properties and invoices
export const getClientById = async (id: string): Promise<Client> => {
  try {
    // Get client details
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (clientError) {
      throw clientError;
    }

    // Get properties (estate entries) for client
    const { data: properties, error: propertiesError } = await supabase
      .from('estate_entries')
      .select(`
        *,
        estates:estate_id (id, name)
      `)
      .eq('client_id', id);
    
    if (propertiesError) {
      throw propertiesError;
    }

    // Get invoices for client
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items:invoice_items (*)
      `)
      .eq('client_id', id);
    
    if (invoicesError) {
      throw invoicesError;
    }

    // Calculate totals
    let totalAmount = 0;
    let totalPaid = 0;
    
    if (properties) {
      properties.forEach(property => {
        totalAmount += property.amount || 0;
        totalPaid += property.amount_paid || 0;
      });
    }

    // Convert to Client type
    return {
      id: client.id,
      uniqueId: client.unique_id,
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || undefined,
      type: client.type as "Individual" | "Company",
      status: client.status as "Active" | "Inactive" | "Lead",
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      properties: properties ? properties.length : 0,
      totalAmount,
      totalPaid
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

// Get all properties (estate entries) for a client
export const getClientProperties = async (clientId: string): Promise<EstateEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('estate_entries')
      .select(`
        *,
        estates:estate_id (id, name)
      `)
      .eq('client_id', clientId);
    
    if (error) {
      throw error;
    }

    return data.map(entry => ({
      id: entry.id,
      clientName: entry.client_name,
      uniqueId: entry.unique_id || "",
      representative: entry.representative || "",
      plotNumbers: entry.plot_numbers || [],
      amount: entry.amount,
      amountPaid: entry.amount_paid,
      documentsReceived: entry.documents_received || [],
      phoneNumber: entry.phone_number || "",
      email: entry.email || "",
      address: entry.address || "",
      paymentStatus: entry.payment_status as "Paid" | "Partial" | "Pending" | "Overdue",
      nextDueDate: entry.next_due_date || "",
      clientId: entry.client_id,
      estateName: entry.estates ? entry.estates.name : ""
    }));
  } catch (error) {
    console.error("Error fetching client properties:", error);
    throw error;
  }
};

// Get all invoices for a client
export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('client_id', clientId);
    
    if (error) {
      throw error;
    }

    return data.map(invoice => ({
      id: invoice.id,
      clientId: invoice.client_id,
      amount: invoice.amount,
      amountPaid: invoice.amount_paid,
      status: invoice.status as "Paid" | "Partial" | "Pending" | "Overdue",
      dueDate: invoice.due_date,
      issuedDate: invoice.issued_date,
      notes: invoice.notes,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
      items: invoice.invoice_items ? invoice.invoice_items.map((item: any) => ({
        id: item.id,
        invoiceId: item.invoice_id,
        estateEntryId: item.estate_entry_id,
        description: item.description,
        amount: item.amount,
        createdAt: item.created_at
      })) : []
    }));
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    throw error;
  }
};

// Create a new client
export const createClient = async (client: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> => {
  try {
    // Check if a client with the same uniqueId already exists
    const { data: existingClients } = await supabase
      .from('clients')
      .select('id, unique_id')
      .eq('unique_id', client.uniqueId);
      
    if (existingClients && existingClients.length > 0) {
      throw new Error(`A client with unique ID ${client.uniqueId} already exists`);
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        unique_id: client.uniqueId,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        type: client.type,
        status: client.status,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      uniqueId: data.unique_id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || undefined,
      type: data.type as "Individual" | "Company",
      status: data.status as "Active" | "Inactive" | "Lead",
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Update an existing client
export const updateClient = async (id: string, client: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> => {
  try {
    // Check if another client with the same uniqueId exists
    const { data: existingClients } = await supabase
      .from('clients')
      .select('id, unique_id')
      .eq('unique_id', client.uniqueId)
      .neq('id', id);
      
    if (existingClients && existingClients.length > 0) {
      throw new Error(`Another client with unique ID ${client.uniqueId} already exists`);
    }
    
    const { data, error } = await supabase
      .from('clients')
      .update({
        unique_id: client.uniqueId,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        type: client.type,
        status: client.status,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      uniqueId: data.unique_id,
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || undefined,
      type: data.type as "Individual" | "Company",
      status: data.status as "Active" | "Inactive" | "Lead",
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

// Link an estate entry to a client
export const linkEntryToClient = async (entryId: string, clientId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('estate_entries')
      .update({ client_id: clientId })
      .eq('id', entryId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error linking entry to client:", error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice> => {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        client_id: invoice.clientId,
        amount: invoice.amount,
        amount_paid: invoice.amountPaid,
        status: invoice.status,
        due_date: invoice.dueDate,
        issued_date: invoice.issuedDate,
        notes: invoice.notes
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    // If there are invoice items, add them
    if (invoice.items && invoice.items.length > 0) {
      const itemsToInsert = invoice.items.map(item => ({
        invoice_id: data.id,
        estate_entry_id: item.estateEntryId,
        description: item.description,
        amount: item.amount
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);
      
      if (itemsError) {
        throw itemsError;
      }
    }
    
    return {
      id: data.id,
      clientId: data.client_id,
      amount: data.amount,
      amountPaid: data.amount_paid,
      status: data.status as "Paid" | "Partial" | "Pending" | "Overdue",
      dueDate: data.due_date,
      issuedDate: data.issued_date,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      items: invoice.items
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Find clients by unique ID
export const findClientsByUniqueId = async (uniqueId: string): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .ilike('unique_id', `%${uniqueId}%`);
    
    if (error) {
      throw error;
    }

    return data.map(client => ({
      id: client.id,
      uniqueId: client.unique_id,
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || undefined,
      type: client.type as "Individual" | "Company",
      status: client.status as "Active" | "Inactive" | "Lead",
      createdAt: client.created_at,
      updatedAt: client.updated_at
    }));
  } catch (error) {
    console.error("Error finding clients by unique ID:", error);
    throw error;
  }
};
