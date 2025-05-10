
import { v4 as uuidv4 } from "uuid";
import { Estate, EstateEntry } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const getAllEstates = async (): Promise<Estate[]> => {
  try {
    // Fetch all estates from the database
    const { data: estatesData, error: estatesError } = await supabase
      .from("estates")
      .select("*")
      .order('created_at', { ascending: false });
    
    if (estatesError) {
      console.error("Error fetching estates:", estatesError);
      throw estatesError;
    }

    // For each estate, fetch its entries
    const estates = await Promise.all(estatesData.map(async (estate) => {
      const { data: entriesData, error: entriesError } = await supabase
        .from("estate_entries")
        .select("*")
        .eq("estate_id", estate.id);
      
      if (entriesError) {
        console.error(`Error fetching entries for estate ${estate.id}:`, entriesError);
        throw entriesError;
      }

      // Convert database columns to match the frontend types
      const mappedEntries: EstateEntry[] = entriesData.map(entry => ({
        id: entry.id,
        clientId: entry.client_id,
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
        estateId: entry.estate_id,
        estateName: estate.name,
      }));

      // Return the estate with its entries
      return {
        id: estate.id,
        name: estate.name,
        description: estate.description,
        createdAt: estate.created_at,
        updatedAt: estate.updated_at,
        entries: mappedEntries,
      };
    }));

    return estates;
  } catch (error) {
    console.error("Error in getAllEstates:", error);
    throw error;
  }
};

export const getEstateById = async (id: string): Promise<Estate | undefined> => {
  try {
    // Fetch the estate by ID
    const { data: estateData, error: estateError } = await supabase
      .from("estates")
      .select("*")
      .eq("id", id)
      .single();
    
    if (estateError) {
      console.error(`Error fetching estate ${id}:`, estateError);
      throw estateError;
    }

    // Fetch the estate entries
    const { data: entriesData, error: entriesError } = await supabase
      .from("estate_entries")
      .select("*")
      .eq("estate_id", id);
    
    if (entriesError) {
      console.error(`Error fetching entries for estate ${id}:`, entriesError);
      throw entriesError;
    }

    // Convert database columns to match the frontend types
    const mappedEntries: EstateEntry[] = entriesData.map(entry => ({
      id: entry.id,
      clientId: entry.client_id,
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
      estateId: entry.estate_id,
      estateName: estateData.name,
    }));

    // Return the estate with its entries
    return {
      id: estateData.id,
      name: estateData.name,
      description: estateData.description,
      createdAt: estateData.created_at,
      updatedAt: estateData.updated_at,
      entries: mappedEntries,
    };
  } catch (error) {
    console.error(`Error in getEstateById for id ${id}:`, error);
    throw error;
  }
};

export const createEstate = async (estateData: Omit<Estate, "id" | "createdAt" | "updatedAt" | "entries">): Promise<Estate> => {
  try {
    // Insert the new estate into the database
    const { data, error } = await supabase
      .from("estates")
      .insert({
        name: estateData.name,
        description: estateData.description,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating estate:", error);
      throw error;
    }

    // Return the new estate with an empty entries array
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      entries: [],
    };
  } catch (error) {
    console.error("Error in createEstate:", error);
    throw error;
  }
};

export const updateEstate = async (id: string, updates: Partial<Estate>): Promise<Estate | undefined> => {
  try {
    // Update the estate in the database
    const { data, error } = await supabase
      .from("estates")
      .update({
        name: updates.name,
        description: updates.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating estate ${id}:`, error);
      throw error;
    }

    // Fetch the estate entries to include in the return value
    const { data: entriesData, error: entriesError } = await supabase
      .from("estate_entries")
      .select("*")
      .eq("estate_id", id);
    
    if (entriesError) {
      console.error(`Error fetching entries for estate ${id}:`, entriesError);
      throw entriesError;
    }

    // Convert database columns to match the frontend types
    const mappedEntries: EstateEntry[] = entriesData.map(entry => ({
      id: entry.id,
      clientId: entry.client_id,
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
      estateId: entry.estate_id,
      estateName: data.name,
    }));

    // Return the updated estate with its entries
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      entries: mappedEntries,
    };
  } catch (error) {
    console.error(`Error in updateEstate for id ${id}:`, error);
    throw error;
  }
};

export const deleteEstate = async (id: string): Promise<boolean> => {
  try {
    // First delete all entries related to this estate
    const { error: entriesError } = await supabase
      .from("estate_entries")
      .delete()
      .eq("estate_id", id);
    
    if (entriesError) {
      console.error(`Error deleting entries for estate ${id}:`, entriesError);
      throw entriesError;
    }

    // Then delete the estate itself
    const { error } = await supabase
      .from("estates")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error(`Error deleting estate ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteEstate for id ${id}:`, error);
    throw error;
  }
};

// Estate entry functions
export const createEntry = async (estateId: string, entryData: Omit<EstateEntry, "id">): Promise<EstateEntry | undefined> => {
  try {
    // Get estate name to include in the entry
    const { data: estateData, error: estateError } = await supabase
      .from("estates")
      .select("name")
      .eq("id", estateId)
      .single();
    
    if (estateError) {
      console.error(`Error fetching estate ${estateId}:`, estateError);
      throw estateError;
    }

    // Insert the new entry into the database
    const { data, error } = await supabase
      .from("estate_entries")
      .insert({
        estate_id: estateId,
        client_id: entryData.clientId,
        client_name: entryData.clientName,
        unique_id: entryData.uniqueId,
        representative: entryData.representative,
        plot_numbers: entryData.plotNumbers,
        amount: entryData.amount,
        amount_paid: entryData.amountPaid,
        documents_received: entryData.documentsReceived,
        phone_number: entryData.phoneNumber,
        email: entryData.email,
        address: entryData.address,
        payment_status: entryData.paymentStatus,
        next_due_date: entryData.nextDueDate,
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating entry for estate ${estateId}:`, error);
      throw error;
    }

    // Convert database columns to match the frontend types
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: data.client_name,
      uniqueId: data.unique_id || "",
      representative: data.representative || "",
      plotNumbers: data.plot_numbers || [],
      amount: data.amount,
      amountPaid: data.amount_paid,
      documentsReceived: data.documents_received || [],
      phoneNumber: data.phone_number || "",
      email: data.email || "",
      address: data.address || "",
      paymentStatus: data.payment_status as "Paid" | "Partial" | "Pending" | "Overdue",
      nextDueDate: data.next_due_date || "",
      estateId: data.estate_id,
      estateName: estateData.name,
    };
  } catch (error) {
    console.error(`Error in createEntry for estate ${estateId}:`, error);
    throw error;
  }
};

export const updateEntry = async (estateId: string, entryId: string, updates: Partial<EstateEntry>): Promise<EstateEntry | undefined> => {
  try {
    // Update the entry in the database
    const { data, error } = await supabase
      .from("estate_entries")
      .update({
        client_id: updates.clientId,
        client_name: updates.clientName,
        unique_id: updates.uniqueId,
        representative: updates.representative,
        plot_numbers: updates.plotNumbers,
        amount: updates.amount,
        amount_paid: updates.amountPaid,
        documents_received: updates.documentsReceived,
        phone_number: updates.phoneNumber,
        email: updates.email,
        address: updates.address,
        payment_status: updates.paymentStatus,
        next_due_date: updates.nextDueDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", entryId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating entry ${entryId}:`, error);
      throw error;
    }

    // Get estate name to include in the response
    const { data: estateData, error: estateError } = await supabase
      .from("estates")
      .select("name")
      .eq("id", estateId)
      .single();
    
    if (estateError) {
      console.error(`Error fetching estate ${estateId}:`, estateError);
      throw estateError;
    }

    // Convert database columns to match the frontend types
    return {
      id: data.id,
      clientId: data.client_id,
      clientName: data.client_name,
      uniqueId: data.unique_id || "",
      representative: data.representative || "",
      plotNumbers: data.plot_numbers || [],
      amount: data.amount,
      amountPaid: data.amount_paid,
      documentsReceived: data.documents_received || [],
      phoneNumber: data.phone_number || "",
      email: data.email || "",
      address: data.address || "",
      paymentStatus: data.payment_status as "Paid" | "Partial" | "Pending" | "Overdue",
      nextDueDate: data.next_due_date || "",
      estateId: data.estate_id,
      estateName: estateData.name,
    };
  } catch (error) {
    console.error(`Error in updateEntry for entry ${entryId}:`, error);
    throw error;
  }
};

export const deleteEntry = async (estateId: string, entryId: string): Promise<boolean> => {
  try {
    // Delete the entry from the database
    const { error } = await supabase
      .from("estate_entries")
      .delete()
      .eq("id", entryId);
    
    if (error) {
      console.error(`Error deleting entry ${entryId}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteEntry for entry ${entryId}:`, error);
    throw error;
  }
};

// Export aliases for the functions to match the imports in EstateDetailPage.tsx
export const createEstateEntry = createEntry;
export const updateEstateEntry = updateEntry;
export const deleteEstateEntry = deleteEntry;
