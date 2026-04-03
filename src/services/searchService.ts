import { GitaVerse } from '../data/types';
import versesData from '../../assets/data/gita-verses.json';

// Lightweight TF-IDF-like search for finding relevant verses
// Replaces ChromaDB vector search from the Python version

interface SearchIndex {
  terms: Map<string, Map<number, number>>; // term -> (docIndex -> frequency)
  docLengths: number[];
  avgDocLength: number;
}

let searchIndex: SearchIndex | null = null;
let verses: GitaVerse[] = [];

// Stopwords to ignore during search
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'or',
  'if', 'while', 'because', 'until', 'about', 'this', 'that', 'these',
  'those', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what',
  'which', 'who', 'whom', 'am',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function buildIndex(): void {
  verses = versesData as GitaVerse[];
  const terms = new Map<string, Map<number, number>>();
  const docLengths: number[] = [];

  for (let i = 0; i < verses.length; i++) {
    const tokens = tokenize(verses[i].full_context);
    docLengths.push(tokens.length);

    const termFreq = new Map<string, number>();
    for (const token of tokens) {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    }

    for (const [term, freq] of termFreq) {
      if (!terms.has(term)) {
        terms.set(term, new Map());
      }
      terms.get(term)!.set(i, freq);
    }
  }

  const avgDocLength = docLengths.reduce((a, b) => a + b, 0) / docLengths.length;

  searchIndex = { terms, docLengths, avgDocLength };
}

// BM25 scoring
function bm25Score(queryTerms: string[], docIndex: number): number {
  if (!searchIndex) return 0;
  
  const k1 = 1.5;
  const b = 0.75;
  const N = verses.length;
  let score = 0;

  for (const term of queryTerms) {
    const termDocs = searchIndex.terms.get(term);
    if (!termDocs) continue;

    const df = termDocs.size;
    const tf = termDocs.get(docIndex) || 0;
    if (tf === 0) continue;

    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    const docLength = searchIndex.docLengths[docIndex];
    const tfNorm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLength / searchIndex.avgDocLength)));

    score += idf * tfNorm;
  }

  return score;
}

export function initializeSearch(): void {
  if (!searchIndex) {
    buildIndex();
  }
}

export function searchVerses(query: string, k: number = 2): GitaVerse[] {
  if (!searchIndex) {
    buildIndex();
  }

  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return verses.slice(0, k);

  const scores: { index: number; score: number }[] = [];

  for (let i = 0; i < verses.length; i++) {
    const score = bm25Score(queryTerms, i);
    if (score > 0) {
      scores.push({ index: i, score });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, k).map(s => verses[s.index]);
}

export function getAllVerses(): GitaVerse[] {
  if (verses.length === 0) {
    verses = versesData as GitaVerse[];
  }
  return verses;
}

export function getVerseCount(): number {
  return (versesData as GitaVerse[]).length;
}
