import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchVerses } from './searchService';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export type ResponseDepth = 'short' | 'detailed';

export async function getKrishnaGuidance(
  userQuestion: string,
  depth: ResponseDepth = 'short'
): Promise<string> {
  try {
    // 1. RAG: Retrieve relevant verses
    const relevantVerses = searchVerses(userQuestion, 2);
    const context = relevantVerses.map(v => v.full_context).join('\n');

    // 2. Build the prompt (same format as original)
    const depthInstruction =
      depth === 'short'
        ? 'Short and direct guidance.'
        : 'A detailed philosophical Samvad.';

    const fullPrompt = `You are Lord Krishna. ${depthInstruction} Context: ${context}. Always address the user as 'Parth' in your reply. Parth asks: ${userQuestion}`;

    // 3. Call Gemini
    const client = getClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return '🙏 Krishna is in deep meditation. Please try again, Parth.';
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    if (error?.message?.includes('API_KEY')) {
      throw new Error('🔑 Divine connection requires a valid API key. Please check your Gemini API key.');
    }
    if (error?.message?.includes('quota') || error?.message?.includes('rate')) {
      throw new Error('⏳ The divine channel is busy, Parth. Please wait a moment and try again.');
    }
    
    throw new Error(`🙏 A divine interruption occurred: ${error?.message || 'Unknown error'}`);
  }
}
