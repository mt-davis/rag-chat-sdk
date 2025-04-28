import { FloatingChat } from '../index';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          RAG Chat SDK Demo
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          This is a demo of the floating chat widget. Click the chat bubble in the bottom right to start.
        </p>
        
        {/* The FloatingChat component will appear in the bottom right corner */}
        <FloatingChat 
          theme="light"
          position="bottom-right"
          initialMessage="Hi! How can I help you today?"
        />
      </div>
    </div>
  );
}
