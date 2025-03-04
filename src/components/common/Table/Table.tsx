import React from 'react';
import './Table.css';

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
}: TableProps<T>) {
  const tableClassName = ['data-table', className].filter(Boolean).join(' ');

  return (
    <div className="table-container">
      {isLoading ? (
        <div className="table-loading">Loading...</div>
      ) : (
        <table className={tableClassName}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={column.className}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={keyExtractor(row)}>
                  {columns.map((column) => (
                    <td key={`${keyExtractor(row)}-${column.id}`} className={column.className}>
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;