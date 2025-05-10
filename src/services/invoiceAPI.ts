
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types";
import { isValidUUID } from "./clientUtils";
import { fetchClientUUIDById } from "@/utils/uuidFetcher";

// Function to create an invoice for a client
export const createClientInvoice = async (clientId: string, invoiceData: { amount: number, status: string, dueDate?: string }) => {
  try {
    console.log("Starting invoice creation process for client:", clientId);
    
    // First try to convert clientId to UUID format if it's not already
    let validClientId = clientId;
    
    // Check for standard UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(clientId)) {
      console.log(`Client ID ${clientId} is not in UUID format, attempting to fetch UUID...`);
      const uuid = await fetchClientUUIDById(clientId);
      if (!uuid) {
        console.error(`Failed to find UUID for client ID: ${clientId}`);
        throw new Error(`Failed to find a valid UUID for client ID: ${clientId}`);
      }
      validClientId = uuid;
      console.log(`Successfully fetched UUID ${validClientId} for client ID: ${clientId}`);
    }

    // Double check that we now have a valid UUID
    if (!isValidUUID(validClientId)) {
      console.error("Client ID must be in UUID format. Received:", validClientId);
      throw new Error(`Client ID must be in UUID format for database operations. Received: ${validClientId}`);
    }

    // Log the request for debugging
    console.log("Creating invoice with data:", { clientId: validClientId, invoiceData });

    const { data, error } = await supabase
      .from("invoices")
      .insert([{
        client_id: validClientId,
        amount: invoiceData.amount,
        amount_paid: 0, // Initialize as 0
        status: invoiceData.status || 'Pending',
        due_date: invoiceData.dueDate || null,
      }])
      .select("*, clients(name)")
      .single();

    if (error) {
      console.error("Supabase error creating invoice:", error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error("No data returned from invoice creation");
      throw new Error("Failed to create invoice - no data returned");
    }

    console.log("Invoice created successfully:", data);

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
    // First try to convert clientId to UUID format if it's not already
    let validClientId = clientId;
    
    // Check for standard UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(clientId)) {
      console.log(`Client ID ${clientId} is not in UUID format, attempting to fetch UUID...`);
      const uuid = await fetchClientUUIDById(clientId);
      if (!uuid) {
        console.error(`Failed to find UUID for client ID: ${clientId}`);
        throw new Error(`Failed to find a valid UUID for client ID: ${clientId}`);
      }
      validClientId = uuid;
      console.log(`Successfully fetched UUID ${validClientId} for client ID: ${clientId}`);
    }

    const { data, error } = await supabase
      .from("invoices")
      .select("*, invoice_items(*)")
      .eq("client_id", validClientId)
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
