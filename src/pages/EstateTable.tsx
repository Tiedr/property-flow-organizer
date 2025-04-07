
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { generateEstateData, createEstate } from "@/services/estateData";
import { 
  Download, 
  FileUp, 
  Plus,
  Table as TableIcon,
  Calendar,
  Users,
  Sparkles
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

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newEstate, setNewEstate] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    try {
      const mockEstates = generateEstateData(5);
      console.log("Generated estate data:", mockEstates);
      setEstates(mockEstates);
    } catch (error) {
      console.error("Error generating estate data:", error);
      toast({
        title: "Error",
        description: "Failed to load estates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
    console.log("Navigating to estate:", estate);
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

    const newEstateObj = createEstate({
      name: newEstate.name,
      description: newEstate.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      entries: []
    });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Estate Management</h1>
          <p className="text-muted-foreground">Manage your estate spreadsheets</p>
        </div>
        <div className="flex flex-wrap mt-4 sm:mt-0 gap-3">
          <Button variant="outline" onClick={handleExport} className="glass-input hover:bg-white/10">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleImport} className="glass-input hover:bg-white/10">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleAddEstate} className="apple-button">
            <Plus className="mr-2 h-4 w-4" />
            Add Estate Table
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading estate tables...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10">
          {estates.length > 0 ? (
            estates.map((estate) => (
              <Card 
                key={estate.id} 
                className="glass-card card-hover hover:border-estate-primary/50 transition-all duration-300 overflow-hidden"
                onClick={() => handleEstateClick(estate)}
              >
                <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-estate-primary to-red-400"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-estate-primary">
                    <TableIcon className="mr-2 h-5 w-5" />
                    {estate.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {estate.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />
                        Created:
                      </span>
                      <span>{new Date(estate.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <Users className="mr-2 h-4 w-4 opacity-70" />
                        Entries:
                      </span>
                      <span>{estate.entries.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/5 rounded-b-lg">
                  <p className="text-sm text-muted-foreground w-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 mr-1 text-estate-primary/70" />
                    Click to view estate table
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 col-span-full glass p-8 rounded-lg">
              <p className="text-muted-foreground">No estate tables found. Add an estate to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Estate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card border-estate-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Create New Estate Table</DialogTitle>
            <DialogDescription className="text-muted-foreground">
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
                className="glass-input"
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
                className="glass-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="apple-button-secondary">Cancel</Button>
            <Button onClick={handleCreateEstate} className="apple-button">Create Estate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="glass-card border-estate-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gradient">Import Estate Data</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Import your estate data from Excel or XML files.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">Import functionality will be implemented in the next version.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} className="apple-button-secondary">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateTable;
