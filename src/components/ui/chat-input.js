import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * ChatInput component provides a styled input field with a send button
 * for users to type and submit messages in the chat interface.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.value - The current value of the input field
 * @param {Function} props.onChange - Function called when input value changes
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @returns {JSX.Element} A styled input field with a send button
 */
export function ChatInput({ value, onChange, disabled }) {
  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type your message..."
        className={cn(
          'flex h-12 w-full rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-2 text-sm',
          'border border-gray-200/20 dark:border-gray-700/20',
          'text-gray-800 dark:text-gray-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'shadow-[0_2px_20px_-12px_rgba(0,0,0,0.1)]',
          'transition-all duration-200'
        )}
        disabled={disabled}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-9 w-9">
        <motion.button
          type="submit"
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'inset-0 flex h-full w-full items-center justify-center rounded-full',
            'bg-gradient-to-br from-primary-500 to-primary-600',
            'text-white shadow-lg',
            'transition-all duration-200',
            'hover:shadow-[0_5px_30px_-12px_rgba(0,0,0,0.3)]',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
