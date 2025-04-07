import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FilePlus2 } from "lucide-react";
import { EstateEntry } from "@/types";
import * as XLSX from "xlsx";

interface ImportEstateDataProps {
  onImport: (data: Omit<EstateEntry, "id">[]) => void;
}

const ImportEstateData = ({ onImport }: ImportEstateDataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseExcel = (buffer: ArrayBuffer) => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Map Excel data to EstateEntry structure
    return data.map((row: any) => {
      return {
        clientName: row["Client Name"] || "",
        uniqueId: row["Unique ID"] || `EST-${Math.floor(Math.random() * 10000)}`,
        representative: row["Representative"] || "",
        plotNumbers: row["Plot Numbers"] ? String(row["Plot Numbers"]).split(",").map(p => p.trim()) : [],
        amount: Number(row["Amount"] || 0),
        amountPaid: Number(row["Amount Paid"] || 0),
        documentsReceived: row["Documents Received"] ? String(row["Documents Received"]).split(",").map(d => d.trim()) : [],
        phoneNumber: row["Phone Number"] || "",
        email: row["Email"] || "",
        address: row["Address"] || "",
        paymentStatus: (row["Payment Status"] as "Paid" | "Partial" | "Pending" | "Overdue") || "Pending",
        nextDueDate: row["Next Due Date"] || new Date().toISOString().split('T')[0],
      };
    });
  };

  const parseXML = (text: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const estateNodes = xmlDoc.getElementsByTagName("EstateEntry");
      const entries: Omit<EstateEntry, "id">[] = [];

      for (let i = 0; i < estateNodes.length; i++) {
        const estate = estateNodes[i];
        const getNodeValue = (tagName: string) => {
          const node = estate.getElementsByTagName(tagName)[0];
          return node ? node.textContent || "" : "";
        };

        const plotNumbersStr = getNodeValue("PlotNumbers");
        const docsReceivedStr = getNodeValue("DocumentsReceived");
        
        entries.push({
          clientName: getNodeValue("ClientName"),
          uniqueId: getNodeValue("UniqueId") || `EST-${Math.floor(Math.random() * 10000)}`,
          representative: getNodeValue("Representative"),
          plotNumbers: plotNumbersStr ? plotNumbersStr.split(",").map(p => p.trim()) : [],
          amount: Number(getNodeValue("Amount")),
          amountPaid: Number(getNodeValue("AmountPaid")),
          documentsReceived: docsReceivedStr ? docsReceivedStr.split(",").map(d => d.trim()) : [],
          phoneNumber: getNodeValue("PhoneNumber"),
          email: getNodeValue("Email"),
          address: getNodeValue("Address"),
          paymentStatus: getNodeValue("PaymentStatus") as "Paid" | "Partial" | "Pending" | "Overdue" || "Pending",
          nextDueDate: getNodeValue("NextDueDate") || new Date().toISOString().split('T')[0],
        });
      }

      return entries;
    } catch (error) {
      console.error("XML parsing error:", error);
      throw new Error("Failed to parse XML file");
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    // Check file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        let data: Omit<EstateEntry, "id">[] = [];

        if (fileExt === 'xlsx' || fileExt === 'xls') {
          const buffer = event.target?.result as ArrayBuffer;
          data = parseExcel(buffer);
        } else if (fileExt === 'xml') {
          const text = event.target?.result as string;
          data = parseXML(text);
        } else {
          toast({
            title: "Invalid file format",
            description: "Please upload an Excel (.xlsx, .xls) or XML (.xml) file.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        if (data.length === 0) {
          toast({
            title: "No data found",
            description: "The file does not contain any valid estate records.",
            variant: "destructive"
          });
        } else {
          onImport(data);
          toast({
            title: "Import successful",
            description: `${data.length} estate records imported successfully.`
          });
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "There was an error processing your file.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    };

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "There was an error reading your file.",
        variant: "destructive"
      });
      setIsLoading(false);
    };

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button 
          variant="outline" 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import Excel
        </Button>
        <input 
          id="file-upload" 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
      </label>
      
      <label htmlFor="xml-upload" className="cursor-pointer">
        <Button 
          variant="outline" 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <FilePlus2 className="h-4 w-4" />
          Import XML
        </Button>
        <input 
          id="xml-upload" 
          type="file" 
          accept=".xml" 
          onChange={handleFileUpload}
          className="hidden" 
        />
      </label>
    </div>
  );
};

export default ImportEstateData;
