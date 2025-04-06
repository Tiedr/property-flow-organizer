
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: "Individual" | "Company";
  status: "Active" | "Inactive" | "Lead";
  projects?: number;
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

export interface Document {
  id: string;
  name: string;
  type: "Contract" | "Invoice" | "Plan" | "Permit" | "Other";
  clientId?: string;
  projectId?: string;
  createdAt: string;
  fileUrl: string;
}
