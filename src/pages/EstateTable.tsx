import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { getAllEstates, createEstate } from "@/services/estateData";
import { Download, FileUp, Plus, Table as TableIcon, Calendar, Users, Sparkles, Search, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newEstate, setNewEstate] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [creatingEstate, setCreatingEstate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  useEffect(() => {
    const fetchEstates = async () => {
      setLoading(true);
      try {
        const data = await getAllEstates();
        setEstates(data);
      } catch (error: any) {
        console.error("Error fetching estates:", error);
        toast({
          title: "Error",
          description: "Failed to load estates: " + (error.message || "Unknown error"),
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchEstates();
    }
  }, [toast, user]);
  
  const handleExport = () => {
    toast({
      title: "Export functionality",
      description: "Export functionality will be implemented in the next version."
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
  
  const handleCreateEstate = async () => {
    if (!newEstate.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Estate name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create estates",
        variant: "destructive"
      });
      return;
    }
    
    setCreatingEstate(true);
    
    try {
      const newEstateObj = await createEstate({
        name: newEstate.name,
        description: newEstate.description
      });
      
      setEstates(prev => [newEstateObj, ...prev]);
      setNewEstate({
        name: '',
        description: ''
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Estate Created",
        description: `Estate "${newEstate.name}" has been created successfully.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create estate: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setCreatingEstate(false);
    }
  };

  // Filter estates based on search query
  const filteredEstates = estates.filter(estate =>
    estate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (estate.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Estate Management</h1>
          <p className="text-slate-200">Manage your estate spreadsheets</p>
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

      <div className="flex items-center mb-4 gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search estates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-input"
          />
        </div>
        <Button variant="outline" onClick={() => setSearchQuery("")} size="icon" className="glass-input">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading estate tables...</p>
        </div>
      ) : !user ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Please log in to view and manage estates.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-10 rounded-none">
          {filteredEstates.length > 0 ? (
            filteredEstates.map(estate => (
              <Card 
                key={estate.id} 
                onClick={() => handleEstateClick(estate)} 
                className="glass-card-ultra-light card-hover hover:border-estate-primary/50 transition-all duration-300 overflow-hidden py-[10px] border border-white shadow-[0_0_8px_rgba(255,255,255,0.6)] cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TableIcon className="mr-2 h-5 w-5" />
                    {estate.name}
                  </CardTitle>
                  <CardDescription className="text-slate-100">
                    {estate.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center text-slate-100">
                        <Calendar className="mr-2 h-4 w-4 opacity-70" />
                        Created:
                      </span>
                      <span className="text-slate-100">{new Date(estate.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#000a0e]/0">
                      <span className="flex items-center text-slate-100">
                        <Users className="mr-2 h-4 w-4 opacity-70" />
                        Entries:
                      </span>
                      <span className="font-normal text-slate-100">{estate.entries.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/5 rounded-b-lg">
                  <p className="text-sm w-full flex items-center justify-center text-gray-950">
                    <Sparkles className="h-3 w-3 mr-1 text-estate-primary/70" />
                    Click to view estate table
                  </p>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 col-span-full glass p-8 rounded-lg border border-white">
              <p className="text-muted-foreground">
                {searchQuery ? "No estates matching your search were found." : "No estate tables found. Add an estate to get started."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Estate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card-ultra-light border-estate-primary/20 max-w-md">
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
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)} 
              className="apple-button-secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEstate} 
              className="apple-button"
              disabled={creatingEstate}
            >
              {creatingEstate ? "Creating..." : "Create Estate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="glass-card-ultra-light border-estate-primary/20 max-w-md">
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
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)} 
              className="apple-button-secondary"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateTable;
