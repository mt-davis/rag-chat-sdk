import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 500 }}
      className="flex justify-start"
    >
      <div 
        className={cn(
          'bg-white/80 dark:bg-gray-800/80 rounded-2xl px-5 py-4 flex items-center space-x-2',
          'backdrop-blur-sm border border-gray-200/20',
          'shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)]',
          'transition-all duration-200'
        )}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            backgroundColor: ['#38bdf8', '#0ea5e9', '#38bdf8']
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-2 h-2 rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            backgroundColor: ['#38bdf8', '#0ea5e9', '#38bdf8']
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: 0.2,
            ease: 'easeInOut'
          }}
          className="w-2 h-2 rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            backgroundColor: ['#38bdf8', '#0ea5e9', '#38bdf8']
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: 0.4,
            ease: 'easeInOut'
          }}
          className="w-2 h-2 rounded-full"
        />
      </div>
    </motion.div>
  );
}
