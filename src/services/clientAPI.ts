
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";

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
    // Import the generateClientId function from clientUtils
    const { generateClientId } = await import("./clientUtils");
    
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
