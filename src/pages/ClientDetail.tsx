
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Client, Project } from "@/types";
import { generateMockClients, generateMockProjects } from "@/services/mockData";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/data/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientForm from "@/components/forms/ClientForm";
import { useToast } from "@/components/ui/use-toast";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const mockClients = generateMockClients(15);
    const foundClient = mockClients.find((c) => c.id === id);
    
    if (foundClient) {
      setClient(foundClient);
      
      // Generate mock projects for this client
      const mockProjects = generateMockProjects([foundClient], 
        Math.max(3, Math.floor(Math.random() * 8))
      );
      setClientProjects(mockProjects);
    }
  }, [id]);

  const handleUpdateClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    if (client) {
      const updatedClient = {
        ...client,
        ...clientData,
      };
      setClient(updatedClient);
      setIsEditDialogOpen(false);
    }
  };

  if (!client) {
    return (
      <Layout>
        <div>Client not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => setIsEditDialogOpen(true)}>Edit Client</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-estate-muted">Email</dt>
                <dd>{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Phone</dt>
                <dd>{client.phone}</dd>
              </div>
              {client.company && (
                <div>
                  <dt className="text-sm text-estate-muted">Company</dt>
                  <dd>{client.company}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-estate-muted">Type</dt>
                <dd>{client.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Status</dt>
                <dd>{client.status}</dd>
              </div>
              <div>
                <dt className="text-sm text-estate-muted">Client Since</dt>
                <dd>{client.createdAt}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projects Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-estate-muted">Total Projects</p>
                <p className="text-2xl font-bold">{clientProjects.length}</p>
              </div>
              <div>
                <p className="text-sm text-estate-muted">Active Projects</p>
                <p className="text-xl">
                  {clientProjects.filter(p => p.status === "In Progress").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-estate-muted">Total Value</p>
                <p className="text-xl">
                  ${clientProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Projects</CardTitle>
          <CardDescription>Projects associated with {client.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={clientProjects}
            columns={[
              { key: "name", header: "Project Name" },
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
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <ClientForm
            client={client}
            onSubmit={handleUpdateClient}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ClientDetail;
