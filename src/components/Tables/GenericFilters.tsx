import React from 'react';
import { Search } from 'lucide-react';

interface FilterSelect {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

interface GenericFiltersProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  selects?: FilterSelect[];
  extraButton?: React.ReactNode;
}

const GenericFilters: React.FC<GenericFiltersProps> = ({ searchValue, onSearchChange, selects = [], extraButton }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${1 + selects.length + (extraButton ? 1 : 0)}, minmax(0, 1fr))` }}>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {selects.map((sel, idx) => (
          <select
            key={idx}
            value={sel.value}
            onChange={sel.onChange}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sel.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ))}
        
        {extraButton}
      </div>
    </div>
  );
};

export default GenericFilters;