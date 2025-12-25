import { useState } from 'react';
import { Header } from '@/components/Header';
import { PhraseCard } from '@/components/PhraseCard';
import { useSavedPhrases } from '@/hooks/useSavedPhrases';
import { Bookmark, MessageSquare, Languages, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'phrases' | 'words';

const SavedPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { 
    savedPhrases, 
    savedWords,
    removePhrase, 
    removeWord,
  } = useSavedPhrases();

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All', icon: Bookmark },
    { id: 'phrases', label: 'Phrases', icon: MessageSquare },
    { id: 'words', label: 'Vocab', icon: Languages },
  ];

  const getDisplayContent = () => {
    switch (activeTab) {
      case 'phrases':
        return { phrases: savedPhrases, words: [] };
      case 'words':
        return { phrases: [], words: savedWords };
      default:
        return { phrases: savedPhrases, words: savedWords };
    }
  };

  const { phrases: displayPhrases, words: displayWords } = getDisplayContent();
  const hasContent = displayPhrases.length > 0 || displayWords.length > 0;

  return (
    <div className="min-h-screen pb-24">
      <Header title="Saved" />
      
      {/* Tabs */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg",
                "text-sm font-medium transition-all duration-200",
                activeTab === id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2 max-w-lg mx-auto">
        {hasContent ? (
          <div className="space-y-4">
            {/* Words section */}
            {displayWords.length > 0 && (
              <div className="space-y-2">
                {activeTab === 'all' && (
                  <h3 className="text-sm font-medium text-muted-foreground px-1">Vocab</h3>
                )}
                {displayWords.map((word, index) => (
                  <div
                    key={word.id}
                    className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` } as React.CSSProperties}
                  >
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-chinese text-chinese">
                          {word.chinese}
                        </span>
                        <span className="text-sm text-pinyin">
                          {word.pinyin}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{word.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">
                        {word.english}
                      </span>
                      <button
                        onClick={() => removeWord(word.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Phrases section */}
            {displayPhrases.length > 0 && (
              <div className="space-y-4">
                {activeTab === 'all' && displayWords.length > 0 && (
                  <h3 className="text-sm font-medium text-muted-foreground px-1 mt-6">Phrases</h3>
                )}
                {displayPhrases.map((phrase, index) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isSaved={true}
                    onRemove={() => removePhrase(phrase.id)}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(displayWords.length + index) * 30}ms` } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">
              {activeTab === 'all' && 'Nothing saved yet'}
              {activeTab === 'phrases' && 'No saved phrases yet'}
              {activeTab === 'words' && 'No saved vocab yet'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
              {activeTab === 'all' && 'Save phrases and words to quickly access them here'}
              {activeTab === 'phrases' && 'Save phrases from any situation to find them quickly'}
              {activeTab === 'words' && 'Save vocab from Basics to build your vocabulary'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;
