import React from 'react';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectedIds: (string | number)[];
  onToggleSelectVtc: (id: string | number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  getRowId: (row: T) => string | number;
  actionsHeader?:  string ;                        // Nom d’entête (ex: "Actions")
  renderActions?: (row: T) => React.ReactNode;   // Rendu d’actions par ligne
}

function GenericTable<T>({ columns, data, selectedIds, onToggleSelectVtc, onToggleSelectAll, getRowId, actionsHeader ='Actions' ,
  renderActions }: GenericTableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}

              {renderActions && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map(row => {
              const id = getRowId(row);
              return (
                <tr key={id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(id)}
                      onChange={() => onToggleSelectVtc(id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                      {col.render(row)}
                    </td>
                  ))}

                  {renderActions && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {renderActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GenericTable;
