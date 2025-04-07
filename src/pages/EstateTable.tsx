
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import DataTable from "@/components/data/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { generateMockEstateData } from "@/services/estateData";
import { Download, FileUp, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import EstateForm from "@/components/forms/EstateForm";
import ImportEstateData from "@/components/data/ImportEstateData";
import { v4 as uuidv4 } from "uuid";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Generate mock data
    setEstates(generateMockEstateData(15));
  }, []);

  const handleExport = () => {
    // This would typically export to CSV or Excel
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

  const handleEstateSubmit = (estateData: Omit<Estate, "id">) => {
    const newEstate: Estate = {
      id: uuidv4(),
      ...estateData
    };
    
    setEstates((prev) => [newEstate, ...prev]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Estate Added",
      description: `Estate ${newEstate.uniqueId} has been added successfully.`
    });
  };
  
  const handleImportSubmit = (estateData: Omit<Estate, "id">[]) => {
    const newEstates = estateData.map(estate => ({
      id: uuidv4(),
      ...estate
    }));
    
    setEstates((prev) => [...newEstates, ...prev]);
    setIsImportDialogOpen(false);
    
    toast({
      title: "Estates Imported",
      description: `${newEstates.length} estates have been imported successfully.`
    });
  };

  const handleEstateClick = (estate: Estate) => {
    navigate(`/estates/${estate.id}`);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Estate Management</h1>
          <p className="text-estate-muted">Manage your estate properties</p>
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
            Add Estate
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
                <CardTitle>Estate ID: {estate.uniqueId}</CardTitle>
                <CardDescription>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Client:</span>
                      <span className="text-sm">{estate.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Representative:</span>
                      <span className="text-sm">{estate.representative || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-sm">₹{estate.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`text-sm px-2 py-0.5 rounded-full text-xs font-medium ${
                        estate.paymentStatus === "Paid" ? "bg-green-100 text-green-800" :
                        estate.paymentStatus === "Partial" ? "bg-amber-100 text-amber-800" :
                        estate.paymentStatus === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {estate.paymentStatus}
                      </span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 col-span-full">
            <p className="text-muted-foreground">No estates found. Add an estate to get started.</p>
          </div>
        )}
      </div>

      {/* Add Estate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Estate</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new estate to your records.
            </DialogDescription>
          </DialogHeader>
          <EstateForm
            onSubmit={handleEstateSubmit}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Estate Data</DialogTitle>
            <DialogDescription>
              Import your estate data from Excel or XML files. The file should contain columns with headers matching the estate properties.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ImportEstateData onImport={handleImportSubmit} />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateTable;
