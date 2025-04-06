
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUp, ArrowDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  renderCell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data based on sort configuration
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    
    if (valueA === valueB) return 0;
    
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    
    // Handle numerical comparison if both values are numbers
    if (!isNaN(valueA) && !isNaN(valueB)) {
      return direction * (Number(valueA) - Number(valueB));
    }
    
    // Default string comparison
    return direction * (String(valueA).localeCompare(String(valueB)));
  });

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? 
      <ArrowUp className="h-3 w-3 ml-1" /> : 
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "on hold":
        return "bg-amber-100 text-amber-800";
      case "lead":
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-estate-muted h-4 w-4" />
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-estate-border"
        />
      </div>
      
      <div className="rounded-md border border-estate-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  <Button 
                    variant="ghost" 
                    className="h-8 px-2 -ml-2 font-semibold flex items-center"
                    onClick={() => requestSort(column.key)}
                  >
                    {column.header}
                    {getSortIcon(column.key)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={onRowClick ? "cursor-pointer transition-colors hover:bg-slate-50" : ""}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell 
                      key={`${rowIndex}-${column.key}`}
                      className={
                        column.key === "status" && typeof item[column.key] === "string" 
                          ? "py-2"
                          : ""
                      }
                    >
                      {column.key === "status" && typeof item[column.key] === "string" ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item[column.key])}`}>
                          {column.renderCell ? column.renderCell(item) : item[column.key]}
                        </span>
                      ) : (
                        column.renderCell ? column.renderCell(item) : item[column.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-estate-muted py-8">
                  {searchTerm ? "No results found" : "No data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-estate-muted">
        Showing {filteredData.length} of {data.length} items
      </div>
    </div>
  );
}

export default DataTable;
