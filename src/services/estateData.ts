
import { supabase } from "@/integrations/supabase/client";
import { Estate, EstateEntry } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { faker } from '@faker-js/faker';

// Function to fetch all estates
export const getAllEstates = async (): Promise<Estate[]> => {
  try {
    const { data: estates, error } = await supabase
      .from('estates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    // Fetch entries for each estate
    const estatesWithEntries = await Promise.all(
      (estates || []).map(async (estate) => {
        const { data: entries, error: entriesError } = await supabase
          .from('estate_entries')
          .select('*')
          .eq('estate_id', estate.id);
        
        if (entriesError) {
          console.error("Error fetching entries:", entriesError);
          return {
            ...estate,
            entries: [],
            createdAt: estate.created_at,
            updatedAt: estate.updated_at
          };
        }
        
        // Map the database fields to our application model
        const mappedEntries = entries ? entries.map(entry => ({
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
          nextDueDate: entry.next_due_date || ""
        })) : [];
        
        return {
          id: estate.id,
          name: estate.name,
          description: estate.description || "",
          createdAt: estate.created_at,
          updatedAt: estate.updated_at,
          entries: mappedEntries
        };
      })
    );
    
    return estatesWithEntries;
  } catch (error) {
    console.error("Error fetching estates:", error);
    throw error;
  }
};

// Function to get a specific estate by ID
export const getEstateById = async (id: string): Promise<Estate | undefined> => {
  try {
    const { data: estate, error } = await supabase
      .from('estates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    const { data: entries, error: entriesError } = await supabase
      .from('estate_entries')
      .select('*')
      .eq('estate_id', id);
    
    if (entriesError) {
      throw entriesError;
    }
    
    // Map the entries
    const mappedEntries = entries ? entries.map(entry => ({
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
      nextDueDate: entry.next_due_date || ""
    })) : [];
    
    return {
      id: estate.id,
      name: estate.name,
      description: estate.description || "",
      createdAt: estate.created_at,
      updatedAt: estate.updated_at,
      entries: mappedEntries
    };
    
  } catch (error) {
    console.error("Error fetching estate:", error);
    throw error;
  }
};

// Update an estate in our store
export const updateEstate = async (updatedEstate: Estate): Promise<Estate> => {
  try {
    // First, update the estate record
    const { error: estateError } = await supabase
      .from('estates')
      .update({
        name: updatedEstate.name,
        description: updatedEstate.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', updatedEstate.id);
    
    if (estateError) {
      throw estateError;
    }
    
    // Handle entries updates separately if needed
    // This would be better done through more specific functions
    
    return updatedEstate;
  } catch (error) {
    console.error("Error updating estate:", error);
    throw error;
  }
};

// Create a new estate
export const createEstate = async (estate: Omit<Estate, "id" | "entries">): Promise<Estate> => {
  try {
    const { data, error } = await supabase
      .from('estates')
      .insert({
        name: estate.name,
        description: estate.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from insert operation");
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      entries: []
    };
  } catch (error) {
    console.error("Error creating estate:", error);
    throw error;
  }
};

// Delete an estate
export const deleteEstate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('estates')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting estate:", error);
    throw error;
  }
};

// Create a new estate entry
export const createEstateEntry = async (
  estateId: string, 
  entry: Omit<EstateEntry, "id">
): Promise<EstateEntry> => {
  try {
    const { data, error } = await supabase
      .from('estate_entries')
      .insert({
        estate_id: estateId,
        client_name: entry.clientName,
        unique_id: entry.uniqueId,
        representative: entry.representative,
        plot_numbers: entry.plotNumbers,
        amount: entry.amount,
        amount_paid: entry.amountPaid,
        documents_received: entry.documentsReceived,
        phone_number: entry.phoneNumber,
        email: entry.email,
        address: entry.address,
        payment_status: entry.paymentStatus,
        next_due_date: entry.nextDueDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from insert operation");
    }
    
    // Map the database fields to our application model
    return {
      id: data.id,
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
      nextDueDate: data.next_due_date || ""
    };
  } catch (error) {
    console.error("Error creating estate entry:", error);
    throw error;
  }
};

// Update an estate entry
export const updateEstateEntry = async (
  entryId: string, 
  entry: Omit<EstateEntry, "id">
): Promise<EstateEntry> => {
  try {
    const { data, error } = await supabase
      .from('estate_entries')
      .update({
        client_name: entry.clientName,
        unique_id: entry.uniqueId,
        representative: entry.representative,
        plot_numbers: entry.plotNumbers,
        amount: entry.amount,
        amount_paid: entry.amountPaid,
        documents_received: entry.documentsReceived,
        phone_number: entry.phoneNumber,
        email: entry.email,
        address: entry.address,
        payment_status: entry.paymentStatus,
        next_due_date: entry.nextDueDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from update operation");
    }
    
    // Map the database fields to our application model
    return {
      id: data.id,
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
      nextDueDate: data.next_due_date || ""
    };
  } catch (error) {
    console.error("Error updating estate entry:", error);
    throw error;
  }
};

// Delete an estate entry
export const deleteEstateEntry = async (entryId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('estate_entries')
      .delete()
      .eq('id', entryId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting estate entry:", error);
    throw error;
  }
};

// Generate placeholder data for testing
export const generateEstateData = (count: number): Estate[] => {
  return Array.from({ length: count }, (_, i) => {
    const entryCount = faker.number.int({ min: 2, max: 8 });
    
    return {
      id: uuidv4(),
      name: `Estate ${faker.company.name()}`,
      description: faker.company.catchPhrase(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      entries: Array.from({ length: entryCount }, () => generateEstateEntry())
    };
  });
};

// Generate a random entry for testing
const generateEstateEntry = (): EstateEntry => {
  const amount = faker.number.int({ min: 100000, max: 10000000 });
  const amountPaid = faker.number.int({ min: 0, max: amount });
  const paymentStatus: ("Paid" | "Partial" | "Pending" | "Overdue") = 
    amountPaid === amount ? "Paid" : 
    amountPaid > 0 ? "Partial" : 
    faker.helpers.arrayElement(["Pending", "Overdue"]);
  
  return {
    id: uuidv4(),
    clientName: faker.person.fullName(),
    uniqueId: faker.string.alphanumeric(8).toUpperCase(),
    representative: faker.person.fullName(),
    plotNumbers: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, 
      () => faker.string.alphanumeric(4).toUpperCase()),
    amount: amount,
    amountPaid: amountPaid,
    documentsReceived: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, 
      () => faker.helpers.arrayElement(["ID Proof", "Address Proof", "Pan Card", "Aadhar Card"])),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    address: faker.location.streetAddress() + ", " + faker.location.city(),
    paymentStatus: paymentStatus,
    nextDueDate: faker.date.future().toISOString().split('T')[0]
  };
};
