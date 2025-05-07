
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    renderCell?: (row: T) => React.ReactNode;
  }[];
  onRowClick?: (row: T) => void;
  renderCell?: (row: T, column: { key: string; header: string; renderCell?: (row: T) => React.ReactNode }) => React.ReactNode;
  emptyMessage?: string; // Add support for empty message
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  renderCell,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-white/80">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={onRowClick ? "cursor-pointer hover:bg-white/5" : ""}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <TableCell key={`${rowIndex}-${column.key}`}>
                  {column.renderCell ? (
                    column.renderCell(row)
                  ) : renderCell ? (
                    renderCell(row, column)
                  ) : (
                    <>{(row as any)[column.key]}</>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
