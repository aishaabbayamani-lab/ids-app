import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import Button from "./Button";
import EmptyState from "./EmptyState";

export default function Table({
  columns,
  data,
  pageSize = 10,
  emptyMessage = "No data yet.",
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-border text-text-muted whitespace-nowrap"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-2 pr-4 font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2.5 pr-4 text-text-primary">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-text-muted">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1"
            >
              <RiArrowLeftSLine size={16} />
            </Button>
            <Button
              variant="secondary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1"
            >
              <RiArrowRightSLine size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
