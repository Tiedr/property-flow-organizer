export interface EstateEntry {
  id: string;
  clientName: string;
  uniqueId: string;
  representative: string;
  plotNumbers: string[];
  amount: number;
  amountPaid: number;
  documentsReceived: string[];
  phoneNumber: string;
  email: string;
  address: string;
  paymentStatus: "Paid" | "Partial" | "Pending" | "Overdue";
  nextDueDate: string;
  clientId?: string;
  estateName?: string;
  estateId?: string;
}

export interface Estate {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  entries: EstateEntry[];
}

export interface Client {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: "Individual" | "Company";
  status: "Active" | "Inactive" | "Lead";
  createdAt: string;
  updatedAt: string;
  properties?: number;
  totalAmount?: number;
  totalPaid?: number;
  address?: string; // Added address property to Client interface
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: "Planning" | "In Progress" | "On Hold" | "Completed";
  type: "Construction" | "Renovation" | "Real Estate";
  budget: number;
  startDate: string;
  endDate?: string;
  location?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName?: string;
  amount: number;
  amountPaid: number;
  status: "Paid" | "Partial" | "Pending" | "Overdue";
  dueDate?: string;
  issuedDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  estateEntryId?: string;
  description: string;
  amount: number;
  createdAt: string;
  plotDetails?: string;
}

// Add this to allow for client details in the estate entry
export interface ClientDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string; // Added address property
}
