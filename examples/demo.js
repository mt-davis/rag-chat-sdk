import { FloatingChat, supabase, anthropic, embedText, retrieveContext } from '@mt-davis/rag-chat-sdk';

export default function Demo() {
  return (
    <div>
      <h1 className="text-3xl font-bold p-8">RAG Chat SDK Demo</h1>
      <FloatingChat />
    </div>
  );
}