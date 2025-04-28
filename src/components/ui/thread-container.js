import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ThreadContainer component that wraps related messages in a threaded conversation.
 * Provides visual connection between parent message and its replies.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (messages)
 * @param {boolean} [props.hasReplies=false] - Whether the thread has replies
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A container for threaded messages
 */
export function ThreadContainer({ children, hasReplies = false, className }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // If there are no replies, just render children without thread UI
  if (!hasReplies) {
    return <>{children}</>;
  }

  // Get first child (parent message) and rest (replies)
  const childrenArray = React.Children.toArray(children);
  const parentMessage = childrenArray[0];
  const replies = childrenArray.slice(1);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Parent message */}
      <div className="relative">
        {parentMessage}
        
        {/* Toggle button for replies */}
        {hasReplies && (
          <button
            onClick={toggleExpanded}
            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            aria-label={isExpanded ? 'Collapse thread' : 'Expand thread'}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Thread line */}
      {hasReplies && isExpanded && replies.length > 0 && (
        <div className="absolute left-4 top-[3.5rem] bottom-4 w-px bg-gradient-to-b from-primary-200 to-primary-300 dark:from-primary-800 dark:to-primary-700 opacity-50" />
      )}

      {/* Replies */}
      {hasReplies && (
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden pl-8 pt-2"
        >
          {replies}
        </motion.div>
      )}
    </div>
  );
}
