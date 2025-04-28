import { supabase } from './supabaseClient';
import { embedText } from './embeddings';

export async function retrieveContext(question) {
  const queryEmbedding = await embedText(question);

  const { data: documents, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.78,
    match_count: 5,
  });

  if (error) {
    console.error('Error retrieving documents:', error);
    return '';
  }

  return documents.map(doc => doc.content).join('\n\n');
}