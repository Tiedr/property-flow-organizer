
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import DataTable from "@/components/data/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { generateMockEstateData } from "@/services/estateData";
import { Search, Download, Plus, FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import EstateForm from "@/components/forms/EstateForm";
import ImportEstateData from "@/components/data/ImportEstateData";
import { v4 as uuidv4 } from "uuid";

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { toast } = useToast();

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
  };
  
  const handleImportSubmit = (estateData: Omit<Estate, "id">[]) => {
    const newEstates = estateData.map(estate => ({
      id: uuidv4(),
      ...estate
    }));
    
    setEstates((prev) => [...newEstates, ...prev]);
    setIsImportDialogOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Estate Management</h1>
          <p className="text-estate-muted">Manage your estate clients and plots</p>
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

      <DataTable
        data={estates}
        columns={[
          { key: "uniqueId", header: "ID" },
          { key: "clientName", header: "Client Name" },
          { key: "representative", header: "Representative" },
          { 
            key: "plotNumbers", 
            header: "Plot Numbers",
            renderCell: (estate: Estate) => estate.plotNumbers.join(", ") 
          },
          { 
            key: "amount", 
            header: "Amount",
            renderCell: (estate: Estate) => `₹${estate.amount.toLocaleString()}` 
          },
          { 
            key: "amountPaid", 
            header: "Amount Paid",
            renderCell: (estate: Estate) => `₹${estate.amountPaid.toLocaleString()}` 
          },
          {
            key: "documentsReceived",
            header: "Documents Received",
            renderCell: (estate: Estate) => 
              estate.documentsReceived.length > 0 
                ? estate.documentsReceived.join(", ") 
                : "None"
          },
          { key: "phoneNumber", header: "Phone" },
          { key: "paymentStatus", header: "Status" },
          { key: "nextDueDate", header: "Next Due Date" },
        ]}
      />

      {/* Add Estate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Estate</DialogTitle>
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
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-muted-foreground">
              Import your estate data from Excel or XML files. The file should contain columns with headers matching the estate properties.
            </p>
            <ImportEstateData onImport={handleImportSubmit} />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EstateTable;
