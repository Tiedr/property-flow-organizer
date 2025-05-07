
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Estate, EstateEntry } from "@/types";
import { getEstateById, updateEstate, deleteEstate, deleteEstateEntry } from "@/services/estateData";
import { createReceiptFromEstateEntry } from "@/services/invoiceData";
import DataTable from "@/components/data/DataTable";
import { Edit, FilePlus, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import EstateForm from "@/components/forms/EstateForm";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Receipt from "@/components/receipt/Receipt";

const EstateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estate, setEstate] = useState<Estate | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedEntryName, setSelectedEntryName] = useState<string>("");
  const [isCreateReceiptDialogOpen, setIsCreateReceiptDialogOpen] = useState(false);
  const [receiptAmount, setReceiptAmount] = useState<string>("");
  const [receiptNotes, setReceiptNotes] = useState<string>("");
  const [isEditEstateDialogOpen, setIsEditEstateDialogOpen] = useState(false);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [isEditEntryDialogOpen, setIsEditEntryDialogOpen] = useState(false);
  const [isDeleteEstateConfirmOpen, setIsDeleteEstateConfirmOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<EstateEntry | null>(null);
  const [editEstateName, setEditEstateName] = useState("");
  const [editEstateDescription, setEditEstateDescription] = useState("");
  const [newReceipt, setNewReceipt] = useState<any>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);

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
        if (estateData) {
          setEditEstateName(estateData.name);
          setEditEstateDescription(estateData.description || "");
        }
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

  const handleCreateReceipt = (entryId: string, entryName: string) => {
    const entry = estate?.entries.find(e => e.id === entryId);
    if (entry) {
      const remainingAmount = entry.amount - entry.amountPaid;
      setSelectedEntryId(entryId);
      setSelectedEntryName(entryName);
      setReceiptAmount(remainingAmount.toString());
      setIsCreateReceiptDialogOpen(true);
    }
  };

  const handleReceiptSubmit = async () => {
    if (!selectedEntryId || !id) return;
    
    try {
      const amount = parseFloat(receiptAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid amount greater than zero",
          variant: "destructive"
        });
        return;
      }
      
      const invoice = await createReceiptFromEstateEntry(
        id,
        selectedEntryId,
        amount,
        receiptNotes
      );
      
      setIsCreateReceiptDialogOpen(false);
      setReceiptAmount("");
      setReceiptNotes("");
      setNewReceipt(invoice);
      setIsReceiptDialogOpen(true);
      
      // Refresh estate data to show updated payment status
      const updatedEstate = await getEstateById(id);
      setEstate(updatedEstate);
      
      toast({
        title: "Receipt Created",
        description: `Receipt for ${amount.toLocaleString()} has been created for ${selectedEntryName}.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create receipt: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleEditEstate = async () => {
    if (!id) return;
    
    try {
      await updateEstate(id, {
        name: editEstateName,
        description: editEstateDescription
      });
      
      setEstate(prev => prev ? {
        ...prev,
        name: editEstateName,
        description: editEstateDescription
      } : undefined);
      
      setIsEditEstateDialogOpen(false);
      
      toast({
        title: "Estate Updated",
        description: "Estate details have been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update estate: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleDeleteEstate = async () => {
    if (!id) return;
    
    try {
      await deleteEstate(id);
      navigate("/estates");
      toast({
        title: "Estate Deleted",
        description: "Estate has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete estate: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleEditEntry = (entry: EstateEntry) => {
    setCurrentEntry(entry);
    setIsEditEntryDialogOpen(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!id) return;
    
    try {
      await deleteEstateEntry(id, entryId);
      
      // Update the local state to reflect the deletion
      setEstate(prev => {
        if (!prev) return undefined;
        return {
          ...prev,
          entries: prev.entries.filter(entry => entry.id !== entryId)
        };
      });
      
      toast({
        title: "Entry Deleted",
        description: "Entry has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleEntrySubmit = async (entryData: Omit<EstateEntry, "id">) => {
    if (!id) return;
    
    try {
      // Add the entry to the estate
      const updatedEstate = await getEstateById(id);
      setEstate(updatedEstate);
      
      setIsAddEntryDialogOpen(false);
      setIsEditEntryDialogOpen(false);
      
      toast({
        title: currentEntry ? "Entry Updated" : "Entry Added",
        description: `Entry has been ${currentEntry ? "updated" : "added"} successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${currentEntry ? "update" : "add"} entry: ` + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleAddEntry = () => {
    setCurrentEntry(null);
    setIsAddEntryDialogOpen(true);
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Button onClick={handleGoBack} variant="ghost">
              ← Back to Estates
            </Button>
            <h1 className="text-3xl font-bold text-white mt-4">{estate.name}</h1>
            <p className="text-muted-foreground">{estate.description || "No description provided"}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsEditEstateDialogOpen(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Estate
            </Button>
            <AlertDialog open={isDeleteEstateConfirmOpen} onOpenChange={setIsDeleteEstateConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Estate
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the estate and all its entries. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEstate} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Estate Entries</h2>
            <Button onClick={handleAddEntry} className="apple-button">
              <FilePlus className="mr-2 h-4 w-4" />
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
                      handleCreateReceipt(entry.id, entry.clientName);
                    }}
                    className="apple-button-secondary"
                  >
                    <Save className="mr-1 h-4 w-4" />
                    Receipt
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEntry(entry);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEntry(entry.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              onRowClick={(entry) => {
                // Fixed: Check if clientId exists and only navigate if it does
                if (entry.clientId) {
                  navigate(`/clients/${entry.clientId}`);
                } else {
                  toast({
                    title: "Error",
                    description: "Client ID not found for this entry",
                    variant: "destructive",
                  });
                }
              }}
            />
          )}
        </div>
      </div>
      
      {/* Create Receipt Dialog */}
      <Dialog open={isCreateReceiptDialogOpen} onOpenChange={setIsCreateReceiptDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Create New Receipt</DialogTitle>
            <DialogDescription>
              Create a receipt for payment from client {selectedEntryName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={receiptAmount}
                onChange={(e) => setReceiptAmount(e.target.value)}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this payment"
                value={receiptNotes}
                onChange={(e) => setReceiptNotes(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateReceiptDialogOpen(false)}
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReceiptSubmit}
              className="apple-button"
            >
              Create Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Estate Dialog */}
      <Dialog open={isEditEstateDialogOpen} onOpenChange={setIsEditEstateDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Edit Estate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Estate Name</Label>
              <Input
                id="editName"
                value={editEstateName}
                onChange={(e) => setEditEstateName(e.target.value)}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editEstateDescription}
                onChange={(e) => setEditEstateDescription(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditEstateDialogOpen(false)}
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditEstate}
              className="apple-button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={isAddEntryDialogOpen || isEditEntryDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddEntryDialogOpen(false);
          setIsEditEntryDialogOpen(false);
        }
      }}>
        <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gradient">
              {currentEntry ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
          </DialogHeader>
          <EstateForm 
            entry={currentEntry}
            onSubmit={handleEntrySubmit}
            onCancel={() => {
              setIsAddEntryDialogOpen(false);
              setIsEditEntryDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Show Receipt Dialog */}
      <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
        <DialogContent className="glass-card max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gradient">Payment Receipt</DialogTitle>
          </DialogHeader>
          {newReceipt && (
            <Receipt 
              invoice={newReceipt}
              onClose={() => setIsReceiptDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateDetailPage;
