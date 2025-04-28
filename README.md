# Next.js Chat SDK

A modern, customizable chat interface for Next.js applications featuring a sleek UI with glassmorphism effects, smooth animations, and responsive design. This SDK provides a floating chat widget that can be integrated into any Next.js application.

---

## Features

### UI/UX Features
- Floating chat widget with expandable modal view
- Modern UI with glassmorphism effects and backdrop blur
- Smooth animations powered by Framer Motion
- Responsive design with adjustable chat window sizes
- Auto-scrolling to latest messages
- Auto-focusing input field after sending/receiving messages
- Welcome message when chat opens
- Real-time typing indicator for AI responses
- Message persistence between sessions using localStorage
- New session button to start fresh conversations
- Light and dark mode support

### Chat Components
- Stylish chat bubbles with distinct styling for user and AI messages
- Proper word wrapping in messages
- Clean, modern input field with send button
- Comprehensive JSDoc documentation for all components

---

## Folder Structure

```bash
/
├── /src
│   ├── /components
│   │   ├── Chat.js              # Main chat component with message handling
│   │   ├── FloatingChat.js      # Floating button + expandable chat interface
│   │   ├── /ui                  # UI component directory
│   │   │   ├── chat-bubble.js   # Modern message bubble component
│   │   │   ├── chat-input.js    # Input field with send button
│   │   │   ├── message-loading.js # Loading animation for AI typing
│   │   │   ├── modal.js         # Popout modal component
│   │   │   ├── expandable-chat.js # Chat expansion components
│   ├── /lib
│   │   ├── utils.js            # Utility functions
│   │   ├── supabaseClient.js    # Supabase client (optional)
```

---

## Installation

```bash
npm install framer-motion lucide-react
```

## Setup Instructions

### 1. Add Required Dependencies

This SDK requires the following packages:
- `framer-motion` - For smooth animations
- `lucide-react` - For icons

### 2. Import and Use the Components

```jsx
import { FloatingChat } from './components/FloatingChat';

export default function YourApp() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Add the floating chat */}
      <FloatingChat 
        position="bottom-right" // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        size="md" // 'sm', 'md', 'lg'
      />
    </div>
  );
}
```

### 3. Connect to Your AI Service (Optional)

By default, the chat uses a demo mode that returns placeholder responses. To connect to your own AI service:

```jsx
// In Chat.js, modify the handleSubmit function to call your AI API
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
  setLoading(true);
  
  try {
    // Call your AI API here
    const response = await yourAIService.getResponse(input);
    
    const aiMessage = {
      role: 'assistant',
      content: response.text,
      id: `ai-${Date.now()}`,
    };
    
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Error getting AI response:', error);
  } finally {
    setLoading(false);
  }
};

```

## Customization

### Chat Sizes

The chat window comes in three sizes that you can customize:

```jsx
// In Chat.js
const sizes = {
  sm: 'w-[320px]',  // Small size
  md: 'w-[380px]',  // Medium size
  lg: 'w-[440px]',  // Large size
};
```

### Positioning

The floating chat can be positioned in any corner of the screen:

```jsx
// In Chat.js
const positions = {
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
};
```

### Styling

The chat uses a modern glassmorphism design with backdrop blur effects. You can customize the appearance by modifying the CSS classes in the respective components.

## Features in Detail

### Message Persistence

Messages are automatically saved to localStorage and restored when the chat is reopened. This allows conversations to persist even when the user closes the browser.

### New Session Button

A dedicated button allows users to start a new conversation while keeping the chat open. This clears the message history and displays a fresh welcome message.

### Auto-focusing

The input field is automatically focused after:
- Sending a message
- Receiving an AI response
- Opening the modal view

This creates a seamless experience where users can type continuously without clicking back into the input field.

### Responsive Design

The chat interface adapts to different screen sizes and can be expanded into a full modal view for better readability on mobile devices.

## License

MIT
  content text,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

alter table documents enable row level security;
create policy "Allow authenticated actions" on documents for all using (true);
```

#### Messages Table (for saving chat history)
```sql
create table messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid,
  role text,
  content text,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;
create policy "Allow authenticated insert" on messages for insert using (true);
```

#### RPC for Vector Matching
```sql
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table(
  id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
```

---

### 4. Usage

Basic usage in your Next.js app:

```jsx
import { FloatingChat } from '@mt-davis/rag-chat-sdk';

export default function App() {
  return (
    <>
      {/* Your page content */}
      <FloatingChat />
    </>
  );
}
```

Advanced usage with custom configuration:

```jsx
import { FloatingChat, supabase, anthropic } from '@mt-davis/rag-chat-sdk';

export default function App() {
  return (
    <FloatingChat 
      theme="light"
      position="bottom-right"
      initialMessage="How can I help you today?"
      supabaseClient={supabase}
      anthropicClient={anthropic}
    />
  );
}
```

## Examples

The `/examples` directory contains sample implementations:

### Basic Demo
`/examples/demo.js` - Shows basic integration of the FloatingChat component in a Next.js app.

To run the demo:
1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your API keys
4. Run `npm run dev`
5. Open `http://localhost:3000`

---

## Optional Enhancements

- Enable Claude streaming for typewriter-like responses
- Add conversation history panel
- Integrate with Stripe for monetization
- Add admin dashboard for conversation review

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Built with ❤️**

# 🚀 You're Ready to Deploy!

With this SDK you can:
- Drop the chat into **ANY SaaS project**
- Launch MVPs, pilot programs, support bots easily
- Expand to mobile apps (Next.js + Expo!)

Let's GO! 🚀