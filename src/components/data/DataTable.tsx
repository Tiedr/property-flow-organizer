
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  header: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  renderCell?: (row: T, column: Column) => React.ReactNode;
  tableClassName?: string;
}

const DataTable = <T,>({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data available",
  renderCell,
  tableClassName,
}: DataTableProps<T>) => {
  return (
    <div className="overflow-auto">
      <Table className={cn("min-w-full", tableClassName)}>
        <TableHeader className="bg-slate-900/40">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-white">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-white">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row: any, index) => (
              <TableRow 
                key={index}
                className={cn(
                  "hover:bg-white/10 transition-colors",
                  onRowClick ? "cursor-pointer" : ""
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <TableCell key={`${index}-${column.key}`} className="text-white">
                    {renderCell ? renderCell(row, column) || row[column.key] : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
