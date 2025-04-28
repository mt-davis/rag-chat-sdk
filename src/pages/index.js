// /src/index.js

// Components
export { default as Chat } from './components/Chat';
export { default as FloatingChat } from './components/FloatingChat';
export { default as MessageBubble } from './components/MessageBubble';

// Libraries
export { supabase } from './lib/supabaseClient';
export { anthropic } from './lib/anthropicClient';
export { embedText } from './lib/embeddings';
export { retrieveContext } from './lib/rag';
import FloatingChat from '@/sdk/components/FloatingChat'; // if using local
// OR if installed from NPM:
// import { FloatingChat } from '@mt-davis/rag-chat-sdk';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold p-8">Welcome to NaviCare!</h1>

      {/* Your normal website content here */}

      {/* Floating Chatbot */}
      <FloatingChat />
    </div>
  );
}
