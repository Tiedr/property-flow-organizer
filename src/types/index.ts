
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
