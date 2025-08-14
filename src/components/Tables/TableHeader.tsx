import React from "react";

interface TableHeaderProps {
  headers: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => {
  return (
    <thead className="bg-gray-50">
      <tr>
        {headers.map((title, index) => (
          <th
            key={index}
            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {title}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;