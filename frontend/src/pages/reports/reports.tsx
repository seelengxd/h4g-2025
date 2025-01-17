import { MiniOrderPublic, MiniProductPublic } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrders } from "@/features/orders/queries";
import { getProducts } from "@/features/products/queries";
import { useCombinedStore } from "@/store/user/user-store-provider";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import * as React from "react";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Reports = () => {
  const { data: orders } = useQuery(getOrders());
  const { data: products } = useQuery(getProducts());

  const { user } = useCombinedStore((store) => store);

  const [toggle, setToggle] = useState("Go to Inventory Summary Report");
  const [dateRange, setDateRange] = useState({
    start: format(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      "yyyy-MM-dd"
    ),
    end: format(new Date(), "yyyy-MM-dd"),
  });
  const [stats, setStats] = useState({
    claimed: 0,
    pending: 0,
    rejected: 0,
    approved: 0,
    totalPoints: 0,
  });
  const [productStats, setProductStats] = useState({
    food: 0,
    nonfood: 0,
    special: 0,
    lowQuantity: 0,
  });
  const [filteredOrders, setFilteredOrders] = useState<MiniOrderPublic[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<MiniProductPublic[]>(
    []
  );
  const [quantity, setQuantity] = useState(100);
  const [category, setCategory] = useState("");

  // -------------------------------- functions for weekly request --------------------------------
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isValidFormat) {
      setDateRange((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filterOrders = () => {
    if (orders) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (startDate > endDate) {
        return;
      }

      const filtered = orders.filter((order) => {
        const createdAt = new Date(order.created_at);
        return createdAt >= startDate && createdAt <= endDate;
      });

      setFilteredOrders(filtered);

      const claimed = filteredOrders.filter(
        (order) => order.state === "claimed"
      ).length;
      const pending = filteredOrders.filter(
        (order) => order.state === "pending"
      ).length;
      const rejected = filteredOrders.filter(
        (order) => order.state === "rejected"
      ).length;
      const approved = filteredOrders.filter(
        (order) => order.state === "approved"
      ).length;

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

  useEffect(() => {
    if (!orders) {
      return;
    }

    const claimed = orders.filter((order) => order.state === "claimed").length;
    const pending = orders.filter((order) => order.state === "pending").length;
    const rejected = orders.filter(
      (order) => order.state === "rejected"
    ).length;
    const approved = orders.filter(
      (order) => order.state === "approved"
    ).length;

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
    filterProducts();
  }, [products, category, quantity]);

  const filterProducts = () => {
    let filtered = products;
    if (!filtered) {
      return "";
    }

    if (category && category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }
    if (quantity) {
      filtered = filtered.filter((product) => product.total_qty <= quantity);
    }

    setFilteredProducts(filtered);

    setProductStats({
      food: filtered.filter((product) => product.category === "food").length,
      nonfood: filtered.filter((product) => product.category === "nonfood")
        .length,
      special: filtered.filter((product) => product.category === "special")
        .length,
      lowQuantity: filtered.filter((product) => product.total_qty <= quantity)
        .length,
    });
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    filterProducts();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      return;
    }
    const numericValue = Math.max(value, 0);
    setQuantity(numericValue);
  };

  const handleToggle = () => {
    setToggle(
      toggle === "Go to Inventory Summary Report"
        ? "Go to Weekly Request Summary Report"
        : "Go to Inventory Summary Report"
    );
  };

  if (!orders || !user) {
    return null;
  }

  return (
    <div>
      <h1 className="pt-4 pb-8 text-3xl font-bold">Reports</h1>
      <div className="w-full">
        <div className="h-px bg-gray-300"></div> {/* grey line */}
      </div>
      <div className="flex flex-col items-start pt-8 pb-4 space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="text-white bg-blue-500 hover:bg-blue-300"
          onClick={handleToggle}
        >
          {toggle}
        </Button>

        {toggle === "Go to Inventory Summary Report" ? (
          <RequestTable data={filteredOrders} />
        ) : (
          <InventoryTable data={filteredProducts} />
        )}

        {toggle === "Go to Inventory Summary Report" && (
          <div className="relative z-10 flex items-center gap-4 pt-4 pb-12">
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
                className="px-2 py-1 text-sm border rounded"
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
                className="px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        )}
        {toggle !== "Go to Inventory Summary Report" && (
          <div className="items-center gap-4 pt-4 pb-12">
            <div className="flex flex-col items-start">
              <label
                htmlFor="quantity"
                className="block pt-1 pr-4 mb-1 text-sm font-small"
              >
                Quantity ≤
              </label>
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
                  <Button variant="outline">
                    Category: {category || "Select Category"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-300 rounded shadow-md">
                  <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-700">
                    Categories
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleCategoryChange("food")}
                  >
                    Food
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCategoryChange("nonfood")}
                  >
                    Non-Food
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleCategoryChange("special")}
                  >
                    Special
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCategoryChange("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {toggle === "Go to Inventory Summary Report" ? (
          <WeeklyRequestSummaryStats stats={stats} />
        ) : (
          <InventorySummaryStats stats={productStats} />
        )}
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
    },
  },
  {
    accessorKey: "order_products",
    header: "Items",
    cell: ({ row }) => {
      const orderProducts = row.original.order_products;
      const top3Items = orderProducts
        .slice(0, 3)
        .map((orderProduct) => orderProduct.product.name)
        .join(", ");
      return <div>{top3Items}</div>;
    },
  },
  {
    accessorKey: "order_products",
    header: "Total Points Spent",
    cell: ({ row }) => {
      const orderProducts = row.original.order_products;
      const totalPoints = orderProducts.reduce((total, orderProduct) => {
        return total + orderProduct.qty * orderProduct.product.points;
      }, 0);
      return <div className="font-medium text-left">{totalPoints}</div>;
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("state")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const dateStr = String(row.getValue("created_at"));
      const createdAt = new Date(dateStr); // Convert string to Date object
      return <div>{createdAt.toLocaleDateString()}</div>; // Display only the date part
    },
  },
];

const InventoryColumns: ColumnDef<MiniProductPublic>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
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

type RequestTableProps = {
  data: MiniOrderPublic[];
};

const RequestTable: React.FC<RequestTableProps> = ({ data }) => {
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
      <div className="border rounded-md">
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

type InventoryTableProps = {
  data: MiniProductPublic[];
};

const InventoryTable: React.FC<InventoryTableProps> = ({ data }) => {
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
      <div className="border rounded-md">
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

interface Stats {
  stats: {
    claimed: number;
    pending: number;
    rejected: number;
    approved: number;
    totalPoints: number;
  };
}
const WeeklyRequestSummaryStats = ({ stats }: Stats) => {
  return (
    <div className="w-full mt-6 summary-stats">
      <h2 className="mb-2 text-xl font-bold">Summary Statistics</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Entries Claimed</p>
          <p className="text-lg font-medium">{stats.claimed}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Entries Pending</p>
          <p className="text-lg font-medium">{stats.pending}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Entries Rejected</p>
          <p className="text-lg font-medium">{stats.rejected}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Entries Approved</p>
          <p className="text-lg font-medium">{stats.approved}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Total Points Spent</p>
          <p className="text-lg font-medium">{stats.totalPoints}</p>
        </div>
      </div>
    </div>
  );
};

// ------------------ inventory summary report ----------------------

interface InventorySummaryStats {
  stats: {
    food: number;
    nonfood: number;
    special: number;
    lowQuantity: number;
  };
}
const InventorySummaryStats = ({ stats }: InventorySummaryStats) => {
  return (
    <div className="w-full mt-6 summary-stats">
      <h2 className="mb-2 text-xl font-bold">Summary Statistics</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Food Items</p>
          <p className="text-lg font-medium">{stats.food}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Non-Food Items</p>
          <p className="text-lg font-medium">{stats.nonfood}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm">Special Items</p>
          <p className="text-lg font-medium">{stats.special}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <p className="text-sm text-red-800">Low Quantity Items</p>
          <p className="text-lg font-medium text-red-800">
            {stats.lowQuantity}
          </p>
          <p className="text-sm text-red-600">
            Less than or equal 10 in stock!
          </p>
        </div>
      </div>
    </div>
  );
};
