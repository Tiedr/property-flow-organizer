
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
import { getAllClients, createClient } from "@/services/clientData";
import DataTable from "@/components/data/DataTable";
import ClientForm from "@/components/forms/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import ImportData from "@/components/data/ImportData";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, RefreshCw, FileUp } from "lucide-react";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isImportClientOpen, setIsImportClientOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load clients: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newClient = await createClient(clientData);
      setClients((prev) => [newClient, ...prev]);
      setIsAddClientOpen(false);
      toast({
        title: "Client created",
        description: `${newClient.name} has been created successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create client: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleImportClients = async (importedClients: any[]) => {
    try {
      const createdClients = [];
      
      for (const importedClient of importedClients) {
        try {
          const client = await createClient({
            name: importedClient.name || "Unknown",
            uniqueId: importedClient.uniqueId || Math.random().toString(36).substring(2, 10).toUpperCase(),
            email: importedClient.email || "",
            phone: importedClient.phone || "",
            company: importedClient.company || undefined,
            type: importedClient.type === "Company" ? "Company" : "Individual",
            status: ["Active", "Inactive", "Lead"].includes(importedClient.status) 
              ? importedClient.status as "Active" | "Inactive" | "Lead"
              : "Active",
          });
          
          createdClients.push(client);
        } catch (error) {
          console.error("Error importing client:", error);
        }
      }
      
      setClients((prev) => [...createdClients, ...prev]);
      setIsImportClientOpen(false);
      
      toast({
        title: "Clients imported",
        description: `Successfully imported ${createdClients.length} clients.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to import clients: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-slate-400">Manage your clients and their properties</p>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-3">
          <Button variant="outline" onClick={() => setIsImportClientOpen(true)} className="glass-input hover:bg-white/10">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsAddClientOpen(true)} className="apple-button">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>
      
      <div className="flex items-center mb-4 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Button variant="outline" onClick={fetchClients} size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="glass-card">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Loading clients...</p>
          </div>
        ) : (
          <DataTable
            data={filteredClients}
            columns={[
              { key: "uniqueId", header: "Unique ID" },
              { key: "name", header: "Name" },
              { key: "email", header: "Email" },
              { key: "phone", header: "Phone" },
              { key: "type", header: "Type" },
              { key: "status", header: "Status" },
            ]}
            onRowClick={(client) => navigate(`/clients/${client.id}`)}
            emptyMessage="No clients found. Add a client to get started."
            renderCell={(row, column) => {
              if (column.key === "status") {
                const statusColors = {
                  Active: "bg-green-500/20 text-green-300",
                  Inactive: "bg-gray-500/20 text-gray-300",
                  Lead: "bg-blue-500/20 text-blue-300"
                };
                
                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status as keyof typeof statusColors]}`}>
                    {row.status}
                  </span>
                );
              }
              return null;
            }}
          />
        )}
      </div>
      
      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setIsAddClientOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImportClientOpen} onOpenChange={setIsImportClientOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Import Clients</DialogTitle>
          </DialogHeader>
          <ImportData 
            type="clients" 
            onImport={handleImportClients} 
            onCancel={() => setIsImportClientOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clients;
