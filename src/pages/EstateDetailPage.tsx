import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate, EstateEntry } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { 
  getEstateById, 
  updateEstate, 
  deleteEstate, 
  createEstateEntry, 
  updateEstateEntry, 
  deleteEstateEntry 
} from "@/services/estateData";
import { ArrowLeft, Edit, Trash, Plus, FilePlus, Upload, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import EstateForm from "@/components/forms/EstateForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ImportEstateData from "@/components/data/ImportEstateData";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

const EstateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estate, setEstate] = useState<Estate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<EstateEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedEstate, setEditedEstate] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: ""
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchEstate = async () => {
      try {
        setLoading(true);
        if (!id) {
          toast({
            title: "Error",
            description: "Estate ID is missing",
            variant: "destructive"
          });
          return;
        }
        
        const foundEstate = await getEstateById(id);
        
        if (foundEstate) {
          setEstate(foundEstate);
          setEditedEstate({
            name: foundEstate.name,
            description: foundEstate.description || ""
          });
        } else {
          toast({
            title: "Estate not found",
            description: "Could not find the requested estate",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error("Error fetching estate:", error);
        toast({
          title: "Error",
          description: "Failed to load estate details: " + (error.message || "Unknown error"),
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstate();
  }, [id, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditEstate = () => {
    // Remove isAdmin check to allow all authenticated users to edit estates
    setIsEditDialogOpen(true);
  };

  const handleDeleteEstate = () => {
    // Remove isAdmin check to allow all authenticated users to delete estates
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await deleteEstate(id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Estate Deleted",
        description: `Estate "${estate?.name}" has been deleted successfully.`
      });
      
      // Go back to the estates list
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete estate: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleAddEntry = () => {
    // Remove isAdmin check to allow all authenticated users to add entries
    setSelectedEntry(null);
    setIsAddEntryDialogOpen(true);
  };

  const handleEditEntry = (entry: EstateEntry) => {
    // Remove isAdmin check to allow all authenticated users to edit entries
    setSelectedEntry(entry);
    setIsAddEntryDialogOpen(true);
  };

  const handleEntrySubmit = async (entryData: Omit<EstateEntry, "id">) => {
    if (!estate || !id) return;
    
    try {
      if (selectedEntry) {
        // Edit existing entry
        const updatedEntry = await updateEstateEntry(id, selectedEntry.id, entryData);
        
        // Update the local state
        if (updatedEntry && estate) {
          const updatedEntries = estate.entries.map(entry => 
            entry.id === selectedEntry.id ? updatedEntry : entry
          );
          
          setEstate({
            ...estate,
            entries: updatedEntries,
          });
          
          toast({
            title: "Entry Updated",
            description: `Entry ${entryData.uniqueId} has been updated successfully.`
          });
        }
      } else {
        // Add new entry
        const newEntry = await createEstateEntry(id, entryData);
        
        if (newEntry && estate) {
          setEstate({
            ...estate,
            entries: [...estate.entries, newEntry]
          });
          
          toast({
            title: "Entry Added",
            description: `Entry ${newEntry.uniqueId} has been added to ${estate.name}.`
          });
        }
      }
      
      setIsAddEntryDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save entry: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleImportEntries = (entries: Omit<EstateEntry, "id">[]) => {
    // This would be implemented with batch operations in a real app
    toast({
      title: "Import functionality",
      description: "Bulk import will be implemented in the next version."
    });
    setIsImportDialogOpen(false);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!estate || !id) return;
    
    try {
      const entryToDelete = estate.entries.find(entry => entry.id === entryId);
      if (!entryToDelete) return;
      
      const success = await deleteEstateEntry(id, entryId);
      
      if (success) {
        const updatedEntries = estate.entries.filter(entry => entry.id !== entryId);
        setEstate({
          ...estate,
          entries: updatedEntries
        });
        
        toast({
          title: "Entry Deleted",
          description: `Entry ${entryToDelete.uniqueId} has been deleted from ${estate.name}.`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  };

  const handleEditEstateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedEstate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEstate = async () => {
    if (!estate || !id) return;
    
    if (!editedEstate.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Estate name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedData = {
        name: editedEstate.name,
        description: editedEstate.description
      };
      
      const updatedEstate = await updateEstate(id, updatedData);
      
      if (updatedEstate) {
        setEstate(updatedEstate);
        setIsEditDialogOpen(false);
        
        toast({
          title: "Estate Updated",
          description: `Estate details have been updated successfully.`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update estate: " + (error.message || "Unknown error"),
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
            <h1 className="text-3xl font-bold text-white">{estate?.name}</h1>
            <p className="text-muted-foreground">
              Created: {estate && new Date(estate.createdAt).toLocaleDateString()} | 
              Last Updated: {estate && new Date(estate.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)} variant="outline" className="glass-input hover:bg-white/10">
            <Upload className="mr-2 h-4 w-4" />
            Import Entries
          </Button>
          <Button onClick={handleEditEstate} className="apple-button-secondary">
            <Edit className="mr-2 h-4 w-4" />
            Edit Estate
          </Button>
          <Button onClick={handleDeleteEstate} variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete Estate
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground">{estate.description || "No description provided."}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Estate Entries ({estate.entries.length})</h2>
        <Button onClick={handleAddEntry} className="apple-button">
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="glass-card overflow-hidden mb-8">
        {estate.entries && estate.entries.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/40">
                <TableRow>
                  <TableHead>Unique ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Plot Numbers</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estate.entries.map(entry => (
                  <TableRow key={entry.id} className="border-b border-white/5">
                    <TableCell>{entry.uniqueId}</TableCell>
                    <TableCell>{entry.clientName}</TableCell>
                    <TableCell>{entry.plotNumbers.join(", ")}</TableCell>
                    <TableCell>₦{entry.amount.toLocaleString()}</TableCell>
                    <TableCell>₦{entry.amountPaid.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.paymentStatus === "Paid" ? "bg-green-500/20 text-green-300" : 
                        entry.paymentStatus === "Partial" ? "bg-amber-500/20 text-amber-300" : 
                        entry.paymentStatus === "Overdue" ? "bg-red-500/20 text-red-300" : 
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {entry.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell>{entry.nextDueDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-white/10" 
                          onClick={e => {
                            e.stopPropagation();
                            handleEditEntry(entry);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10" 
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FilePlus className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No entries found. Add an entry to get started.</p>
            <Button className="mt-4 apple-button" onClick={handleAddEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Entry
            </Button>
          </div>
        )}
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Import Estate Entries</DialogTitle>
            <DialogDescription>
              Import entries from Excel or XML files.
            </DialogDescription>
          </DialogHeader>
          <ImportEstateData onImport={handleImportEntries} />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)} 
              className="apple-button-secondary"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
        <DialogContent className="glass-card max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-gradient">
              {selectedEntry ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
            <DialogDescription>
              {selectedEntry 
                ? "Edit the entry information below." 
                : "Fill out the form below to add a new entry to your estate records."}
            </DialogDescription>
          </DialogHeader>
          <EstateForm 
            entry={selectedEntry} 
            onSubmit={handleEntrySubmit} 
            onCancel={() => setIsAddEntryDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Estate Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="text-gradient">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the estate "{estate.name}"? This will delete all entries in this estate. This action cannot be undone.
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

      {/* Edit Estate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Edit Estate</DialogTitle>
            <DialogDescription>
              Update your estate details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Estate Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={editedEstate.name} 
                onChange={handleEditEstateChange} 
                className="glass-input" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={editedEstate.description} 
                onChange={handleEditEstateChange} 
                className="glass-input" 
                placeholder="Enter estate description (optional)" 
                rows={4} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)} 
              className="apple-button-secondary"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              onClick={handleSaveEstate} 
              className="apple-button"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateDetailPage;
