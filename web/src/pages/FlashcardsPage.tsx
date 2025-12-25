import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { getAllPhrases } from '@/data/phrases';
import { basicCategories } from '@/data/basicVocabulary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Shuffle, Bookmark } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { useSavedPhrases } from '@/hooks/useSavedPhrases';
import { cn } from '@/lib/utils';

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FlashcardsPage = () => {
  const { speak, isSpeaking } = useSpeech();
  const { savePhrase, removePhrase, saveWord, removeWord, isPhrasesSaved, isWordSaved } = useSavedPhrases();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mode, setMode] = useState<'phrases' | 'words'>('phrases');
  const [shuffleKey, setShuffleKey] = useState(0);

  const allPhrases = useMemo(() => getAllPhrases(), []);
  const allWords = useMemo(() => basicCategories.flatMap(cat => cat.items), []);

  const items = useMemo(() => {
    const rawItems = mode === 'phrases'
      ? allPhrases.map(p => ({
          id: p.id,
          chinese: p.chinese,
          english: p.english,
          pinyin: p.pinyin,
          category: p.category,
        }))
      : allWords.map((w, i) => ({
          id: `word-${i}`,
          chinese: w.chinese,
          english: w.english,
          pinyin: w.pinyin,
          category: 'vocabulary',
        }));
    return shuffleArray(rawItems);
  }, [allPhrases, allWords, mode, shuffleKey]);

  const currentItem = items[currentIndex];

  const isSaved = mode === 'phrases'
    ? isPhrasesSaved(currentItem?.id || '')
    : isWordSaved(currentItem?.id || '');

  const handleSave = () => {
    if (!currentItem) return;
    if (mode === 'phrases') {
      const phrase = allPhrases.find(p => p.id === currentItem.id);
      if (phrase) {
        if (isSaved) {
          removePhrase(phrase.id);
        } else {
          savePhrase(phrase);
        }
      }
    } else {
      if (isSaved) {
        removeWord(currentItem.id);
      } else {
        saveWord({
          chinese: currentItem.chinese,
          pinyin: currentItem.pinyin,
          english: currentItem.english,
          category: currentItem.category,
        }, currentItem.id);
      }
    }
  };


  const handleShuffle = () => {
    setIsFlipped(false);
    setShuffleKey(prev => prev + 1);
    setCurrentIndex(0);
  };

  const handleSpeak = () => {
    if (currentItem) {
      speak(currentItem.chinese);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Flashcards" />
      
      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={mode === 'phrases' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('phrases');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            Phrases
          </Button>
          <Button
            variant={mode === 'words' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setMode('words');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          >
            Words
          </Button>
        </div>


        {/* Flashcard */}
        <div 
          className="perspective-1000 cursor-pointer mb-6"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Card className={cn(
            "relative h-64 transition-transform duration-500 transform-style-3d",
            isFlipped && "rotate-y-180"
          )}>
            {/* Front - Chinese */}
            <div className={cn(
              "absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden",
              isFlipped && "invisible"
            )}>
              <p className="text-lg text-muted-foreground mb-2">中文</p>
              <p className="text-3xl font-bold text-center mb-2">{currentItem?.chinese}</p>
              <p className="text-lg text-muted-foreground">{currentItem?.pinyin}</p>
              <p className="text-sm text-muted-foreground mt-4">Tap to flip</p>
            </div>
            
            {/* Back - English */}
            <div className={cn(
              "absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180",
              !isFlipped && "invisible"
            )}>
              <p className="text-lg text-muted-foreground mb-2">English</p>
              <p className="text-2xl font-semibold text-center">{currentItem?.english}</p>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleShuffle}
          >
            <Shuffle className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSpeak}
            disabled={isSpeaking}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
          
          <Button
            variant={isSaved ? 'default' : 'outline'}
            size="icon"
            onClick={handleSave}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;
