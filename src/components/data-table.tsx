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
    <div className="rounded-[24px] border-2 border-[#412D15] bg-[#F8F5EF] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.04),6px_6px_0px_0px_#412D15] overflow-hidden transition-all duration-300">
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

                className="cursor-pointer transition-all duration-250 ease-in-out hover:bg-[#D8D1BE]/20 hover:-translate-y-0.5 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.04)] border-b border-[#412D15]/10 last:border-b-0"
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
            <TableRow className="border-0">
              <TableCell
                colSpan={columns.length}
                className="h-20 text-center text-[#6B5C4C] font-semibold"
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