
export interface Estate {
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
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: "Individual" | "Company";
  status: "Active" | "Inactive" | "Lead";
  projects: number;
  createdAt: string;
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
