import OpenAI from 'openai';

const isDemoMode = !process.env.OPENAI_API_KEY;

const openai = isDemoMode ? {
  embeddings: {
    create: async () => ({
      data: [{
        embedding: new Array(1536).fill(0) // Mock embedding vector
      }]
    })
  }
} : new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function embedText(text) {
  if (isDemoMode) {
    console.log('Running in demo mode. Add OPENAI_API_KEY to .env.local for real embeddings.');
  }
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}
