
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { 
  Download, 
  FileUp, 
  Plus,
  Table as TableIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEstateData } from "@/services/estateData";

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newEstate, setNewEstate] = useState({
    name: '',
    description: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate mock data using the updated structure
    const mockEstates = generateEstateData(5);
    setEstates(mockEstates);
  }, []);

  const handleExport = () => {
    toast({
      title: "Export functionality",
      description: "Export functionality will be implemented in the next version.",
    });
  };

  const handleAddEstate = () => {
    setIsAddDialogOpen(true);
  };

  const handleImport = () => {
    setIsImportDialogOpen(true);
  };

  const handleEstateClick = (estate: Estate) => {
    navigate(`/estates/${estate.id}`);
  };

  const handleNewEstateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEstate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEstate = () => {
    if (!newEstate.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Estate name is required",
        variant: "destructive"
      });
      return;
    }

    const newEstateObj: Estate = {
      id: uuidv4(),
      name: newEstate.name,
      description: newEstate.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entries: []
    };

    setEstates(prev => [newEstateObj, ...prev]);
    setNewEstate({ name: '', description: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Estate Created",
      description: `Estate "${newEstate.name}" has been created successfully.`
    });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Estate Management</h1>
          <p className="text-muted-foreground">Manage your estate spreadsheets</p>
        </div>
        <div className="flex flex-wrap mt-4 sm:mt-0 gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImport}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleAddEstate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Estate Table
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-10">
        {estates.length > 0 ? (
          estates.map((estate) => (
            <Card 
              key={estate.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEstateClick(estate)}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TableIcon className="mr-2 h-5 w-5" />
                  {estate.name}
                </CardTitle>
                <CardDescription>
                  {estate.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Created:</span>
                    <span>{new Date(estate.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entries:</span>
                    <span>{estate.entries.length}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 rounded-b-lg">
                <p className="text-sm text-muted-foreground w-full text-center">
                  Click to view estate table
                </p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 col-span-full">
            <p className="text-muted-foreground">No estate tables found. Add an estate to get started.</p>
          </div>
        )}
      </div>

      {/* Add Estate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Estate Table</DialogTitle>
            <DialogDescription>
              Create a new estate spreadsheet to track property records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Estate Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Enter estate name" 
                value={newEstate.name}
                onChange={handleNewEstateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Enter estate description (optional)"
                value={newEstate.description}
                onChange={handleNewEstateChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEstate}>Create Estate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Estate Data</DialogTitle>
            <DialogDescription>
              Import your estate data from Excel or XML files.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">Import functionality will be implemented in the next version.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateTable;
