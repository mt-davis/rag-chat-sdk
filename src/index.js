// Components
export { default as Chat } from '@/components/Chat';
export { default as FloatingChat } from '@/components/FloatingChat';
export { default as MessageBubble } from '@/components/MessageBubble';

// Utilities
export { supabase } from '@/lib/supabaseClient';
export { anthropic } from '@/lib/anthropicClient';
export { embedText } from '@/lib/embeddings';
export { retrieveContext } from '@/lib/rag';