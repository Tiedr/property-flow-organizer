import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/types";
import { getAllProjects, createProject } from "@/services/projectData";
import DataTable from "@/components/data/DataTable";
import ProjectForm from "@/components/forms/ProjectForm";
import { useToast } from "@/components/ui/use-toast";
import ImportData from "@/components/data/ImportData";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, RefreshCw, FileUp } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isImportProjectOpen, setIsImportProjectOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fix the type error by changing to allowed type
  const [importType, setImportType] = useState<"estates" | "clients" | "invoices">("clients");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load projects: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData: Omit<Project, "id" | "createdAt">) => {
    try {
      const newProject = await createProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
      setIsAddProjectOpen(false);
      toast({
        title: "Project created",
        description: `${newProject.name} has been created successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create project: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleImportProjects = async (importedProjects: any[]) => {
    try {
      const createdProjects = [];
      
      for (const importedProject of importedProjects) {
        try {
          const project = await createProject({
            name: importedProject.name || "Unknown",
            clientId: importedProject.clientId || "Unknown",
            clientName: importedProject.clientName || "Unknown",
            status: importedProject.status || "Planning",
            type: importedProject.type || "Construction",
            budget: importedProject.budget || 0,
            startDate: importedProject.startDate || new Date().toISOString(),
            endDate: importedProject.endDate || new Date().toISOString(),
            location: importedProject.location || "",
          });
          
          createdProjects.push(project);
        } catch (error) {
          console.error("Error importing project:", error);
        }
      }
      
      setProjects((prev) => [...createdProjects, ...prev]);
      setIsImportProjectOpen(false);
      
      toast({
        title: "Projects imported",
        description: `Successfully imported ${createdProjects.length} projects.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to import projects: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400">Manage your projects and their progress</p>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-3">
          <Button variant="outline" onClick={() => setIsImportProjectOpen(true)} className="glass-input hover:bg-white/10">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsAddProjectOpen(true)} className="apple-button">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>
      
      <div className="flex items-center mb-4 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Button variant="outline" onClick={fetchProjects} size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="glass-card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Loading projects...</p>
          </div>
        ) : (
          <DataTable
            data={filteredProjects}
            columns={[
              { key: "name", header: "Name" },
              { key: "clientId", header: "Client ID" },
              { key: "clientName", header: "Client Name" },
              { key: "status", header: "Status" },
              { key: "type", header: "Type" },
              { key: "budget", header: "Budget" },
            ]}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
            emptyMessage="No projects found. Add a project to get started."
          />
        )}
      </div>
      
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Add New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleAddProject}
            onCancel={() => setIsAddProjectOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImportProjectOpen} onOpenChange={setIsImportProjectOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Import Projects</DialogTitle>
          </DialogHeader>
          <ImportData 
            type="clients" 
            onImport={handleImportProjects} 
            onCancel={() => setIsImportProjectOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Projects;
