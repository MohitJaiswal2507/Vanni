"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

// Generic table props so this component can work with any type of data
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: DataTableProps<TData, TValue>) {

  // Creates the table instance and manages its state
  const table = useReactTable({
    data,
    columns,

    // Provides the basic row model required to display rows
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <Table>
        <TableBody>

          {/* Check if the table has any rows */}
          {table.getRowModel().rows?.length ? (

            // Render each row
            table.getRowModel().rows.map((row) => (
              <TableRow
                // Call the click handler if it is provided
                onClick={() => onRowClick?.(row.original)}

                key={row.id}

                // Adds selected state for styling
                data-state={row.getIsSelected() && "selected"}

                className="cursor-pointer"
              >

                {/* Render only the visible columns */}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-sm p-4">

                    {/* Safely renders custom cell content */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}

                  </TableCell>
                ))}
              </TableRow>
            ))

          ) : (

            // Show this message when there is no data
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-19 text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>

          )}
        </TableBody>
      </Table>
    </div>
  )
}