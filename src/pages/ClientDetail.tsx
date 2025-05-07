
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Client, EstateEntry, Invoice } from "@/types";
import { getClientById, getClientProperties, getClientInvoices, deleteClient, updateClient } from "@/services/clientData";
import { ArrowLeft, Edit, Trash, FilePlus, Building, FileText, Home } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ClientForm from "@/components/forms/ClientForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [properties, setProperties] = useState<EstateEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast({
            title: "Error",
            description: "Client ID is missing",
            variant: "destructive"
          });
          return;
        }
        
        const clientData = await getClientById(id);
        setClient(clientData);
        
        const propertiesData = await getClientProperties(id);
        setProperties(propertiesData);
        
        const invoicesData = await getClientInvoices(id);
        setInvoices(invoicesData);
      } catch (error: any) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Error",
          description: "Failed to load client details: " + (error.message || "Unknown error"),
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [id, toast]);

  const handleBack = () => {
    // Changed to use navigate(-1) which goes back to the previous page
    navigate(-1);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await deleteClient(id);
      toast({
        title: "Client Deleted",
        description: `Client "${client?.name}" has been deleted successfully.`
      });
      navigate("/clients");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete client: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleUpdateClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    if (!id || !client) return;
    
    try {
      const updatedClient = await updateClient(id, clientData);
      setClient({
        ...updatedClient,
        properties: client.properties,
        totalAmount: client.totalAmount,
        totalPaid: client.totalPaid
      });
      setIsEditDialogOpen(false);
      
      toast({
        title: "Client Updated",
        description: `Client "${updatedClient.name}" has been updated successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update client: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handlePropertyClick = (propertyId: string, estateId: string) => {
    // Navigate to the estate detail page
    navigate(`/estates/${estateId}`);
  };

  const handleCreateInvoice = () => {
    setIsCreateInvoiceDialogOpen(true);
  };

  const handleInvoiceSubmit = async () => {
    if (!id || !client) return;
    
    try {
      const amount = parseFloat(invoiceAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid amount greater than zero",
          variant: "destructive"
        });
        return;
      }
      
      // Simple mock implementation for demo purposes
      const newInvoice: Invoice = {
        id: `INV-${Math.floor(Math.random() * 10000)}`,
        clientId: id,
        clientName: client.name,
        amount: amount,
        amountPaid: 0,
        status: "Pending",
        issuedDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
      setIsCreateInvoiceDialogOpen(false);
      setInvoiceAmount("");
      
      toast({
        title: "Invoice Created",
        description: `Invoice for ₦${amount.toLocaleString()} has been created successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Loading client details...</p>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Client not found</p>
          <Button onClick={handleBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-2">
          <Button onClick={handleBack} variant="ghost" className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{client?.name}</h1>
            <p className="text-muted-foreground">
              Unique ID: {client?.uniqueId} | Type: {client?.type}
            </p>
          </div>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Button onClick={handleCreateInvoice} className="apple-button">
            <FilePlus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          <Button onClick={handleEdit} className="apple-button-secondary">
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete Client
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{client.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{client.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p>{client.company || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.status === "Active" ? "bg-green-500/20 text-green-300" : 
                        client.status === "Inactive" ? "bg-gray-500/20 text-gray-300" : 
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {client.status}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Properties</h3>
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-2xl font-bold">{properties.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">₦{(client.totalAmount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Payments</h3>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-2xl font-bold">₦{(client.totalPaid || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">₦{((client.totalAmount || 0) - (client.totalPaid || 0)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (client.totalPaid || 0) >= (client.totalAmount || 0) ? "bg-green-500/20 text-green-300" : 
                        (client.totalPaid || 0) > 0 ? "bg-amber-500/20 text-amber-300" : 
                        "bg-red-500/20 text-red-300"
                      }`}>
                        {(client.totalPaid || 0) >= (client.totalAmount || 0) ? "Paid" : 
                         (client.totalPaid || 0) > 0 ? "Partial" : "Pending"}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
              </div>
              <p className="text-center text-muted-foreground py-4">
                Activity tracking will be implemented in the next version.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Properties ({properties.length})</h3>
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={() => navigate("/")}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Property
                </Button>
              </div>
              
              {properties.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-900/40">
                      <TableRow>
                        <TableHead>Estate</TableHead>
                        <TableHead>Plot Numbers</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow 
                          key={property.id} 
                          className="cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => handlePropertyClick(property.id, property.estateName || "")}
                        >
                          <TableCell>{property.estateName || "Unknown"}</TableCell>
                          <TableCell>{property.plotNumbers.join(", ")}</TableCell>
                          <TableCell>₦{property.amount.toLocaleString()}</TableCell>
                          <TableCell>₦{property.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              property.paymentStatus === "Paid" ? "bg-green-500/20 text-green-300" : 
                              property.paymentStatus === "Partial" ? "bg-amber-500/20 text-amber-300" : 
                              property.paymentStatus === "Overdue" ? "bg-red-500/20 text-red-300" : 
                              "bg-blue-500/20 text-blue-300"
                            }`}>
                              {property.paymentStatus}
                            </span>
                          </TableCell>
                          <TableCell>{property.nextDueDate || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Home className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">This client has no properties yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/")}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Invoices ({invoices.length})</h3>
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={handleCreateInvoice}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </div>
              
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-900/40">
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow 
                          key={invoice.id} 
                          className="cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <TableCell>{typeof invoice.id === 'string' ? invoice.id.substring(0, 8).toUpperCase() : 'N/A'}</TableCell>
                          <TableCell>{new Date(invoice.issuedDate).toLocaleDateString()}</TableCell>
                          <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                          <TableCell>₦{invoice.amountPaid.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.status === "Paid" ? "bg-green-500/20 text-green-300" : 
                              invoice.status === "Partial" ? "bg-amber-500/20 text-amber-300" : 
                              invoice.status === "Overdue" ? "bg-red-500/20 text-red-300" : 
                              "bg-blue-500/20 text-blue-300"
                            }`}>
                              {invoice.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No invoices found for this client.</p>
                  <Button 
                    className="mt-4" 
                    onClick={handleCreateInvoice}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Edit Client</DialogTitle>
          </DialogHeader>
          {client && (
            <ClientForm
              initialData={client}
              onSubmit={handleUpdateClient}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-gradient">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the client "{client.name}"? This will not delete associated properties, but will remove the link to this client. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)} 
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceDialogOpen} onOpenChange={setIsCreateInvoiceDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Create New Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for client {client.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Invoice Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateInvoiceDialogOpen(false)}
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvoiceSubmit}
              className="apple-button"
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ClientDetail;
