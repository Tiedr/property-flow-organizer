
import { v4 as uuidv4 } from "uuid";
import { Estate, EstateEntry } from "@/types";

const mockEstates: Estate[] = [
  {
    id: "1",
    name: "Westlands Estate",
    description: "A prime estate in the heart of Westlands.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      {
        id: uuidv4(),
        clientName: "John Doe",
        uniqueId: "JD123",
        representative: "Jane Smith",
        plotNumbers: ["W1", "W2"],
        amount: 500000,
        amountPaid: 250000,
        documentsReceived: ["ID", "Title Deed"],
        phoneNumber: "+254712345678",
        email: "john.doe@example.com",
        address: "Westlands, Nairobi",
        paymentStatus: "Partial",
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Kilimani Heights",
    description: "Luxury apartments in Kilimani.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      {
        id: uuidv4(),
        clientName: "Alice Maina",
        uniqueId: "AM456",
        representative: "Bob Kamau",
        plotNumbers: ["K10", "K11"],
        amount: 750000,
        amountPaid: 750000,
        documentsReceived: ["ID", "KRA Pin"],
        phoneNumber: "+254722333444",
        email: "alice.maina@example.com",
        address: "Kilimani, Nairobi",
        paymentStatus: "Paid",
        nextDueDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
      },
    ],
  },
];

export const getAllEstates = async (): Promise<Estate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEstates);
    }, 200);
  });
};

export const getEstateById = async (id: string): Promise<Estate | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estate = mockEstates.find((estate) => estate.id === id);
      resolve(estate);
    }, 200);
  });
};

export const createEstate = async (estateData: Omit<Estate, "id" | "createdAt" | "updatedAt" | "entries">): Promise<Estate> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEstate: Estate = {
        id: uuidv4(),
        ...estateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: [],
      };
      mockEstates.push(newEstate);
      resolve(newEstate);
    }, 200);
  });
};

export const updateEstate = async (id: string, updates: Partial<Estate>): Promise<Estate | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEstates.findIndex((estate) => estate.id === id);
      if (index !== -1) {
        mockEstates[index] = {
          ...mockEstates[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockEstates[index]);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const deleteEstate = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEstates.findIndex((estate) => estate.id === id);
      if (index !== -1) {
        mockEstates.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};

// Add the missing functions for estate entries
export const createEntry = async (estateId: string, entryData: Omit<EstateEntry, "id">): Promise<EstateEntry | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estate = mockEstates.find((estate) => estate.id === estateId);
      if (estate) {
        const newEntry: EstateEntry = {
          id: uuidv4(),
          ...entryData,
        };
        estate.entries.push(newEntry);
        resolve(newEntry);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const updateEntry = async (estateId: string, entryId: string, updates: Partial<EstateEntry>): Promise<EstateEntry | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estate = mockEstates.find((estate) => estate.id === estateId);
      if (estate) {
        const entryIndex = estate.entries.findIndex((entry) => entry.id === entryId);
        if (entryIndex !== -1) {
          estate.entries[entryIndex] = {
            ...estate.entries[entryIndex],
            ...updates,
          };
          resolve(estate.entries[entryIndex]);
        } else {
          resolve(undefined);
        }
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const deleteEntry = async (estateId: string, entryId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const estate = mockEstates.find((estate) => estate.id === estateId);
      if (estate) {
        const entryIndex = estate.entries.findIndex((entry) => entry.id === entryId);
        if (entryIndex !== -1) {
          estate.entries.splice(entryIndex, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }, 200);
  });
};

// Aliases for the functions to match the imports in EstateDetailPage.tsx
export const createEstateEntry = createEntry;
export const updateEstateEntry = updateEntry;
export const deleteEstateEntry = deleteEntry;
