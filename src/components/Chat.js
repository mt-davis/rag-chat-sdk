import { useState, useEffect, useRef } from 'react';
import { Paperclip, Mic, Maximize2 } from 'lucide-react';
import { ChatBubble } from './ui/chat-bubble';
import { ChatInput } from './ui/chat-input';
import { MessageLoading } from './ui/message-loading';
import { Modal } from './ui/modal';
import { X, Bot, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

/**
 * @typedef {Object} Message
 * @property {'user'|'assistant'} role - The role of the message sender
 * @property {string} content - The text content of the message
 */
// Re-define the components that were removed from expandable-chat.js

const positions = {
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
};

const sizes = {
  sm: 'w-[300px]',
  md: 'w-[350px]',
  lg: 'w-[400px]',
};

/**
 * ExpandableChat component serves as the container for the chat interface
 * in its floating state. It handles positioning and animations.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {'bottom-right'|'bottom-left'|'top-right'|'top-left'} [props.position='bottom-right'] - Position on the screen
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size of the chat container
 * @returns {JSX.Element} A positioned and animated chat container
 */
function ExpandableChat({ 
  children, 
  position = 'bottom-right',
  size = 'md',
}) {
  return (
    <div className={cn('fixed z-50', positions[position])}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 500 }}
          className={cn(
            sizes[size],
            'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
            'rounded-2xl overflow-hidden border border-gray-200/20',
            'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)]',
            'flex flex-col'
          )}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * ExpandableChatBody provides the scrollable content area for the chat messages.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} A styled container for chat messages
 */
function ExpandableChatBody({ children, className }) {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)}>
      {children}
    </div>
  );
}

/**
 * ExpandableChatFooter provides the container for the chat input area.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} A styled container for the chat input
 */
function ExpandableChatFooter({ children }) {
  return (
    <div className="border-t border-gray-200/20">
      {children}
    </div>
  );
}

/**
 * ExpandableChatHeader provides the header section of the chat interface with controls.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when the close button is clicked
 * @param {Function} props.onMinimize - Function to call when the minimize button is clicked
 * @param {Function} [props.onPopout] - Optional function to call when the popout button is clicked
 * @returns {JSX.Element} A styled header with controls
 */
function ExpandableChatHeader({ onClose, onMinimize, onPopout }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200/20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Chat Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onPopout && (
            <button
              onClick={onPopout}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Expand to full view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onMinimize}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Chat component that provides the complete chat interface with AI integration.
 * Includes message handling, demo mode, modal popout, and UI rendering.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when the chat is closed
 * @returns {JSX.Element} The complete chat interface
 */
export default function Chat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Show initial welcome message when component mounts
  useEffect(() => {
    setTimeout(() => {
      setMessages([{ 
        role: 'assistant', 
        content: 'Hello! I\'m your AI assistant. How can I help you today?' 
      }]);
    }, 500);
  }, []);

  // Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Function to handle message submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Demo mode: generate a response after a delay
    setTimeout(() => {
      let responseMessage = 'This is a demo response. Please add your ANTHROPIC_API_KEY to .env.local to use the real API.';
      
      // Generate different responses based on user input for demo purposes
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        responseMessage = 'Hello there! How can I help you today?';
      } else if (userMessage.toLowerCase().includes('help')) {
        responseMessage = 'I\'m here to help! What would you like to know?';
      } else if (userMessage.toLowerCase().includes('thank')) {
        responseMessage = 'You\'re welcome! Is there anything else you need?';
      } else if (userMessage.toLowerCase().includes('how') && userMessage.toLowerCase().includes('you')) {
        responseMessage = 'I\'m just a demo AI, but I\'m working great! Thanks for asking.';
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseMessage 
      }]);
      
      setLoading(false);
    }, 1500);
  }

  // Toggle modal
  const handlePopout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Renders the chat message list and input field for reuse in both
   * the standard chat view and the popout modal view.
   * 
   * @returns {JSX.Element} Rendered chat content
   */
  const renderChatContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>Start a conversation</p>
          </div>
        )}
        {messages.map((message, i) => (
          <ChatBubble
            key={i}
            message={message.content}
            isAI={message.role === 'assistant'}
          />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <MessageLoading />
            <span>AI is typing</span>
          </div>
        )}
        <div ref={messagesEndRef} className="h-0" />
      </div>
      <div className="border-t border-gray-200/20">
        <form onSubmit={handleSubmit} className="p-4">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
        </form>
      </div>
    </>
  );

  if (isMinimized) {
    return null; // Or render a minimized version
  }

  return (
    <>
      <ExpandableChat size="lg">
        <ExpandableChatHeader 
          onClose={onClose}
          onMinimize={() => setIsMinimized(true)}
          onPopout={handlePopout}
        />
        <ExpandableChatBody className="p-4 space-y-4 min-h-[300px] max-h-[500px]">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-400">
              <p>Start a conversation</p>
            </div>
          )}
          {messages.map((message, i) => (
            <ChatBubble
              key={i}
              message={message.content}
              isAI={message.role === 'assistant'}
            />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <MessageLoading />
              <span>AI is typing</span>
            </div>
          )}
          <div ref={messagesEndRef} className="h-0" />
        </ExpandableChatBody>
        <ExpandableChatFooter>
          <form onSubmit={handleSubmit} className="p-4">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>

      {/* Modal for expanded chat view */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chat Assistant"
        size="lg"
      >
        <div className="flex flex-col h-full">
          {renderChatContent()}
        </div>
      </Modal>
    </>
  );
}