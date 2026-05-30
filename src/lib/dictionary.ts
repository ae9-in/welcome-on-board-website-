// lib/dictionary.ts
import { WordBank } from '@/models/WordBank';
import { 
  SLANG_DICT, 
  LOCAL_DICTIONARY, 
  generateFallbackDetails 
} from './dictionary-client';

export { SLANG_DICT };

export async function ensureWordHasRealDetails(word: any): Promise<void> {
  if (!word || !word.targetWord) return;

  const targetUpper = word.targetWord.toUpperCase();
  const targetLower = word.targetWord.toLowerCase();

  // 1. Check if the word is slang
  if (SLANG_DICT[targetUpper]) {
    const slang = SLANG_DICT[targetUpper];
    let needsUpdate = false;

    if (!word.definition || word.definition.includes('Definition for') || word.definition.startsWith('The quality, state, or action')) {
      word.definition = slang.definition;
      needsUpdate = true;
    }
    if (!word.partOfSpeech || word.partOfSpeech === 'noun') {
      word.partOfSpeech = slang.partOfSpeech;
      needsUpdate = true;
    }
    if (!word.exampleSentence1 || word.exampleSentence1.includes('context sentence') || word.exampleSentence1.includes('commonly used in English')) {
      word.exampleSentence1 = slang.exampleSentence1;
      needsUpdate = true;
    }
    if (!word.exampleSentence2 || word.exampleSentence2.includes('context sentence') || word.exampleSentence2.includes('important to spell')) {
      word.exampleSentence2 = slang.exampleSentence2;
      needsUpdate = true;
    }
    if (!word.situationalPrompt || word.situationalPrompt.includes('This word starts with') || word.situationalPrompt.includes('Imagine a scenario where one refers')) {
      word.situationalPrompt = slang.situationalPrompt;
      needsUpdate = true;
    }
    if (!word.formalSynonym || word.formalSynonym.includes('Spell the word:') || word.formalSynonym.includes('A term meaning:')) {
      word.formalSynonym = slang.formalSynonym;
      needsUpdate = true;
    }
    if (!word.millennialCrossRef || word.millennialCrossRef.includes('Context spelling for') || word.millennialCrossRef.includes('Using "')) {
      word.millennialCrossRef = slang.millennialCrossRef;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await word.save();
      console.log(`✅ Restored slang details for: ${targetUpper}`);
    }
    return;
  }

  // 2. Check if the word is in the local dictionary of common spelling words
  if (LOCAL_DICTIONARY[targetUpper]) {
    const local = LOCAL_DICTIONARY[targetUpper];
    let needsUpdate = false;

    if (!word.definition || word.definition.includes('Definition for') || word.definition.startsWith('The quality, state, or action')) {
      word.definition = local.definition;
      needsUpdate = true;
    }
    if (!word.partOfSpeech || word.partOfSpeech === 'noun') {
      word.partOfSpeech = local.partOfSpeech;
      needsUpdate = true;
    }
    if (!word.exampleSentence1 || word.exampleSentence1.includes('context sentence') || word.exampleSentence1.includes('commonly used in English')) {
      word.exampleSentence1 = local.exampleSentence1;
      needsUpdate = true;
    }
    if (!word.exampleSentence2 || word.exampleSentence2.includes('context sentence') || word.exampleSentence2.includes('important to spell')) {
      word.exampleSentence2 = local.exampleSentence2;
      needsUpdate = true;
    }

    // Set Clues for Round 2
    const situationalPrompt = `Imagine a scenario where one refers to the concept of "${targetLower}". ${word.exampleSentence1 || local.exampleSentence1}`;
    if (!word.situationalPrompt || word.situationalPrompt.includes('This word starts with') || word.situationalPrompt.includes('Imagine a scenario where one refers') && word.situationalPrompt.length < 50) {
      word.situationalPrompt = situationalPrompt;
      needsUpdate = true;
    }
    const formalSynonym = `A term meaning: ${word.definition || local.definition}`;
    if (!word.formalSynonym || word.formalSynonym.includes('Spell the word:') || word.formalSynonym.includes('A term meaning:') && word.formalSynonym.length < 40) {
      word.formalSynonym = formalSynonym;
      needsUpdate = true;
    }
    const millennialCrossRef = `Using "${targetLower}" in context: "${word.exampleSentence2 || local.exampleSentence2}"`;
    if (!word.millennialCrossRef || word.millennialCrossRef.includes('Context spelling for') || word.millennialCrossRef.includes('Using "') && word.millennialCrossRef.length < 50) {
      word.millennialCrossRef = millennialCrossRef;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await word.save();
      console.log(`✅ Loaded local dictionary details for: ${targetUpper}`);
    }
    return;
  }

  // 3. Check if standard word is missing real details (placeholder detection)
  const isPlaceholderDef = !word.definition || word.definition.includes('Definition for') || word.definition.startsWith('The quality, state, or action');
  const isPlaceholderSent = !word.exampleSentence1 || word.exampleSentence1.includes('context sentence') || word.exampleSentence1.includes('commonly used in English');

  if (isPlaceholderDef || isPlaceholderSent) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${targetLower}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const firstEntry = data[0];
        const firstMeaning = firstEntry?.meanings?.[0];

        const partOfSpeech = firstMeaning?.partOfSpeech || 'noun';
        const definition = firstMeaning?.definitions?.[0]?.definition || '';

        const examples: string[] = [];
        firstMeaning?.definitions?.forEach((d: any) => {
          if (d.example) examples.push(d.example);
        });

        if (examples.length < 2) {
          firstEntry?.meanings?.forEach((m: any) => {
            m.definitions?.forEach((d: any) => {
              if (d.example && !examples.includes(d.example)) {
                examples.push(d.example);
              }
            });
          });
        }

        // Use deterministic generators if API has no example sentences
        const fallbacks = generateFallbackDetails(word.targetWord);
        const exampleSentence1 = examples[0] || fallbacks.exampleSentence1;
        const exampleSentence2 = examples[1] || fallbacks.exampleSentence2;

        word.partOfSpeech = partOfSpeech;
        word.definition = definition || fallbacks.definition;
        word.exampleSentence1 = exampleSentence1;
        word.exampleSentence2 = exampleSentence2;

        // Populate Clues
        word.situationalPrompt = `Imagine a scenario where one refers to the concept of "${targetLower}". ${exampleSentence1}`;
        word.formalSynonym = `A term meaning: ${definition || fallbacks.definition}`;
        word.millennialCrossRef = `Using "${targetLower}" in context: "${exampleSentence2}"`;

        await word.save();
        console.log(`✅ Dynamically fetched and updated details from Dictionary API for: ${targetUpper}`);
      } else {
        // API responded but with failure (e.g. 404 Not Found) -> Heal with fallback generator
        const fallbacks = generateFallbackDetails(word.targetWord);
        word.definition = fallbacks.definition;
        word.partOfSpeech = fallbacks.partOfSpeech;
        word.exampleSentence1 = fallbacks.exampleSentence1;
        word.exampleSentence2 = fallbacks.exampleSentence2;
        word.situationalPrompt = fallbacks.situationalPrompt;
        word.formalSynonym = fallbacks.formalSynonym;
        word.millennialCrossRef = fallbacks.millennialCrossRef;

        await word.save();
        console.log(`⚠️ Word "${targetUpper}" not found in Dictionary API. Healed permanently using unique fallback generator.`);
      }
    } catch (err) {
      console.error(`Failed to fetch dictionary details for ${targetUpper}, healing with fallback generator:`, err);
      // API call failed (e.g. network offline, rate limit) -> Heal with fallback generator
      const fallbacks = generateFallbackDetails(word.targetWord);
      word.definition = fallbacks.definition;
      word.partOfSpeech = fallbacks.partOfSpeech;
      word.exampleSentence1 = fallbacks.exampleSentence1;
      word.exampleSentence2 = fallbacks.exampleSentence2;
      word.situationalPrompt = fallbacks.situationalPrompt;
      word.formalSynonym = fallbacks.formalSynonym;
      word.millennialCrossRef = fallbacks.millennialCrossRef;

      await word.save();
      console.log(`⚠️ Network failure for "${targetUpper}". Healed permanently using unique fallback generator.`);
    }
  }
}
