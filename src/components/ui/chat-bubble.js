import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * ChatBubble component renders an individual message in the chat interface
 * with different styling based on whether it's from the AI or the user.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - The text content of the message
 * @param {boolean} props.isAI - Whether the message is from the AI (true) or user (false)
 * @returns {JSX.Element} A styled chat bubble with appropriate animations
 */
export function ChatBubble({ message, isAI }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 500 }}
      className={cn(
        'flex w-full',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      <div
        className={cn(
          'flex max-w-[80%] items-start gap-3 rounded-2xl px-5 py-4 relative',
          isAI ? [
            'bg-white/80 dark:bg-gray-800/80',
            'backdrop-blur-sm border border-gray-200/20',
            'shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)]'
          ] : [
            'bg-primary-600/90 dark:bg-primary-500/90',
            'backdrop-blur-sm',
            'shadow-[0_2px_40px_-12px_rgba(0,0,0,0.2)]'
          ],
          'transition-all duration-200 ease-in-out'
        )}
      >
        {isAI && (
          <div className="flex-shrink-0 h-8 w-8 min-w-[32px] min-h-[32px] rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-medium ring-2 ring-white/80 shadow-lg">
            <span className="flex-shrink-0">AI</span>
          </div>
        )}
        <div 
          className={cn(
            'prose prose-sm max-w-none flex-grow',
            isAI ? 'text-gray-800 dark:text-gray-200' : 'text-white prose-invert',
            'transition-colors duration-200'
          )}
        >
          {message}
        </div>
      </div>
    </motion.div>
  );
}
