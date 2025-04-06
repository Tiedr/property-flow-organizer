
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Estate } from "@/types";
import DataTable from "@/components/data/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { generateMockEstateData } from "@/services/estateData";
import { Search, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const EstateTable = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Generate mock data
    setEstates(generateMockEstateData(15));
  }, []);

  const handleExport = () => {
    toast({
      title: "Export functionality",
      description: "Export functionality will be implemented in the next version.",
    });
  };

  const handleAddEstate = () => {
    toast({
      title: "Add estate",
      description: "Add estate functionality will be implemented in the next version.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Estate Management</h1>
          <p className="text-estate-muted">Manage your estate clients and plots</p>
        </div>
        <div className="flex mt-4 sm:mt-0 space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
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
    </Layout>
  );
};

export default EstateTable;
