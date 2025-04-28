// /sdk/components/Chat.js

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate or retrieve session ID
  const sessionId = typeof window !== 'undefined' && (localStorage.getItem('chat_session_id') || (() => {
    const newId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', newId);
    return newId;
  })());

  async function saveMessage(role, content) {
    await supabase.from('messages').insert([
      { session_id: sessionId, role, content }
    ]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage('user', input);

    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();
    const botMessage = { role: 'assistant', content: data.answer };

    setMessages(prev => [...prev, botMessage]);
    await saveMessage('assistant', data.answer);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Claude is thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border p-2 rounded-l-md focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-r-md">Send</button>
      </form>
    </div>
  );
}
