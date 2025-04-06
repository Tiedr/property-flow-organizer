
import { Client, Project } from "../types";
import { v4 as uuidv4 } from "uuid";

// Generate random dates within a range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString().split("T")[0];
};

// Generate mock clients
export const generateMockClients = (count: number = 15): Client[] => {
  const types: ["Individual", "Company"] = ["Individual", "Company"];
  const statuses: ["Active", "Inactive", "Lead"] = ["Active", "Inactive", "Lead"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: uuidv4(),
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    phone: `+1 555-${Math.floor(1000 + Math.random() * 9000)}`,
    company: types[Math.floor(Math.random() * types.length)] === "Company" ? `Company ${i + 1}` : undefined,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    projects: Math.floor(Math.random() * 5),
    createdAt: getRandomDate(new Date(2023, 0, 1), new Date())
  }));
};

// Generate mock projects
export const generateMockProjects = (
  clients: Client[],
  count: number = 25
): Project[] => {
  const statuses: ["Planning", "In Progress", "On Hold", "Completed"] = [
    "Planning",
    "In Progress",
    "On Hold",
    "Completed"
  ];
  const types: ["Construction", "Renovation", "Real Estate"] = [
    "Construction",
    "Renovation",
    "Real Estate"
  ];
  
  return Array.from({ length: count }).map((_, i) => {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const startDate = getRandomDate(new Date(2023, 0, 1), new Date());
    const endDate =
      Math.random() > 0.3
        ? getRandomDate(new Date(startDate), new Date(new Date().setMonth(new Date().getMonth() + 6)))
        : undefined;
        
    return {
      id: uuidv4(),
      name: `Project ${i + 1}`,
      clientId: client.id,
      clientName: client.name,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      budget: Math.floor(50000 + Math.random() * 950000),
      startDate,
      endDate,
      location: `Location ${i + 1}`,
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date())
    };
  });
};
