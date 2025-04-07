
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate, EstateEntry } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { getEstateById, updateEstate, deleteEstate } from "@/services/estateData";
import { ArrowLeft, Edit, Trash, Plus, FilePlus, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import EstateForm from "@/components/forms/EstateForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { v4 as uuidv4 } from "uuid";
import ImportEstateData from "@/components/data/ImportEstateData";

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

  useEffect(() => {
    const fetchEstate = () => {
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

        console.log("Looking for estate with ID:", id);
        const foundEstate = getEstateById(id);
        console.log("Found estate:", foundEstate);
        
        if (foundEstate) {
          setEstate(foundEstate);
        } else {
          toast({
            title: "Estate not found",
            description: "Could not find the requested estate",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching estate:", error);
        toast({
          title: "Error",
          description: "Failed to load estate details",
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
    // For now, we'll just show a toast as this functionality would edit the estate details
    toast({
      title: "Edit Estate",
      description: "Estate details editing will be implemented in the next version."
    });
  };

  const handleDeleteEstate = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (id) {
      deleteEstate(id);
    }
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Estate Deleted",
      description: `Estate "${estate?.name}" has been deleted successfully.`
    });
    
    // Go back to the estates list
    navigate("/");
  };

  const handleAddEntry = () => {
    setSelectedEntry(null);
    setIsAddEntryDialogOpen(true);
  };

  const handleEditEntry = (entry: EstateEntry) => {
    setSelectedEntry(entry);
    setIsAddEntryDialogOpen(true);
  };

  const handleEntrySubmit = (entryData: Omit<EstateEntry, "id">) => {
    if (!estate) return;

    let updatedEstate: Estate;

    if (selectedEntry) {
      // Edit existing entry
      const updatedEntries = estate.entries.map(entry => 
        entry.id === selectedEntry.id ? { ...entryData, id: entry.id } : entry
      );

      updatedEstate = {
        ...estate,
        entries: updatedEntries,
        updatedAt: new Date().toISOString()
      };

      toast({
        title: "Entry Updated",
        description: `Entry ${entryData.uniqueId} has been updated successfully.`
      });
    } else {
      // Add new entry
      const newEntry: EstateEntry = {
        id: uuidv4(),
        ...entryData
      };

      updatedEstate = {
        ...estate,
        entries: [...estate.entries, newEntry],
        updatedAt: new Date().toISOString()
      };

      toast({
        title: "Entry Added",
        description: `Entry ${newEntry.uniqueId} has been added to ${estate.name}.`
      });
    }

    setEstate(updatedEstate);
    updateEstate(updatedEstate);
    setIsAddEntryDialogOpen(false);
  };

  const handleImportEntries = (entries: Omit<EstateEntry, "id">[]) => {
    if (!estate) return;
    
    const newEntries = entries.map(entry => ({
      ...entry,
      id: uuidv4()
    }));
    
    setEstate({
      ...estate,
      entries: [...estate.entries, ...newEntries],
      updatedAt: new Date().toISOString()
    });
    
    setIsImportDialogOpen(false);
    
    toast({
      title: "Import Successful",
      description: `${newEntries.length} entries imported successfully.`
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!estate) return;

    const entryToDelete = estate.entries.find(entry => entry.id === entryId);
    if (!entryToDelete) return;

    const updatedEntries = estate.entries.filter(entry => entry.id !== entryId);
    
    const updatedEstate = {
      ...estate,
      entries: updatedEntries,
      updatedAt: new Date().toISOString()
    };

    setEstate(updatedEstate);
    updateEstate(updatedEstate);

    toast({
      title: "Entry Deleted",
      description: `Entry ${entryToDelete.uniqueId} has been deleted from ${estate.name}.`
    });
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
            <h1 className="text-3xl font-bold">{estate?.name}</h1>
            <p className="text-muted-foreground">
              Created: {estate && new Date(estate.createdAt).toLocaleDateString()} | 
              Last Updated: {estate && new Date(estate.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex mt-4 sm:mt-0 gap-2">
          <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Entries
          </Button>
          <Button onClick={handleEditEstate} variant="outline">
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
        <Button onClick={handleAddEntry}>
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        {estate.entries && estate.entries.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
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
                {estate.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.uniqueId}</TableCell>
                    <TableCell>{entry.clientName}</TableCell>
                    <TableCell>{entry.plotNumbers.join(", ")}</TableCell>
                    <TableCell>₹{entry.amount.toLocaleString()}</TableCell>
                    <TableCell>₹{entry.amountPaid.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                        entry.paymentStatus === "Partial" ? "bg-amber-100 text-amber-800" :
                        entry.paymentStatus === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
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
                          className="h-8 w-8 p-0" 
                          onClick={(e) => {
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
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                          onClick={(e) => {
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
            <Button variant="outline" className="mt-4" onClick={handleAddEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Entry
            </Button>
          </div>
        )}
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Estate Entries</DialogTitle>
            <DialogDescription>
              Import entries from Excel or XML files.
            </DialogDescription>
          </DialogHeader>
          <ImportEstateData onImport={handleImportEntries} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Entry Dialog */}
      <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedEntry ? "Edit Entry" : "Add New Entry"}</DialogTitle>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the estate "{estate.name}"? This will delete all entries in this estate. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateDetailPage;

