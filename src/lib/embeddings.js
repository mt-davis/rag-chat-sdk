import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export async function embedText(text) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data.data[0].embedding;
}
