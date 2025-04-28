import { useState, useEffect, useRef } from 'react';
import { Paperclip, Mic, Maximize2, MessageSquare } from 'lucide-react';
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
 * @property {string} [id] - Unique ID for the message
 * @property {boolean} [isWelcomeMessage] - Whether this is the welcome message
 */

const positions = {
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
};

const sizes = {
  sm: 'w-[320px]',
  md: 'w-[380px]',
  lg: 'w-[440px]',
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
          style={{
            maxHeight: 'min(600px, 80vh)'
          }}
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
    <div className={cn('flex-1 overflow-y-auto max-h-[500px]', className)}>
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
function ExpandableChatHeader({ onClose, onMinimize, onPopout, onNewSession }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200/20">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary-500" />
        <span className="font-medium">Chat Assistant</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMinimize}
          className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
        
        {onPopout && (
          <button
            onClick={onPopout}
            className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            aria-label="Popout"
          >
            <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
        
        {onNewSession && (
          <button
            onClick={onNewSession}
            className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            aria-label="New Session"
            title="Start a new chat session"
          >
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
        
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}

/**
 * Main Chat component that provides the complete chat interface with AI integration.
 * Features include:
 * - Floating chat with expandable modal view
 * - Auto-scrolling to latest messages
 * - Auto-focusing input after sending/receiving messages
 * - Welcome message
 * - Loading indicators
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when the chat is closed
 * @returns {JSX.Element} The complete chat interface
 */
function Chat({ onClose }) {
  const [messages, setMessages] = useState(() => {
    // Try to load messages from localStorage
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        try {
          return JSON.parse(savedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }
    }
    
    // Default welcome message if no saved messages
    return [{
      role: 'assistant',
      content: 'Hello! 👋 How can I help you today?',
      id: 'welcome-message',
      isWelcomeMessage: true
    }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const modalMessagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const modalChatContainerRef = useRef(null);

  /**
   * Scrolls the chat container to the bottom
   * @param {boolean} [isModal=false] - Whether to scroll the modal view (true) or floating chat (false)
   */
  const scrollToBottom = (isModal = false) => {
    const containerRef = isModal ? modalChatContainerRef.current : chatContainerRef.current;
    const endRef = isModal ? modalMessagesEndRef.current : messagesEndRef.current;

    if (containerRef && endRef) {
      const scrollOptions = { behavior: 'smooth' };
      endRef.scrollIntoView(scrollOptions);
    }
  };

  useEffect(() => {
    scrollToBottom();
    scrollToBottom(true);
    
    // Save messages to localStorage whenever they change
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Also scroll when loading state changes (for typing indicator)
  useEffect(() => {
    scrollToBottom();
    scrollToBottom(true);
    
    // When loading finishes (AI response received), focus the input
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  /**
   * Handles form submission when user sends a message
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      id: `user-${Date.now()}`,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Focus the input after sending the message
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setLoading(true);
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage = {
        role: 'assistant',
        content: 'This is a demo response. Connect to an AI service to get real responses.',
        id: (Date.now() + 1).toString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      // Ensure we scroll after the message is added
      setTimeout(() => {
        scrollToBottom();
        scrollToBottom(true);
      }, 100);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
      // Focus input after AI response
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  /**
   * Opens the modal view of the chat
   */
  const handlePopout = () => {
    setIsModalOpen(true);
    // Schedule scroll to bottom after modal opens
    setTimeout(() => scrollToBottom(true), 100);
  };

  /**
   * Closes the modal view of the chat
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Clears the chat history and starts a new session
   */
  const startNewSession = () => {
    // Clear messages except welcome message
    setMessages([{
      role: 'assistant',
      content: 'Hello! 👋 How can I help you today?',
      id: 'welcome-message-' + Date.now(),
      isWelcomeMessage: true
    }]);
  };

  // Effect to scroll modal to bottom when it opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        scrollToBottom(true);
        // Focus input when modal opens
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isModalOpen]);

  /**
   * Renders the chat content including messages, typing indicator, and input
   * @returns {JSX.Element} The chat content
   */
  const renderChatContent = () => (
    <>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">

        
        {messages.map((message, i) => (
          <div key={message.id || i}>
            <ChatBubble
              id={message.id}
              message={message.content}
              isAI={message.role === 'assistant'}
              isWelcomeMessage={message.isWelcomeMessage}
            />
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <MessageLoading />
            <span>AI is typing</span>
          </div>
        )}
        <div ref={messagesEndRef} className="h-px w-full" />
      </div>
      
      <div className="border-t border-gray-200/20">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative w-full">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              ref={inputRef}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </>
  );

  if (isMinimized) {
    return null;
  }

  return (
    <>
      <ExpandableChat size="lg">
        <ExpandableChatHeader 
          onClose={onClose}
          onMinimize={() => setIsMinimized(true)}
          onPopout={handlePopout}
          onNewSession={startNewSession}
        />
        <ExpandableChatBody>
          {renderChatContent()}
        </ExpandableChatBody>
      </ExpandableChat>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Chat Assistant" size="lg" onNewSession={startNewSession}>
        <div 
          className="flex flex-col h-full w-full overflow-hidden"
          style={{
            maxHeight: messages.length >= 4 ? '600px' : 'auto'
          }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            <div ref={modalChatContainerRef} className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
              {messages.map((message, i) => (
                <ChatBubble
                  key={message.id || i}
                  message={message.content}
                  id={message.id}
                  isAI={message.role === 'assistant'}
                  isWelcomeMessage={message.isWelcomeMessage}
                />
              ))}
              {loading && (
                <div className="flex items-center space-x-2">
                  <MessageLoading />
                  <span>AI is typing</span>
                </div>
              )}
              <div ref={modalMessagesEndRef} className="h-px w-full" />
            </div>
            <div className="border-t border-gray-200/20">
              <form onSubmit={handleSubmit} className="p-4">
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  ref={inputRef}
                  disabled={loading}
                />
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { Chat };
