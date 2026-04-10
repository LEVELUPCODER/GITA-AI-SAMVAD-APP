import { searchVerses } from './searchService';
import EventSource from 'react-native-sse';

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ResponseDepth = 'short' | 'detailed';

export async function getKrishnaGuidance(
  userQuestion: string,
  depth: ResponseDepth = 'short',
  language: string = 'english',
  onChunk?: (text: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // 1. RAG: Retrieve relevant verses
      const relevantVerses = searchVerses(userQuestion, 2);
      const context = relevantVerses.map(v => v.full_context).join('\n');

      const depthInstruction =
        depth === 'short'
          ? 'Short and direct guidance.'
          : 'A detailed philosophical Samvad.';

      const languageInstruction = language === 'hindi' 
        ? 'Translate your entire response beautifully into pure Hindi.'
        : language === 'sanskrit'
          ? 'Provide your core guidance in Sanskrit, followed by a brief English explanation.'
          : '';

      const systemPrompt = `You are Lord Krishna. ${depthInstruction} ${languageInstruction} Context: ${context}. Always address the user as 'Parth' in your reply.`;

      const es = new EventSource(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/LEVELUPCODER/Gita_ai_samvad',
          'X-Title': 'Gita AI Samvad',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          max_tokens: 1500,
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userQuestion }
          ]
        })
      });

      let fullText = '';
      let isResolved = false;

      es.addEventListener('message', (event) => {
        if (event.data === '[DONE]') {
          es.close();
          if (!isResolved) {
            isResolved = true;
            resolve(fullText || '🙏 Krishna is in deep meditation. Please try again.');
          }
          return;
        }
        
        try {
          const parsed = JSON.parse(event.data || '{}');
          
          if (parsed.error) {
            es.close();
            if (!isResolved) {
              isResolved = true;
              if (parsed.error.code === 429) {
                reject(new Error('⏳ The divine channel is busy, Parth. Please wait a moment and try again.'));
              } else {
                reject(new Error(`API Error: ${parsed.error.message}`));
              }
            }
            return;
          }
          
          const chunk = parsed.choices?.[0]?.delta?.content || '';
          if (chunk) {
            fullText += chunk;
            if (onChunk) onChunk(fullText);
          }
        } catch (e) {
          // Ignore partial parse errors for chunks
        }
      });

      es.addEventListener('error', (event: any) => {
        es.close();
        if (!isResolved) {
          isResolved = true;
          if (fullText) {
            resolve(fullText);
          } else {
            // OFFLINE FALLBACK MODE
            const fallbackText = `*(Offline Mode)*\n\nParth, the cosmic network is fluctuating, but eternal wisdom resides within you. Here are the sacred verses guiding your path:\n\n${context}`;
            
            if (onChunk) onChunk(fallbackText); // Push instantly if streaming UI expects chunks
            resolve(fallbackText);
          }
        }
      });

    } catch (error: any) {
      reject(error);
    }
  });
}
