
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { FileUp } from "lucide-react";

export interface ImportDataProps {
  type: "clients" | "estates" | "invoices";
  onImport: (data: any[]) => void;
  onCancel?: () => void; // Make this optional since it might not be used everywhere
}

const ImportData = ({ type, onImport, onCancel }: ImportDataProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      setImportedData(jsonData);
      
      toast({
        title: "Data Parsed",
        description: `${jsonData.length} records found in file. Review and click Import to continue.`,
      });
    } catch (error) {
      toast({
        title: "Error Processing File",
        description: "Could not read the spreadsheet file. Please check the format and try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!importedData.length) {
      toast({
        title: "No Data",
        description: "No data to import. Please select a valid spreadsheet file.",
        variant: "destructive",
      });
      return;
    }
    
    setImporting(true);
    
    try {
      await onImport(importedData);
      toast({
        title: "Import Successful",
        description: `${importedData.length} ${type} were imported successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: `Error importing ${type}: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="file" className="text-sm font-medium mb-2">
            Select Excel or CSV File
          </label>
          <Input
            id="file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="glass-input"
          />
        </div>
      </div>
      
      <div className="text-sm my-4">
        {file && (
          <p>
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        )}
        {importedData.length > 0 && (
          <p className="mt-2">
            Records found: <span className="font-medium">{importedData.length}</span>
          </p>
        )}
      </div>
      
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="apple-button-secondary"
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleImport}
          disabled={importing || !importedData.length}
          className="apple-button"
        >
          <FileUp className="mr-2 h-4 w-4" />
          {importing ? `Importing ${type}...` : `Import ${type}`}
        </Button>
      </div>
    </div>
  );
};

export default ImportData;
