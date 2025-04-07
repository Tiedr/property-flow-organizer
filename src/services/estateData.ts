import { v4 as uuidv4 } from "uuid";
import { Estate, EstateEntry } from "@/types";
import { faker } from '@faker-js/faker';

// Store generated estates to keep them consistent between renders
let generatedEstates: Estate[] | null = null;

// Generate a random entry for an estate
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
    phoneNumber: faker.phone.number(), // Updated to use default format
    email: faker.internet.email(),
    address: faker.location.streetAddress() + ", " + faker.location.city(),
    paymentStatus: paymentStatus,
    nextDueDate: faker.date.future().toISOString().split('T')[0]
  };
};

// Generate mock data for estates
export const generateEstateData = (count: number): Estate[] => {
  // Return cached data if available
  if (generatedEstates) {
    return generatedEstates;
  }
  
  // Otherwise generate new data
  generatedEstates = Array.from({ length: count }, (_, i) => {
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
  
  return generatedEstates;
};

// Get a specific estate by ID
export const getEstateById = (id: string): Estate | undefined => {
  // Generate data if not already done
  if (!generatedEstates) {
    generateEstateData(5);
  }
  
  return generatedEstates?.find(estate => estate.id === id);
};

// Update an estate in our store
export const updateEstate = (updatedEstate: Estate): void => {
  if (!generatedEstates) {
    return;
  }
  
  const index = generatedEstates.findIndex(e => e.id === updatedEstate.id);
  if (index !== -1) {
    generatedEstates[index] = updatedEstate;
  }
};

// Create a new estate
export const createEstate = (estate: Omit<Estate, "id">): Estate => {
  const newEstate: Estate = {
    ...estate,
    id: uuidv4()
  };
  
  if (!generatedEstates) {
    generatedEstates = [];
  }
  
  generatedEstates.unshift(newEstate);
  return newEstate;
};

// Delete an estate
export const deleteEstate = (id: string): boolean => {
  if (!generatedEstates) {
    return false;
  }
  
  const initialLength = generatedEstates.length;
  generatedEstates = generatedEstates.filter(estate => estate.id !== id);
  
  return generatedEstates.length < initialLength;
};
