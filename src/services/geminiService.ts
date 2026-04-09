import { searchVerses } from './searchService';

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type ResponseDepth = 'short' | 'detailed';

export async function getKrishnaGuidance(
  userQuestion: string,
  depth: ResponseDepth = 'short'
): Promise<string> {
  try {
    // 1. RAG: Retrieve relevant verses
    const relevantVerses = searchVerses(userQuestion, 2);
    const context = relevantVerses.map(v => v.full_context).join('\n');

    // 2. Build the prompt
    const depthInstruction =
      depth === 'short'
        ? 'Short and direct guidance.'
        : 'A detailed philosophical Samvad.';

    const systemPrompt = `You are Lord Krishna. ${depthInstruction} Context: ${context}. Always address the user as 'Parth' in your reply.`;

    // 3. Call OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuestion }
        ]
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('⏳ The divine channel is busy, Parth. Please wait a moment and try again.');
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error('🔑 Divine connection requires a valid API key. The API key was missing or invalid.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return '🙏 Krishna is in deep meditation. Please try again, Parth.';
    }

    return text;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error);
    
    // Pass our custom UI messages directly through
    if (error.message.includes('divine') || error.message.includes('API key')) {
      throw error;
    }
    
    throw new Error(`🙏 A divine interruption occurred: ${error?.message || 'Unknown error'}`);
  }
}

