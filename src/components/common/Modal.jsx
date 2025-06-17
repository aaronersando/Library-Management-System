import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title, zIndex = 50 }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4" 
      style={{ zIndex: zIndex }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-3 sm:px-4 py-1 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400 sm:hidden" />
            <X size={24} className="text-gray-400 hidden sm:block" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;