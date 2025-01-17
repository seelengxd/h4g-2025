"use client"
import { MiniOrderPublic, MiniProductPublic, ProductPublic } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { getOrders } from "@/features/orders/queries";
import { getProducts } from "@/features/products/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import * as React from "react";
import { useEffect, useState } from "react";

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


const Reports = () => {
  const { data: orders } = useQuery(getOrders());
  const { data: products } = useQuery(getProducts());

  const { user } = useCombinedStore((store) => store);

  if (!orders || !user) {
    return null;
  }

  const [toggle, setToggle] = useState("Go to Inventory Summary Report");
  const [dateRange, setDateRange] = useState({ start: format(new Date(new Date().setDate(new Date().getDate() - 7)), "yyyy-MM-dd"), end: format(new Date(), "yyyy-MM-dd"),});
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ claimed: 0, pending: 0, rejected: 0, approved: 0, totalPoints: 0 });
  const [productStats, setProductStats] = useState({ food: 0, nonfood: 0, special: 0, lowQuantity: 0 });
  const [filteredOrders, setFilteredOrders] = useState<MiniOrderPublic[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MiniProductPublic[]>([]);
  const [quantity, setQuantity] = useState(100)
  const [category, setCategory] = useState("");


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
    console.log("hi1");
    filterOrders();
  }, [orders, dateRange]);

  useEffect(() => {
    console.log("hi2");

    const claimed = orders.filter((order) => order.state === "claimed").length;
    const pending = orders.filter((order) => order.state === "pending").length;
    const rejected = orders.filter((order) => order.state === "rejected").length;
    const approved = orders.filter((order) => order.state === "approved").length;

    const totalPoints = orders.reduce((acc, order) => {
    const orderProducts = order.order_products;
        const orderTotalPoints = orderProducts.reduce((total, orderProduct) => {
          return total + orderProduct.qty * orderProduct.product.points;
        }, 0);
        return acc + orderTotalPoints;
      }, 0);

      setStats({ claimed, pending, rejected, approved, totalPoints });
  }, []);

  // -------------------------------- functions for inventory summary -------------------------------- //
  useEffect(() => {
    console.log("hi3");

    filterProducts();
  }, [products, category, quantity]);

  const filterProducts = () => {
    let filtered = products;
    if (!filtered) { return ""}
    
    if (category && category !== 'all') { filtered = filtered.filter(product => product.category === category);}
    if (quantity) { filtered = filtered.filter(product => product.total_qty <= quantity);}

    setFilteredProducts(filtered);

    setProductStats({
      food: filtered.filter(product => product.category === 'food').length,
      nonfood: filtered.filter(product => product.category === 'nonfood').length,
      special: filtered.filter(product => product.category === 'special').length,
      lowQuantity: filtered.filter(product => product.total_qty <= quantity).length
    });
  };

  const handleCategoryChange = ( category: string ) => {
    setCategory(category)
    filterProducts();
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) { return; }
    const numericValue = Math.max(value, 0);
    setQuantity(numericValue);
  };

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
           className="bg-blue-500 text-white hover:bg-blue-300"
           onClick={handleToggle}
         >
         {toggle}
        </Button>
      
        {toggle === "Go to Inventory Summary Report" ? (
            <RequestTable data={filteredOrders}/>
        ) : (
            <InventoryTable data={filteredProducts}/>
        )}
          
        {toggle === "Go to Inventory Summary Report" && (
        <div className="flex items-center gap-4 pt-4 pb-12 relative z-10">
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
        {toggle !== "Go to Inventory Summary Report" && (
        <div className="items-center gap-4 pt-4 pb-12">
          <div className="flex flex-col items-start">
            <label htmlFor="quantity" className="block text-sm font-small mb-1 pr-4 pt-1">Quantity ≤</label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full md:w-auto"
            />
          </div>
          
          <div className="flex flex-col items-start pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Category: {category || 'Select Category'}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border border-gray-300 rounded shadow-md">
                <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-700">Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCategoryChange('food')}>Food</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCategoryChange('nonfood')}>Non-Food</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCategoryChange('special')}>Special</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCategoryChange('all')}>All</DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {toggle === "Go to Inventory Summary Report" ? (
      <WeeklyRequestSummaryStats stats={stats} /> ) : ( <InventorySummaryStats stats={productStats} />)}
      </div>
    </div>
  );
};

export default Reports;


// ------------------------------------------------ helpers ------------------------------------------------//
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
          <p className="text-sm">Food Items</p>
          <p className="text-lg font-medium">{stats.food}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Non-Food Items</p>
          <p className="text-lg font-medium">{stats.nonfood}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">Special Items</p>
          <p className="text-lg font-medium">{stats.special}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-red-800">Low Quantity Items</p>
          <p className="text-lg font-medium text-red-800">{stats.lowQuantity}</p>
          <p className="text-sm text-red-600">Less than or equal 10 in stock!</p>
        </div>
      </div>
    </div>

  );
};