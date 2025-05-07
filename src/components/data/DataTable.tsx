
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
  actions?: (row: T) => React.ReactNode; // Add support for row actions
}

function DataTable<T>({
  data,
  columns,
  onRowClick,
  renderCell,
  emptyMessage = "No data available",
  actions
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
            {actions && <TableHead className="text-white/80">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={onRowClick ? "cursor-pointer hover:bg-white/5" : ""}
            >
              {columns.map((column) => (
                <TableCell 
                  key={`${rowIndex}-${column.key}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {column.renderCell ? (
                    column.renderCell(row)
                  ) : renderCell ? (
                    renderCell(row, column)
                  ) : (
                    <>{(row as any)[column.key]}</>
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
                  {actions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
