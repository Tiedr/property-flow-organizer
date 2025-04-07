
import { Estate, EstateEntry } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Array of possible plot document types
const documentTypes = [
  "Sale Deed",
  "Title Deed",
  "Property Tax Receipt",
  "NOC",
  "Building Plan",
  "Occupancy Certificate",
  "Possession Certificate",
  "Land Survey Document"
];

// Function to generate a random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random array of plot numbers
const generatePlotNumbers = () => {
  const count = getRandomNumber(1, 5);
  return Array.from({ length: count }, () => `PL-${getRandomNumber(100, 999)}`);
};

// Function to generate a random array of documents
const generateDocuments = () => {
  const count = getRandomNumber(0, 3);
  const docs = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * documentTypes.length);
    docs.push(documentTypes[randomIndex]);
  }
  return [...new Set(docs)]; // Remove duplicates
};

// Function to generate a random payment status
const generatePaymentStatus = () => {
  const statuses = ["Paid", "Partial", "Pending", "Overdue"];
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex] as "Paid" | "Partial" | "Pending" | "Overdue";
};

// Function to generate a random due date
const generateDueDate = () => {
  const currentDate = new Date();
  const randomDays = getRandomNumber(-30, 60);
  currentDate.setDate(currentDate.getDate() + randomDays);
  return currentDate.toISOString().split('T')[0];
};

// Function to generate a random phone number
const generatePhoneNumber = () => {
  return `+91 ${getRandomNumber(7000000000, 9999999999)}`;
};

// Function to generate a single estate entry
const generateEstateEntry = (): EstateEntry => {
  const firstName = ["John", "Jane", "Mike", "Sara", "David", "Rachel", "Robert", "Emma", "Vijay", "Priya", "Raj", "Anita"][getRandomNumber(0, 11)];
  const lastName = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Patel", "Kumar", "Singh", "Sharma"][getRandomNumber(0, 11)];
  const clientName = `${firstName} ${lastName}`;
  
  const plotNumbers = generatePlotNumbers();
  const amount = getRandomNumber(500000, 10000000);
  const paymentStatus = generatePaymentStatus();
  const amountPaid = paymentStatus === "Paid" ? amount : 
                    paymentStatus === "Partial" ? Math.floor(amount * getRandomNumber(30, 70) / 100) : 0;

  return {
    id: uuidv4(),
    clientName,
    uniqueId: `EST-${getRandomNumber(1000, 9999)}`,
    representative: Math.random() > 0.3 ? `${["Alex", "Sam", "Jamie", "Amit", "Rahul"][getRandomNumber(0, 4)]} ${["Taylor", "Morgan", "Riley", "Verma", "Gupta"][getRandomNumber(0, 4)]}` : "",
    plotNumbers,
    amount,
    amountPaid,
    documentsReceived: generateDocuments(),
    phoneNumber: generatePhoneNumber(),
    email: `${clientName.toLowerCase().replace(' ', '.')}@example.com`,
    address: Math.random() > 0.2 ? `${getRandomNumber(1, 100)} ${["Main St", "Park Avenue", "Lake View", "Green Road", "Hill Drive"][getRandomNumber(0, 4)]}, ${["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"][getRandomNumber(0, 4)]}` : "",
    paymentStatus,
    nextDueDate: generateDueDate()
  };
};

// Function to generate mock estate data with entries
export const generateEstateData = (count: number = 5): Estate[] => {
  const estates: Estate[] = [];

  const estateNames = [
    "Green Valley Estate",
    "Harmony Heights",
    "Riverside Residency",
    "Golden Meadows",
    "Silver Oak Estate",
    "Blue Mountain Properties",
    "Sunset Gardens",
    "Paradise Acres",
    "Royal Palm Estate",
    "Crystal Springs"
  ];

  const estateDescriptions = [
    "Luxury villa plots with modern amenities",
    "Exclusive gated community with scenic views",
    "Premium residential plots near the tech park",
    "Eco-friendly residential layout with green spaces",
    "High-end plots with excellent connectivity"
  ];

  for (let i = 0; i < count; i++) {
    // Generate random date in the past 2 years
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - getRandomNumber(0, 730));
    const createdAtIso = createdDate.toISOString();

    // Generate random updated date between created date and now
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(updatedDate.getDate() + getRandomNumber(0, 30));
    const updatedAtIso = updatedDate.toISOString();

    const nameIndex = i % estateNames.length;
    const descIndex = i % estateDescriptions.length;

    // Generate random number of entries per estate
    const entriesCount = getRandomNumber(0, 8);
    const entries: EstateEntry[] = [];
    
    for (let j = 0; j < entriesCount; j++) {
      entries.push(generateEstateEntry());
    }

    estates.push({
      id: uuidv4(),
      name: estateNames[nameIndex],
      description: estateDescriptions[descIndex],
      createdAt: createdAtIso,
      updatedAt: updatedAtIso,
      entries
    });
  }

  return estates;
};

// For backwards compatibility with existing code (if needed)
export const generateMockEstateData = (count: number = 15): any[] => {
  return Array.from({ length: count }, () => generateEstateEntry());
};
