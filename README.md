# NaviCare AI - Claude 3 + OpenAI RAG Chat SDK

Welcome to your reusable **Claude 3 + OpenAI + Supabase RAG Chat SDK**!

This SDK allows you to instantly add a **floating AI chat bubble** powered by **RAG retrieval** to any Next.js app.

---

## Features

- Floating chat widget (Intercom-style)
- Claude 3 LLM answering (Anthropic API)
- OpenAI Embeddings for vector search
- Supabase pgvector vectorstore backend
- Message history saving (Supabase messages table)
- Modular, scalable, HIPAA-compliant structure

---

## Folder Structure

```bash
/
├── /src
│   ├── /components
│   │   ├── Chat.js              # Chat input/output UI
│   │   ├── FloatingChat.js      # Floating button + modal
│   │   ├── MessageBubble.js     # Message UI component
│   ├── /lib
│   │   ├── supabaseClient.js    # Supabase client setup
│   │   ├── embeddings.js        # Generate OpenAI embeddings
│   │   ├── rag.js              # Perform retrieval + RAG prompt building
│   │   ├── anthropicClient.js   # Anthropic Claude 3 client setup
├── /examples
│   └── demo.js                  # Example usage
```

---

## Installation

### Option 1: Install from NPM
```bash
npm install @mt-davis/rag-chat-sdk
```

### Option 2: Install from GitHub
If you want to use the package directly from GitHub:
```bash
npm install git+https://github.com/mt-davis/rag-chat-sdk.git
```

## Setup Instructions

### 1. Install Required Packages

```bash
npm install @supabase/supabase-js openai @anthropic-ai/sdk framer-motion
```

If using Tailwind CSS for styling:
```bash
npm install tailwindcss
```

---

### 2. Configure Environment Variables

Create a `.env.local` file in your project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

---

### 3. Create Supabase Tables

Run these SQL scripts:

#### Documents Table (for RAG)
```sql
create extension if not exists vector;

create table documents (
  id uuid primary key default uuid_generate_v4(),
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

**Built with ❤️ by NaviCare AI**

# 🚀 You're Ready to Deploy!

With this SDK you can:
- Drop the chat into **ANY SaaS project**
- Launch MVPs, pilot programs, support bots easily
- Expand to mobile apps (Next.js + Expo!)

Let's GO! 🚀