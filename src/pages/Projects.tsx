
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Client, Project } from "@/types";
import { generateMockClients, generateMockProjects } from "@/services/mockData";
import DataTable from "@/components/data/DataTable";
import { useToast } from "@/components/ui/use-toast";
import ImportData from "@/components/data/ImportData";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Generate mock data
    const mockClients = generateMockClients(15);
    const mockProjects = generateMockProjects(mockClients, 25);
    setProjects(mockProjects);
  }, []);

  const handleImportProjects = (importedProjects: any[]) => {
    toast({
      title: "Import functionality",
      description: "Project import functionality will be implemented in the next version.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-estate-muted">Manage your projects</p>
        </div>
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <ImportData type="projects" onImport={handleImportProjects} />
          <Button onClick={() => toast({
            title: "Add project",
            description: "Add project functionality will be implemented in the next version.",
          })}>
            Add Project
          </Button>
        </div>
      </div>

      <DataTable
        data={projects}
        columns={[
          { key: "name", header: "Project Name" },
          { key: "clientName", header: "Client" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status" },
          { 
            key: "budget", 
            header: "Budget",
            renderCell: (project: Project) => `$${project.budget.toLocaleString()}` 
          },
          { key: "startDate", header: "Start Date" },
        ]}
        onRowClick={(project) => navigate(`/projects/${project.id}`)}
      />
    </Layout>
  );
};

export default Projects;
