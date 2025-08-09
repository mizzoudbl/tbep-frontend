import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface HeatmapTableProps<T extends object> {
  columns: ColumnDef<T, string | number | undefined>[];
  data: T[];
  colorScale?: (value: number | undefined, columnId: string) => string;
  sortingColumn: string;
  onSortChange: (column: string) => void;
  loading?: boolean;
}

export function HeatmapTable<T extends object>({
  columns,
  data,
  colorScale,
  sortingColumn,
  onSortChange,
  loading = false,
}: HeatmapTableProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(800); // Default fallback

  // Monitor container width changes
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const updateWidth = () => {
      setContainerWidth(container.offsetWidth);
    };
    // Set initial width
    updateWidth();
    // Create ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  // Responsive column width based on container size
  const minColWidth = 32;
  const maxColWidth = 80;
  const labelColWidth = Math.max(60, Math.min(120, containerWidth * 0.08)); // 8% of container width, with min/max
  const availableWidth = containerWidth - labelColWidth - 40; // Subtract label column and padding
  const colWidth = Math.floor(Math.max(minColWidth, Math.min(maxColWidth, availableWidth / (columns.length - 1))));

  return (
    <div ref={containerRef} className='w-full overflow-auto'>
      <Table className='min-w-full text-sm table-fixed'>
        <colgroup>
          <col style={{ width: labelColWidth }} />
          {table
            .getAllLeafColumns()
            .slice(1)
            .map((col, i) => (
              <col
                key={col.id}
                style={{ width: i === table.getAllLeafColumns().length - 2 ? colWidth + 45 : colWidth }}
              />
            ))}
        </colgroup>
        <TableHeader className='h-32 sticky top-0 z-10 bg-white'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className='hover:bg-transparent'>
              {headerGroup.headers.map((header, j) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'px-1 py-2 border-b font-semibold text-left align-bottom cursor-pointer text-xs md:text-sm',
                    header.column.getCanSort() && 'hover:font-extrabold',
                    loading && 'pointer-events-none opacity-50',
                  )}
                  style={
                    j === 0
                      ? { width: labelColWidth, minWidth: labelColWidth, maxWidth: labelColWidth }
                      : { width: colWidth, minWidth: minColWidth, maxWidth: maxColWidth }
                  }
                  // Default to 'Association Score' if no sorting column is set
                  onClick={() =>
                    !loading &&
                    header.column.getCanSort() &&
                    onSortChange?.(header.column.id !== sortingColumn ? header.column.id : 'Association Score')
                  }
                >
                  <div
                    style={
                      j === 0
                        ? {}
                        : {
                            transform: 'rotate(-45deg)',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            width: colWidth,
                            lineHeight: 2,
                          }
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.id === sortingColumn ? (
                      <span className='ml-1 flex items-center'>
                        <ChevronDownIcon size={14} />
                      </span>
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 10 }).map((_, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: for skeleton rows
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {Array.from({ length: columns.length }).map((_, colIndex) => (
                  <TableCell
                    // biome-ignore lint/suspicious/noArrayIndexKey: for skeleton cells
                    key={`skeleton-cell-${rowIndex}-${colIndex}`}
                    className='px-1 py-2'
                    style={
                      colIndex === 0
                        ? { width: labelColWidth, minWidth: labelColWidth, maxWidth: labelColWidth }
                        : { width: colWidth, minWidth: minColWidth, maxWidth: maxColWidth, textAlign: 'center' }
                    }
                  >
                    {colIndex === 0 ? (
                      <Skeleton className='h-4 w-16' />
                    ) : colIndex === 1 ? (
                      // Association score column gets a square skeleton
                      <div className='flex justify-center items-center h-8'>
                        <Skeleton className='w-6 h-6 rounded-md' />
                      </div>
                    ) : (
                      // Other columns get circular skeletons
                      <div className='flex justify-center items-center h-8'>
                        <Skeleton className='w-6 h-6 rounded-full' />
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // No data state
            <TableRow>
              <TableCell colSpan={columns.length} className='text-center py-8 text-muted-foreground'>
                No data available
              </TableCell>
            </TableRow>
          ) : (
            // Actual data
            table
              .getRowModel()
              .rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, j) => {
                    if (j === 0) {
                      return (
                        <TableCell
                          key={cell.id}
                          className='px-1 py-2'
                          style={{
                            width: labelColWidth,
                            minWidth: labelColWidth,
                            maxWidth: labelColWidth,
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    }
                    const value = cell.getValue() as number | undefined;
                    return (
                      <TableCell
                        key={cell.id}
                        className='px-1 py-2'
                        style={{ width: colWidth, minWidth: minColWidth, maxWidth: maxColWidth, textAlign: 'center' }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex justify-start items-center h-8'>
                              <span
                                className={cn(
                                  'inline-block w-6 h-6 border border-gray-400',
                                  cell.column.id === 'Association Score' ? 'rounded-md' : 'rounded-full',
                                )}
                                style={{ background: colorScale?.(value, cell.column.id) ?? '#e3f0fa' }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{typeof value === 'number' ? value.toFixed(2) : 'No data'}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
