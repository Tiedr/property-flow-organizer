
import { v4 as uuidv4 } from 'uuid';
import { Estate } from '@/types';

// Generate random estate data
export const generateMockEstateData = (count: number = 15): Estate[] => {
  const paymentStatuses: Array<"Paid" | "Partial" | "Pending" | "Overdue"> = ["Paid", "Partial", "Pending", "Overdue"];
  const representatives = ["John Smith", "Sarah Johnson", "Michael Brown", "Emma Wilson", "David Clark"];
  
  return Array.from({ length: count }).map((_, i) => {
    const amount = Math.floor(500000 + Math.random() * 5000000);
    const amountPaid = Math.floor(Math.random() * (amount + 1));
    const plotCount = Math.floor(1 + Math.random() * 5);
    const plots = Array.from({ length: plotCount }).map((_, j) => `P-${i + 1}${j + 1}`);
    const docsReceived = Math.random() > 0.5 ? plots.slice(0, Math.ceil(Math.random() * plotCount)) : [];
    
    // Calculate next due date (between today and next 90 days)
    const today = new Date();
    const nextDueDate = new Date(today);
    nextDueDate.setDate(today.getDate() + Math.floor(Math.random() * 90));
    
    return {
      id: uuidv4(),
      clientName: `Client ${i + 1}`,
      uniqueId: `EST-${(1000 + i).toString()}`,
      representative: representatives[Math.floor(Math.random() * representatives.length)],
      plotNumbers: plots,
      amount: amount,
      amountPaid: amountPaid,
      documentsReceived: docsReceived,
      phoneNumber: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `client${i + 1}@example.com`,
      address: `${Math.floor(100 + Math.random() * 9900)} Main St, Suite ${i + 100}, City`,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      nextDueDate: nextDueDate.toISOString().split('T')[0]
    };
  });
};
