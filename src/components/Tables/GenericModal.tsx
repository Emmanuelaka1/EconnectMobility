import React from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalAction {
  label: string;
  onClick: () => void;
  color?: string; // classes Tailwind personnalisées
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: ModalAction[];
  size?: ModalSize;
}

const GenericModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  actions = [],
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {actions.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  action.color || "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${action.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericModal;