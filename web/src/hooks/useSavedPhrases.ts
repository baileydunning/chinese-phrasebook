import { useState, useEffect, useCallback } from 'react';
import { Phrase, SavedPhrase, SavedWord, BasicWord } from '@/types/phrase';

const STORAGE_KEY = 'chinese-phrasebook-saved';
const WORDS_STORAGE_KEY = 'chinese-phrasebook-saved-words';

export const useSavedPhrases = () => {
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedPhrases(parsed.map((p: any) => ({
          ...p,
          savedAt: new Date(p.savedAt),
          lastUsed: p.lastUsed ? new Date(p.lastUsed) : undefined,
        })));
      }
      
      const storedWords = localStorage.getItem(WORDS_STORAGE_KEY);
      if (storedWords) {
        const parsedWords = JSON.parse(storedWords);
        setSavedWords(parsedWords.map((w: any) => ({
          ...w,
          savedAt: new Date(w.savedAt),
        })));
      }
    } catch (e) {
      console.error('Failed to load saved phrases:', e);
    }
  }, []);

  // Save to localStorage whenever savedPhrases changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPhrases));
    } catch (e) {
      console.error('Failed to save phrases:', e);
    }
  }, [savedPhrases]);

  // Save words to localStorage whenever savedWords changes
  useEffect(() => {
    try {
      localStorage.setItem(WORDS_STORAGE_KEY, JSON.stringify(savedWords));
    } catch (e) {
      console.error('Failed to save words:', e);
    }
  }, [savedWords]);

  const savePhrase = useCallback((phrase: Phrase, note?: string) => {
    setSavedPhrases(prev => {
      const exists = prev.find(p => p.id === phrase.id);
      if (exists) return prev;
      
      const savedPhrase: SavedPhrase = {
        ...phrase,
        savedAt: new Date(),
        note,
        isSaved: true,
        usageCount: 0,
      };
      return [...prev, savedPhrase];
    });
  }, []);

  const removePhrase = useCallback((phraseId: string) => {
    setSavedPhrases(prev => prev.filter(p => p.id !== phraseId));
  }, []);

  const clearAllPhrases = useCallback(() => {
    setSavedPhrases([]);
  }, []);

  const toggleFavorite = useCallback((phraseId: string) => {
    setSavedPhrases(prev => 
      prev.map(p => 
        p.id === phraseId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  }, []);

  const updateNote = useCallback((phraseId: string, note: string) => {
    setSavedPhrases(prev => 
      prev.map(p => 
        p.id === phraseId ? { ...p, note } : p
      )
    );
  }, []);

  const recordUsage = useCallback((phraseId: string) => {
    setSavedPhrases(prev => 
      prev.map(p => 
        p.id === phraseId 
          ? { ...p, usageCount: (p.usageCount || 0) + 1, lastUsed: new Date() } 
          : p
      )
    );
  }, []);

  const isPhrasesSaved = useCallback((phraseId: string) => {
    return savedPhrases.some(p => p.id === phraseId);
  }, [savedPhrases]);

  const getFavorites = useCallback(() => {
    return savedPhrases.filter(p => p.isFavorite);
  }, [savedPhrases]);

  const getRecentlyUsed = useCallback(() => {
    return [...savedPhrases]
      .filter(p => p.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, 10);
  }, [savedPhrases]);

  const saveWord = useCallback((word: BasicWord, wordId: string) => {
    setSavedWords(prev => {
      const exists = prev.find(w => w.id === wordId);
      if (exists) return prev;
      
      const savedWord: SavedWord = {
        ...word,
        id: wordId,
        savedAt: new Date(),
        type: 'word',
      };
      return [...prev, savedWord];
    });
  }, []);

  const removeWord = useCallback((wordId: string) => {
    setSavedWords(prev => prev.filter(w => w.id !== wordId));
  }, []);

  const isWordSaved = useCallback((wordId: string) => {
    return savedWords.some(w => w.id === wordId);
  }, [savedWords]);

  const clearAllWords = useCallback(() => {
    setSavedWords([]);
  }, []);

  return {
    savedPhrases,
    savedWords,
    savePhrase,
    removePhrase,
    clearAllPhrases,
    toggleFavorite,
    updateNote,
    recordUsage,
    isPhrasesSaved,
    getFavorites,
    getRecentlyUsed,
    saveWord,
    removeWord,
    isWordSaved,
    clearAllWords,
  };
};
