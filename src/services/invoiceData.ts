
import { v4 as uuidv4 } from "uuid";
import { Invoice, InvoiceItem } from "@/types";
import { updateEstateEntry } from "@/services/estateData";

// In-memory mock data for invoices
const mockInvoices: Invoice[] = [];

export const getAllInvoices = async (): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInvoices);
    }, 200);
  });
};

export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoice = mockInvoices.find((invoice) => invoice.id === id);
      resolve(invoice);
    }, 200);
  });
};

export const getClientInvoices = async (clientId: string): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = mockInvoices.filter((invoice) => invoice.clientId === clientId);
      resolve(invoices);
    }, 200);
  });
};

export const createInvoice = async (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newInvoice: Invoice = {
        id: uuidv4(),
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockInvoices.push(newInvoice);
      resolve(newInvoice);
    }, 200);
  });
};

export const createReceiptFromEstateEntry = async (
  estateId: string,
  entryId: string,
  paymentAmount: number,
  notes?: string
): Promise<Invoice> => {
  try {
    // First, get the estate entry
    const entryData = await fetchEstateEntry(estateId, entryId);
    if (!entryData) {
      throw new Error("Estate entry not found");
    }
    
    // Calculate remaining amount
    const remainingAmount = entryData.amount - entryData.amountPaid;
    
    // Make sure payment isn't more than what's owed
    const actualPayment = Math.min(paymentAmount, remainingAmount);
    
    // Calculate new amount paid and determine payment status
    const newAmountPaid = entryData.amountPaid + actualPayment;
    let paymentStatus = entryData.paymentStatus;
    
    if (newAmountPaid >= entryData.amount) {
      paymentStatus = "Paid";
    } else if (newAmountPaid > 0) {
      paymentStatus = "Partial";
    }
    
    // Create a new invoice
    const newInvoice: Omit<Invoice, "id" | "createdAt" | "updatedAt"> = {
      clientId: entryData.clientId || "",
      clientName: entryData.clientName,
      amount: entryData.amount,
      amountPaid: actualPayment, // The amount for this specific receipt
      status: paymentStatus,
      issuedDate: new Date().toISOString(),
      notes: notes || "",
      items: [
        {
          id: uuidv4(),
          invoiceId: "", // Will be set after invoice creation
          estateEntryId: entryId,
          description: `Payment for plot(s) ${entryData.plotNumbers.join(", ")}`,
          amount: actualPayment,
          createdAt: new Date().toISOString(),
          plotDetails: entryData.plotNumbers.join(", ")
        }
      ]
    };
    
    // Create the invoice
    const invoice = await createInvoice(newInvoice);
    
    // Update the invoice ID in the items
    if (invoice.items) {
      invoice.items.forEach(item => {
        item.invoiceId = invoice.id;
      });
    }
    
    // Update the estate entry with new paid amount and status
    await updateEstateEntry(estateId, entryId, {
      amountPaid: newAmountPaid,
      paymentStatus: paymentStatus
    });
    
    return invoice;
  } catch (error) {
    console.error("Error creating receipt:", error);
    throw error;
  }
};

// Helper function to fetch an estate entry
const fetchEstateEntry = async (estateId: string, entryId: string) => {
  try {
    // This is a mock implementation - in a real app you'd fetch from API
    return new Promise((resolve) => {
      setTimeout(() => {
        const estate = require("./estateData").mockEstates.find((e: any) => e.id === estateId);
        if (!estate) resolve(undefined);
        const entry = estate.entries.find((e: any) => e.id === entryId);
        resolve(entry);
      }, 100);
    });
  } catch (error) {
    console.error("Error fetching estate entry:", error);
    throw error;
  }
};

export const updateInvoice = async (id: string, updates: Partial<Invoice>): Promise<Invoice | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvoices.findIndex((invoice) => invoice.id === id);
      if (index !== -1) {
        mockInvoices[index] = {
          ...mockInvoices[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockInvoices[index]);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockInvoices.findIndex((invoice) => invoice.id === id);
      if (index !== -1) {
        mockInvoices.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};
