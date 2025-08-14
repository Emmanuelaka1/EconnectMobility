import React from 'react';

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  disabled?: boolean;
}

interface GenericHeaderProps {
  title: string;
  subtitle?: string;
  bulkActions?: ActionButton[];
  mainAction: ActionButton;
}

const GenericHeader: React.FC<GenericHeaderProps> = ({ title, subtitle, bulkActions = [], mainAction }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-3">
        {bulkActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${action.color || 'bg-gray-600 text-white hover:bg-gray-700'} disabled:bg-gray-300`}
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
        <button
          onClick={mainAction.onClick}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 ${mainAction.color || 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {mainAction.icon}
          <span>{mainAction.label}</span>
        </button>
      </div>
    </div>
  );
};

export default GenericHeader;