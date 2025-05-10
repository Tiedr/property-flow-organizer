
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types";
import { isValidUUID } from "./clientUtils";

// Function to create an invoice for a client
export const createClientInvoice = async (clientId: string, invoiceData: { amount: number, status: string, dueDate?: string }) => {
  try {
    // Validate that clientId is in a valid format
    if (!isValidUUID(clientId)) {
      throw new Error(`Invalid ID format for client ID: ${clientId}`);
    }

    // Check specifically for UUID format as required by Supabase
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(clientId)) {
      throw new Error(`Client ID must be in UUID format for database operations. Received: ${clientId}`);
    }

    // Log the request for debugging
    console.log("Creating invoice with data:", { clientId, invoiceData });

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
