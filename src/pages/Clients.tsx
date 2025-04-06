
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@/types";
import { generateMockClients } from "@/services/mockData";
import DataTable from "@/components/data/DataTable";
import ClientForm from "@/components/forms/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import ImportData from "@/components/data/ImportData";
import { v4 as uuidv4 } from "uuid";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load mock clients
    setClients(generateMockClients(15));
  }, []);

  const handleAddClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      createdAt: new Date().toISOString().split("T")[0],
      projects: 0,
    };
    
    setClients((prev) => [newClient, ...prev]);
    setIsAddClientOpen(false);
  };

  const handleImportClients = (importedClients: any[]) => {
    const formatted: Client[] = importedClients.map((client) => ({
      id: uuidv4(),
      name: client.name || "Unknown",
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || undefined,
      // Ensure type is strictly "Individual" or "Company"
      type: client.type === "Company" ? "Company" : "Individual",
      // Ensure status is strictly one of the allowed values
      status: ["Active", "Inactive", "Lead"].includes(client.status) 
        ? client.status as "Active" | "Inactive" | "Lead"
        : "Active",
      projects: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    
    setClients((prev) => [...formatted, ...prev]);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-estate-muted">Manage your clients</p>
        </div>
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <ImportData type="clients" onImport={handleImportClients} />
          <Button onClick={() => setIsAddClientOpen(true)}>Add Client</Button>
        </div>
      </div>
      
      <DataTable
        data={clients}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status" },
          { key: "projects", header: "Projects" },
        ]}
        onRowClick={(client) => navigate(`/clients/${client.id}`)}
      />
      
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setIsAddClientOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clients;
