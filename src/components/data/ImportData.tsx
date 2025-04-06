
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface ImportDataProps {
  onImport: (data: any[]) => void;
  type: "clients" | "projects";
}

const ImportData = ({ onImport, type }: ImportDataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processCSV = (csv: string) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    
    const data = lines.slice(1).filter(line => line.trim() !== "").map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {} as Record<string, string>);
    });
    
    return data;
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    // Check if file is CSV or Excel
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // In a real app, we'd use a library like xlsx for Excel files
        // For now, we'll just handle CSV as proof of concept
        if (file.name.endsWith(".csv") && event.target?.result) {
          const csv = event.target.result as string;
          const data = processCSV(csv);
          onImport(data);
          toast({
            title: "Import successful",
            description: `${data.length} ${type} imported successfully.`
          });
        } else {
          toast({
            title: "Excel import",
            description: "Excel import functionality will be available in the next version.",
            variant: "default"
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

    reader.readAsText(file);
  };

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button 
          variant="outline" 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import {type === "clients" ? "Clients" : "Projects"}
        </Button>
        <input 
          id="file-upload" 
          type="file" 
          accept=".csv,.xlsx" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
      </label>
    </div>
  );
};

export default ImportData;
