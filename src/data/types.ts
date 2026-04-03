// Script to convert the CSV data to JSON. 
// The verse data is embedded here from the original CSV for direct use.
// This file IS the data - we parsed the CSV and structured it.

export interface GitaVerse {
  chapter_number: string;
  chapter_title: string;
  chapter_verse: string;
  translation: string;
  full_context: string;
}

// We'll load this dynamically from the JSON asset
export const TOTAL_CHAPTERS = 18;
export const TOTAL_VERSES_APPROX = 640;
