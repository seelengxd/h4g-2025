"use client"
import { ColumnDef, SortingState, VisibilityState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import * as React from "react";
import { useEffect, useState } from "react";

import { GetAllOrdersOrdersGetResponse, GetAllProductsProductsGetResponse, MiniOrderPublic, ProductPublic } from "@/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getOrders } from "@/features/orders/queries";
import { getProducts } from "@/features/products/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
 
import { format } from "date-fns";


const Reports = () => {
  const { data: orders } = useQuery(getOrders());
  const { data: products } = useQuery(getProducts());

  const { user } = useCombinedStore((store) => store);

  if (!orders || !user) {
    return null;
  }

  const isStaff = user?.role !== "resident";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [toggle, setToggle] = useState("Go to Inventory Summary Report");
  const [dateRange, setDateRange] = useState({ start: format(new Date(new Date().setDate(new Date().getDate() - 7)), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd"),});
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ claimed: 0, pending: 0, rejected: 0, approved: 0, totalPoints: 0 });
  type DataType = GetAllOrdersOrdersGetResponse | GetAllProductsProductsGetResponse;
  const [data, setData] = useState<DataType | undefined>(undefined);
  const [filteredOrders, setFilteredOrders] = useState<MiniOrderPublic[]>([]);


  // -------------------------------- functions for weekly request --------------------------------
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValidFormat) {
      setError("Invalid date format. Use YYYY-MM-DD.");
    } else {
      setError(null);
      setDateRange((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filterOrders = () => {
    if (orders) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (startDate > endDate) {
        setError("Start date must be before or equal to end date.");
        return;
      }

      const filtered = orders.filter((order) => {
        const createdAt = new Date(order.created_at);
        return createdAt >= startDate && createdAt <= endDate;
      });
  
      // This will set the state with the filtered orders
      setFilteredOrders(filtered);

      

      const claimed = filteredOrders.filter((order) => order.state === "claimed").length;
      const pending = filteredOrders.filter((order) => order.state === "pending").length;
      const rejected = filteredOrders.filter((order) => order.state === "rejected").length;
      const approved = filteredOrders.filter((order) => order.state === "approved").length;

      const totalPoints = filteredOrders.reduce((acc, order) => {
        const orderProducts = order.order_products;
        const orderTotalPoints = orderProducts.reduce((total, orderProduct) => {
          return total + orderProduct.qty * orderProduct.product.points;
        }, 0);
        return acc + orderTotalPoints;
      }, 0);

      setStats({ claimed, pending, rejected, approved, totalPoints });
    }
  };

  useEffect(() => {
    filterOrders();
  }, [orders, dateRange]);

  // -------------------------------- functions for inventory summary --------------------------------
  

  const handleToggle = () => {
    setToggle(toggle === "Go to Inventory Summary Report" 
      ? "Go to Weekly Request Summary Report" 
      : "Go to Inventory Summary Report");
  };
    
  return (
    <div>
      <h1 className="text-3xl font-bold pt-4 pb-8">Reports</h1>
      <div className="w-full">
        <div className="h-px bg-gray-300"></div> {/* grey line */}
      </div>
      <div className="flex flex-col items-start space-y-4 pt-8 pb-4">
        <Button
           variant="outline"
           size="sm"
           className="bg-blue-500 text-white hover:bg-blue-300 w-[250px]"
           onClick={handleToggle}
         >
         {toggle}
        </Button>
      
        {toggle === "Go to Inventory Summary Report" ? (
            <RequestTable data={filteredOrders}/>
        ) : (
            <InventoryTable data={products}/>
        )}
          
        {toggle === "Go to Inventory Summary Report" && (
        <div className="flex items-center gap-4 pt-4 pb-12">
          <div>
            <label htmlFor="start" className="block text-sm font-small">
              Start Date:
            </label>
            <input
              type="date"
              id="start"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-small">
              End Date:
            </label>
            <input
              type="date"
              id="end"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      )}
        {toggle === "Go to Inventory Summary Report" ? (
          <WeeklyRequestSummaryStats stats={stats} />
        ) : (
          <InventorySummaryStats stats={stats} />
        )}

      </div>
    </div>
  );
};

    
export default Reports;

const RequestColumns: ColumnDef<MiniOrderPublic>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return <div className="capitalize">{user.full_name}</div>;
    }
  },
  {
    accessorKey: "order_products",
    header: "Items",
    cell: ({ row }) => {
      const orderProducts = row.original.order_products;
      const top3Items = orderProducts
        .slice(0, 3)
        .map(orderProduct => orderProduct.product.name)
        .join(', ');
      return <div>{top3Items}</div>;
    },
  },
  {
    accessorKey: "order_products",
    header: "Total Points Spent",
    cell: ({ row }) => {
      const orderProducts = row.original.order_products;
      const totalPoints = orderProducts.reduce((total, orderProduct) => {
        return total + (orderProduct.qty * orderProduct.product.points);
      }, 0);
      return <div className="text-left font-medium">{totalPoints}</div>;
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => <div className="capitalize">{row.getValue("state")}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const dateStr = String(row.getValue("created_at"));
      const createdAt = new Date(dateStr);  // Convert string to Date object
      return <div>{createdAt.toLocaleDateString()}</div>;  // Display only the date part
    },
  },
];

const InventoryColumns: ColumnDef<ProductPublic>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => <div className="capitalize">{row.original.name}</div>
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.original.category}</div>,
  },
  {
    accessorKey: "total_qty",
    header: "Total Quantity",
    cell: ({ row }) => <div>{row.original.total_qty}</div>,
  },
];

const RequestTable = ({ data }) => {
  const table = useReactTable({
    data: data,
    columns: RequestColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {},
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="w-full h-[30vh]">
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
                  colSpan={RequestColumns.length}
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
          {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} rows shown.
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
  );
};


const InventoryTable = ({ data }) => {
  const table = useReactTable({
    data: data,
    columns: InventoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {},
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="w-full h-[30vh]">
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
                  colSpan={InventoryColumns.length}
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
          {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} rows shown.
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
  );
};


const WeeklyRequestSummaryStats = ({ stats }) => {
  return (
    <div className="summary-stats mt-6 w-full">
      <h2 className="text-xl font-bold mb-2">Summary Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Claimed</p>
          <p className="text-lg font-medium">{stats.claimed}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Pending</p>
          <p className="text-lg font-medium">{stats.pending}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Rejected</p>
          <p className="text-lg font-medium">{stats.rejected}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Approved</p>
          <p className="text-lg font-medium">{stats.approved}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Total Points Spent</p>
          <p className="text-lg font-medium">{stats.totalPoints}</p>
        </div>
      </div>
    </div>
  );
};

// ------------------ inventory summary report ----------------------

const InventorySummaryStats = ({ stats }) => {
  return (
    <div className="summary-stats mt-6 w-full">
      <h2 className="text-xl font-bold mb-2">Summary Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Claimed</p>
          <p className="text-lg font-medium">{stats.claimed}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Pending</p>
          <p className="text-lg font-medium">{stats.pending}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Rejected</p>
          <p className="text-lg font-medium">{stats.rejected}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Entries Approved</p>
          <p className="text-lg font-medium">{stats.approved}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Total Points Spent</p>
          <p className="text-lg font-medium">{stats.totalPoints}</p>
        </div>
      </div>
    </div>
  );
};