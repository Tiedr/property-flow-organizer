
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/types";

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Westlands Development",
    clientId: "1",
    clientName: "John Doe",
    status: "Planning",
    type: "Construction",
    budget: 5000000,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    location: "Westlands, Nairobi",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Kilimani Heights Extension",
    clientId: "2",
    clientName: "Alice Maina",
    status: "In Progress",
    type: "Renovation",
    budget: 3500000,
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    location: "Kilimani, Nairobi",
    createdAt: new Date().toISOString(),
  },
];

// Project functions
export const getAllProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects);
    }, 200);
  });
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find((project) => project.id === id);
      resolve(project);
    }, 200);
  });
};

export const createProject = async (projectData: Omit<Project, "id" | "createdAt">): Promise<Project> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject: Project = {
        id: uuidv4(),
        ...projectData,
        createdAt: new Date().toISOString(),
      };
      mockProjects.push(newProject);
      resolve(newProject);
    }, 200);
  });
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProjects.findIndex((project) => project.id === id);
      if (index !== -1) {
        mockProjects[index] = {
          ...mockProjects[index],
          ...updates,
        };
        resolve(mockProjects[index]);
      } else {
        resolve(undefined);
      }
    }, 200);
  });
};

export const deleteProject = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProjects.findIndex((project) => project.id === id);
      if (index !== -1) {
        mockProjects.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 200);
  });
};
