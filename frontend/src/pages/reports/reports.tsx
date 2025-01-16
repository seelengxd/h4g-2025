"use client"
import { ColumnDef, SortingState, VisibilityState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { MiniOrderPublic } from "@/api"
import { Button } from "@/components/ui/button"
import { getOrders } from "@/features/orders/queries"
import { useCombinedStore } from "@/store/user/user-store-provider"
import { useQuery } from "@tanstack/react-query"


const Reports = () => {
  const { data: orders } = useQuery(getOrders());
  const { user } = useCombinedStore((store) => store);

  if (!orders || !user) {
    return null;
  }

  const isStaff = user?.role !== "resident";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<MiniOrderPublic>[] = [
    {
      accessorKey: "user_id",
      header: "User ID",
      cell: ({ row }) => <div className="capitalize">{row.getValue("user_id")}</div>,
    },
    {
      accessorKey: "points",
      header: () => <div className="text-right">Points</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue("points")}</div>
      ),
    },
    // {
    //   accessorKey: "order_products",
    //   header: "Products",
    //   cell: ({ row }) => {
    //     // Explicitly type the value as an array of products
    //     const products = row.getValue("order_products") as Array<{ id: string; name: string }>;
    
    //     return (
    //       <ul>
    //         {products?.map((product) => (
    //           <li key={product.id}>{product.name}</li>
    //         ))}
    //       </ul>
    //     );
    //   },
    // },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => <div className="capitalize">{row.getValue("state")}</div>,
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });
    
  return (
    <div>
      <h1>{isStaff ? "Manage Reports" : "Reports"}</h1>
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} rows selected.
          </div>
          <div className="space-x-2">
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
        </div>
      </div>
    </div>
  );  
};
    
export default Reports;