
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Updated import path
import { Estate, EstateEntry, Invoice, InvoiceItem, ClientDetails } from "@/types";
import { getEstateById, createEstateEntry, updateEstateEntry, deleteEstateEntry } from "@/services/estateData";
import { createClientInvoice, getClientById } from "@/services/clientData";
import DataTable from "@/components/data/DataTable";
import { FilePlus, Plus, Edit, Trash2, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import EstateForm from "@/components/forms/EstateForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import InvoiceReceiptDialog from "@/components/invoice/InvoiceReceiptDialog";

const EstateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estate, setEstate] = useState<Estate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>("");
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState<string>("");
  
  // New state for entry management
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<EstateEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  // New state for invoice receipt
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentClient, setCurrentClient] = useState<ClientDetails | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const fetchEstate = async () => {
      setLoading(true);
      try {
        if (!id) {
          toast({
            title: "Error",
            description: "Estate ID is missing",
            variant: "destructive",
          });
          return;
        }
        const estateData = await getEstateById(id);
        setEstate(estateData);
      } catch (error: any) {
        console.error("Error fetching estate:", error);
        toast({
          title: "Error",
          description: "Failed to load estate: " + (error.message || "Unknown error"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEstate();
    }
  }, [id, toast, user]);

  const handleGoBack = () => {
    navigate("/estates");
  };

  // Helper function to validate UUID format
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const handleCreateInvoice = (clientId: string, clientName: string) => {
    // Enhanced validation for client ID - must be a valid UUID
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '' || !isValidUUID(clientId)) {
      toast({
        title: "Error",
        description: `Invalid client ID format: ${clientId}. Cannot create invoice.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setIsCreateInvoiceDialogOpen(true);
  };

  const handleInvoiceSubmit = async () => {
    if (!selectedClientId) {
      toast({
        title: "Error",
        description: "Client ID is missing. Cannot create invoice.",
        variant: "destructive"
      });
      return;
    }
    
    // Re-validate UUID format before submission
    if (!isValidUUID(selectedClientId)) {
      toast({
        title: "Error",
        description: `Invalid client ID format: ${selectedClientId}. Cannot create invoice.`,
        variant: "destructive"
      });
      return;
    }
    
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
      
      const newInvoice = await createClientInvoice(selectedClientId, {
        amount,
        status: "Pending",
      });
      
      setIsCreateInvoiceDialogOpen(false);
      setInvoiceAmount("");
      
      toast({
        title: "Invoice Created",
        description: `Invoice for ₦${amount.toLocaleString()} has been created for ${selectedClientName}.`
      });

      // Show invoice receipt after creation
      if (newInvoice) {
        showInvoiceReceipt(newInvoice, selectedClientId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create invoice: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  // New function to handle showing invoice receipt
  const showInvoiceReceipt = async (invoice: Invoice, clientId: string) => {
    try {
      // Fetch client details
      const clientDetails = await getClientById(clientId);
      
      // Set current invoice and client for receipt
      setCurrentInvoice(invoice);
      setCurrentClient(clientDetails);
      
      // Generate invoice items (simplified for now)
      const item: InvoiceItem = {
        id: "",
        invoiceId: invoice.id,
        description: "Property Payment",
        amount: invoice.amount,
        createdAt: invoice.createdAt,
        plotDetails: estate?.name || ""
      };
      
      setInvoiceItems([item]);
      
      // Open receipt dialog
      setIsReceiptDialogOpen(true);
    } catch (error) {
      console.error("Error preparing receipt:", error);
      toast({
        title: "Error",
        description: "Failed to prepare invoice receipt",
        variant: "destructive"
      });
    }
  };

  // New functions for entry management
  const handleAddEntry = () => {
    setCurrentEntry(null);
    setIsEditing(false);
    setIsEntryDialogOpen(true);
  };

  const handleEditEntry = (entry: EstateEntry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
    setIsEntryDialogOpen(true);
  };

  const handleDeleteEntry = (entryId: string) => {
    setDeleteEntryId(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleEntrySubmit = async (entryData: Omit<EstateEntry, "id">) => {
    if (!id) return;
    
    try {
      if (isEditing && currentEntry) {
        // Update existing entry
        const updatedEntry = await updateEstateEntry(id, currentEntry.id, entryData);
        
        if (updatedEntry && estate) {
          const updatedEntries = estate.entries.map(entry => 
            entry.id === updatedEntry.id ? updatedEntry : entry
          );
          
          setEstate({
            ...estate,
            entries: updatedEntries
          });
          
          toast({
            title: "Entry Updated",
            description: "Estate entry has been updated successfully."
          });
        }
      } else {
        // Create new entry
        const newEntry = await createEstateEntry(id, entryData);
        
        if (newEntry && estate) {
          setEstate({
            ...estate,
            entries: [...estate.entries, newEntry]
          });
          
          toast({
            title: "Entry Created",
            description: "New estate entry has been added successfully."
          });
        }
      }
      
      setIsEntryDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save entry: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const confirmDeleteEntry = async () => {
    if (!id || !deleteEntryId) return;
    
    try {
      const success = await deleteEstateEntry(id, deleteEntryId);
      
      if (success && estate) {
        const updatedEntries = estate.entries.filter(entry => entry.id !== deleteEntryId);
        
        setEstate({
          ...estate,
          entries: updatedEntries
        });
        
        toast({
          title: "Entry Deleted",
          description: "Estate entry has been deleted successfully."
        });
      }
      
      setIsDeleteDialogOpen(false);
      setDeleteEntryId(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Loading estate details...</p>
        </div>
      </Layout>
    );
  }

  if (!estate) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Estate not found</p>
          <Button onClick={handleGoBack} variant="outline" className="mt-4">
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const estateEntries = estate.entries || [];

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <Button onClick={handleGoBack} variant="ghost">
            ← Back to Estates
          </Button>
          <h1 className="text-3xl font-bold text-white mt-4">{estate.name}</h1>
          <p className="text-muted-foreground">{estate.description || "No description provided"}</p>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Estate Entries</h2>
            <Button onClick={handleAddEntry} className="apple-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </div>
          
          {estateEntries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No entries found for this estate.</p>
            </div>
          ) : (
            <DataTable
              data={estateEntries}
              columns={[
                { key: "clientName", header: "Client Name" },
                { key: "uniqueId", header: "Unique ID" },
                { key: "plotNumbers", header: "Plot Numbers" },
                { key: "amount", header: "Amount" },
                { key: "amountPaid", header: "Amount Paid" },
                { key: "paymentStatus", header: "Payment Status" },
                { key: "nextDueDate", header: "Next Due Date" },
              ]}
              actions={(entry) => (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Enhanced validation - check for valid UUID format
                      if (entry.clientId && typeof entry.clientId === 'string' && isValidUUID(entry.clientId)) {
                        handleCreateInvoice(entry.clientId, entry.clientName);
                      } else {
                        toast({
                          title: "Error",
                          description: `Invalid client ID format: ${entry.clientId}. Cannot create invoice.`,
                          variant: "destructive",
                        });
                      }
                    }}
                    className="apple-button-secondary"
                    title="Create Invoice"
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEntry(entry);
                    }}
                    variant="outline"
                    title="Edit Entry"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntry(entry.id);
                    }}
                    variant="destructive"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              onRowClick={(entry) => {
                // Fixed: Check if clientId exists and is valid before navigating
                if (entry.clientId && isValidUUID(entry.clientId)) {
                  navigate(`/clients/${entry.clientId}`);
                } else {
                  toast({
                    title: "Error",
                    description: "Invalid client ID for this entry",
                    variant: "destructive",
                  });
                }
              }}
            />
          )}
        </div>
      </div>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceDialogOpen} onOpenChange={setIsCreateInvoiceDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Create New Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice for client {selectedClientName}
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

      {/* Add/Edit Entry Dialog */}
      <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
        <DialogContent className="glass-card max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-gradient">{isEditing ? "Edit Estate Entry" : "Add New Estate Entry"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the details of this estate entry." : "Create a new entry for this estate."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <EstateForm
              entry={currentEntry}
              onSubmit={handleEntrySubmit}
              onCancel={() => setIsEntryDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Entry Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gradient">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEntry} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice Receipt Dialog */}
      {currentInvoice && (
        <InvoiceReceiptDialog
          isOpen={isReceiptDialogOpen}
          onClose={() => setIsReceiptDialogOpen(false)}
          invoice={currentInvoice}
          client={currentClient || undefined}
          estateName={estate.name}
          invoiceItems={invoiceItems}
        />
      )}
    </Layout>
  );
};

export default EstateDetailPage;
