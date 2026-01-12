"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function GenericTable({ columns, data,showSorting=true,showPagination=true }) {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // enableMultiSort: true, // ✅ Shift + Click multi-column sorting
  });

  return (
    <div className="space-y-4">
      {/* 🔍 Search box (optional) */}
      {/* <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
      </div> */}

      {/* 🧭 Table */}
      <div className="overflow-auto overflow-y-hidden border rounded-lg max-h-[70vh] border-gray-300 dark:border-gray-700">
        <Table className="border border-gray-300 dark:border-gray-700">
          {/* ===================== TABLE HEADER ===================== */}
<TableHeader>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => {
        const column = header.column;
        const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
        const isRplColumn = column.id === "rpl" || column.id === "clinicName" || column.id === "parameters" || column.id === "treatmentName" || column.id === "patientName";

        return (
          <TableHead
            key={header.id}
            className={`${isRplColumn ? "text-left" : "text-right"} border border-gray-300 dark:border-gray-700 bg-[#0f7396]/10 dark:bg-[#0f7396]/20`}
          >
            {header.isPlaceholder ? null : column.getCanSort() && showSorting ? (
              <Button
                variant="ghost"
                className={`flex items-center gap-2 w-full ${
                  isRplColumn ? "justify-start text-left" : "justify-end text-right"
                }`}
                // ✅ Use the built-in handler (it reads e.shiftKey etc. internally)
                onClick={column.getToggleSortingHandler()}
              >
                {flexRender(column.columnDef.header, header.getContext())}

                {isSorted === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : isSorted === "desc" ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                )}

                {/* optional: show multi-sort order badge */}
                {column.getIsSorted() &&
                  table.getState().sorting.length > 1 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {table.getState().sorting.findIndex(s => s.id === column.id) + 1}
                    </span>
                  )}
              </Button>
            ) : (
              flexRender(column.columnDef.header, header.getContext())
            )}
          </TableHead>
        );
      })}
    </TableRow>
  ))}
</TableHeader>

<TableBody>
  {table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => {
          const isRplColumn = cell.column.id === "rpl" || cell.column.id === "clinicName" || cell.column.id === "parameters"  || cell.column.id === "treatmentName" || cell.column.id === "patientName";
          return (
            <TableCell
              key={cell.id}
              className={`${isRplColumn ? "text-left" : "text-right"} border border-gray-300 dark:border-gray-700`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>

      {/* ===================== PAGINATION ===================== */}
      {showPagination && <div className="flex justify-between items-center gap-2">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>}
    </div>
  );
}
