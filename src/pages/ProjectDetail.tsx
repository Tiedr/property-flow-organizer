
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Client, Project } from "@/types";
import { generateMockClients, generateMockProjects } from "@/services/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const mockClients = generateMockClients(15);
    const mockProjects = generateMockProjects(mockClients, 25);
    const foundProject = mockProjects.find((p) => p.id === id);

    if (foundProject) {
      setProject(foundProject);
    }
  }, [id]);

  if (!project) {
    return (
      <Layout>
        <div>Project not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-estate-muted">
              Client: {project.clientName} • {project.type} • {project.status}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => toast({
              title: "Edit project",
              description: "Edit project functionality will be implemented in the next version.",
            })}>
              Edit Project
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-estate-muted">Status</dt>
                <dd>{project.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Type</dt>
                <dd>{project.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Created</dt>
                <dd>{project.createdAt}</dd>
              </div>
              {project.location && (
                <div>
                  <dt className="text-sm text-estate-muted">Location</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-estate-muted">Start Date</dt>
                <dd>{project.startDate}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">End Date</dt>
                <dd>{project.endDate || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Duration</dt>
                <dd>
                  {project.endDate ? 
                    `${Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days` : 
                    "In progress"
                  }
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-estate-muted">Total Budget</dt>
                <dd className="text-2xl font-bold">${project.budget.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Spent</dt>
                <dd>
                  ${Math.floor(project.budget * (Math.random() * 0.8)).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Remaining</dt>
                <dd className="text-estate-primary font-medium">
                  ${Math.floor(project.budget * (0.2 + Math.random() * 0.5)).toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Project files and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-estate-muted">
              <p>No documents uploaded yet.</p>
              <Button variant="outline" className="mt-4" onClick={() => toast({
                title: "Document upload",
                description: "Document upload functionality will be implemented in the next version.",
              })}>
                Upload Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Project notes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-estate-muted">
              <p>No notes added yet.</p>
              <Button variant="outline" className="mt-4" onClick={() => toast({
                title: "Notes",
                description: "Notes functionality will be implemented in the next version.",
              })}>
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
