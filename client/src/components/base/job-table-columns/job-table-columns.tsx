"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Job } from "@/app/types/job";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    onRowClick: (row: TData) => void;
  }
}

export const jobTableColumns: ColumnDef<Job>[] = [
  {
    accessorKey: "id",
    header: "Job ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "resolved" ? "outline" : "default"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => {
      const result = row.getValue("result") as string | null;
      if (result) {
        return (
          <a
            href={result}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:underline"
          >
            View Image <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        );
      }
      return row.getValue("status") === "failed" ? "Failed" : "Pending";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleString();
    },
  },
  {
    accessorKey: "resolvedAt",
    header: "Resolved At",
    cell: ({ row }) => {
      const resolvedAt = row.getValue("resolvedAt") as string | null;
      return resolvedAt ? new Date(resolvedAt).toLocaleString() : "Pending";
    },
  },
  {
    id: "timeTaken",
    header: "Time Taken",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const resolvedAt = row.getValue("resolvedAt") as string | null;
      if (resolvedAt) {
        const timeDiff = new Date(resolvedAt).getTime() - createdAt.getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ${seconds % 60}s`;
      }
      return "In Progress";
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => table.options.meta?.onRowClick(job)}
            >
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
