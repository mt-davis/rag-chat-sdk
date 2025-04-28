import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Modal component provides a way to display content in a layer that sits above the rest of the page content.
 * Used for the chat popout feature to show an expanded version of the chat interface.
 * Includes animations, backdrop blur, and responsive sizing options.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls whether the modal is displayed
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {React.ReactNode} props.children - Content to display inside the modal
 * @param {string} props.title - Title text shown in the modal header
 * @param {('sm'|'md'|'lg'|'xl'|'full')} [props.size='md'] - Controls the width of the modal
 * @returns {JSX.Element|null} The modal component or null if not open
 */
export function Modal({ isOpen, onClose, children, title, size = 'md' }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling of background content when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
            className={cn(
              'relative z-50 flex flex-col w-full rounded-xl shadow-2xl',
              'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md',
              'border border-gray-200/20 dark:border-gray-700/20',
              sizeClasses[size],
              'h-[80vh]'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal body */}
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}