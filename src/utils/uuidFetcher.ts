
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the UUID for a client based on their numeric ID
 * This is useful for converting route parameters to database IDs
 */
export const fetchClientUUIDById = async (numericId: string | number): Promise<string | null> => {
  try {
    // Make sure we're working with a string
    const idStr = String(numericId);
    
    // Check if the ID is already in UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idStr)) {
      return idStr; // Already a UUID, return as is
    }
    
    // Query the database to get the UUID corresponding to this numeric ID
    const { data, error } = await supabase
      .from("clients")
      .select("id")
      .eq("id", idStr) // Convert to string to fix the TypeScript error
      .single();
    
    if (error || !data) {
      console.error("Error fetching client UUID:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in fetchClientUUIDById:", error);
    return null;
  }
};

/**
 * Fetches the UUID for an estate entry based on its ID
 */
export const fetchEstateEntryUUIDById = async (entryId: string | number): Promise<string | null> => {
  try {
    // Make sure we're working with a string
    const idStr = String(entryId);
    
    // Check if the ID is already in UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idStr)) {
      return idStr; // Already a UUID, return as is
    }
    
    // Query the database to get the UUID corresponding to this numeric ID
    const { data, error } = await supabase
      .from("estate_entries")
      .select("id")
      .eq("id", idStr) // Convert to string to fix the TypeScript error
      .single();
    
    if (error || !data) {
      console.error("Error fetching estate entry UUID:", error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error("Error in fetchEstateEntryUUIDById:", error);
    return null;
  }
};
