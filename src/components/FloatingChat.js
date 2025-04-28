import { useState, useRef, useEffect } from 'react';
import { Chat } from './Chat';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef();

  // Only close when clicking outside the chat and the toggle button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && 
          !chatRef.current.contains(event.target) && 
          !event.target.closest('button[data-chat-toggle]')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <motion.button
        data-chat-toggle="true"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <Chat onClose={handleCloseChat} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
