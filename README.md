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
/sdk
  ├── /components
  │     ├── Chat.js              # Chat input/output UI
  │     ├── FloatingChat.js      # Floating button + modal
  │     ├── MessageBubble.js     # (Optional) Message UI unit
  ├── /lib
  │     ├── supabaseClient.js    # Supabase client setup
  │     ├── embeddings.js        # Generate OpenAI embeddings
  │     ├── rag.js               # Perform retrieval + RAG prompt building
  │     ├── anthropicClient.js   # Anthropic Claude 3 client setup
  ├── /pages
  │     ├── /api
  │           ├── chat.js        # API route: chat logic (retrieve + answer)
  ├── /scripts
  │     ├── embedDocuments.js    # Upload and embed documents
```

---

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

### 2. Create a `.env.local` file

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
CLAUDE_API_KEY=your-anthropic-api-key
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

### 4. Embed Documents into Supabase

Run:
```bash
node sdk/scripts/embedDocuments.js
```
*This uploads and embeds your documents for retrieval.*

---

### 5. Import Floating Chat into Your Pages

In your `pages/_app.js` or `pages/index.js`:

```jsx
import FloatingChat from '../sdk/components/FloatingChat';

export default function Home() {
  return (
    <>
      {/* Your page content */}
      <FloatingChat />
    </>
  );
}
```

---

### 6. Ready to Chat!

✅ Users can click the floating button.  
✅ Ask any question.  
✅ Claude 3 answers with real RAG knowledge.  
✅ Messages saved to Supabase for tracking!

---

## Optional Enhancements

- Enable Claude Streaming for typewriter-like responses.
- Add a "conversation history" side panel.
- Integrate Stripe to monetize chat access.
- Admin dashboard to review conversations.

---

# 🚀 You're Ready to Deploy!

With this SDK you can:
- Drop the chat into **ANY SaaS project**
- Launch MVPs, pilot programs, support bots easily
- Expand to mobile apps (Next.js + Expo!)

---

**Built for NaviCare AI by your future self.**  
**Control your AI. Own your SaaS.**

Let's GO! 🚀