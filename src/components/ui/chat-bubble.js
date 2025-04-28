import { motion } from 'framer-motion';
import { CornerDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ChatBubble component renders an individual message in the chat interface
 * with different styling based on whether it's from the AI or the user.
 * Supports threaded message display with visual styling changes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - The text content of the message
 * @param {string} [props.id] - The message ID
 * @param {boolean} props.isAI - Whether the message is from the AI (true) or user (false)
 * @param {boolean} [props.isThreaded=false] - Whether this message is part of a thread
 * @param {boolean} [props.isThreadParent=false] - Whether this message is the parent of a thread
 * @param {boolean} [props.isRepliedTo=false] - Whether this message is being replied to
 * @param {Function} [props.onReply] - Function to call when the reply button is clicked
 * @returns {JSX.Element} A styled chat bubble with appropriate animations
 */
export function ChatBubble({ 
  message, 
  id, 
  isAI, 
  isThreaded = false, 
  isThreadParent = false,
  isRepliedTo = false,
  onReply
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 500 }}
      className={cn(
        'flex w-full',
        isAI ? 'justify-start' : 'justify-end',
        isThreaded && 'ml-8 my-1',
        isThreadParent && 'mb-1'
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] items-start gap-3 rounded-2xl px-4 py-3 relative break-words',
          isAI ? [
            'bg-white/80 dark:bg-gray-800/80',
            'backdrop-blur-sm border border-gray-200/20',
            'shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)]'
          ] : [
            'bg-primary-600/90 dark:bg-primary-500/90',
            'backdrop-blur-sm',
            'shadow-[0_2px_40px_-12px_rgba(0,0,0,0.2)]'
          ],
          isThreaded && 'shadow-[0_2px_15px_-12px_rgba(0,0,0,0.1)]',
          isThreadParent && isAI && 'border-l-2 border-l-primary-300 dark:border-l-primary-700',
          'transition-all duration-200 ease-in-out'
        )}
      >
        {isAI && (
          <div className="flex-shrink-0 h-8 w-8 min-w-[32px] min-h-[32px] rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-medium ring-2 ring-white/80 shadow-lg">
            <span className="flex-shrink-0">AI</span>
          </div>
        )}
        <div className="flex flex-col w-full relative">
          {/* Thread indicator when message is part of a thread */}
          {isThreaded && (
            <div className="flex items-center gap-1 text-xs text-primary-500 dark:text-primary-400 mb-1">
              <CornerDownRight className="h-3 w-3" />
              <span>Thread</span>
            </div>
          )}
          <div 
            className={cn(
              'flex-1 text-sm break-words',
              isAI ? 'text-gray-800 dark:text-gray-100' : 'text-white',
              'transition-colors duration-200'
            )}
          >
            {message}
          </div>
          
          {/* Stand-alone Reply button that shows on hover */}
          {isAI && onReply && (
            <div 
              className="absolute -bottom-4 right-3 z-30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-full py-1 px-2.5',
                  'shadow-lg border border-gray-200/80 dark:border-gray-700/60',
                  'text-xs font-medium',
                  'text-gray-600 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400',
                  'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  'transition-colors duration-200',
                  'cursor-pointer',
                  isRepliedTo && 'bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Reply button clicked with id:', id);
                  if (onReply && id) {
                    onReply(id);
                  }
                }}
                type="button"
                aria-label="Reply to this message"
              >
                <CornerDownRight className="h-3 w-3" />
                <span>Reply</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
