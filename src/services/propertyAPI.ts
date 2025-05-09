
import { supabase } from "@/integrations/supabase/client";
import { EstateEntry } from "@/types";

// Get all properties for a client
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
