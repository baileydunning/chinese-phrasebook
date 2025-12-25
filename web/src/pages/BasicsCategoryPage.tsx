import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { basicCategories, wordTagLabels, WordTag } from '@/data/basicVocabulary';
import { useSavedPhrases } from '@/hooks/useSavedPhrases';
import { Bookmark, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const BasicsCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const category = basicCategories.find((c) => c.id === id);
  const { saveWord, removeWord, isWordSaved } = useSavedPhrases();
  const [activeFilters, setActiveFilters] = useState<WordTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!category) {
    return <Navigate to="/basics" replace />;
  }

  // Get all unique tags from words in this category
  const availableTags = Array.from(
    new Set(category.items.flatMap(item => item.tags || []))
  ).sort();

  // Normalize text for search
  const normalizeText = (text: string) => {
    return text.toLowerCase()
      .replace(/[āáǎà]/g, 'a')
      .replace(/[ēéěè]/g, 'e')
      .replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o')
      .replace(/[ūúǔù]/g, 'u')
      .replace(/[ǖǘǚǜü]/g, 'v');
  };

  // Filter words based on active filters and search
  let filteredItems = category.items;
  
  if (activeFilters.length > 0) {
    filteredItems = filteredItems.filter(item =>
      activeFilters.some(tag => item.tags?.includes(tag))
    );
  }

  if (searchQuery.trim() !== '') {
    filteredItems = filteredItems.filter(item =>
      normalizeText(item.chinese).includes(normalizeText(searchQuery)) ||
      normalizeText(item.pinyin).includes(normalizeText(searchQuery)) ||
      normalizeText(item.english).includes(normalizeText(searchQuery))
    );
  }

  const toggleFilter = (tag: WordTag) => {
    setActiveFilters(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
  };

  const handleToggleSave = (item: { chinese: string; pinyin: string; english: string }) => {
    const wordId = `${category.id}-${item.chinese}`;
    if (isWordSaved(wordId)) {
      removeWord(wordId);
    } else {
      saveWord({ ...item, category: category.name }, wordId);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={category.name} showBack />
      
      <main className="px-4 py-4">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in this category..."
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl",
              "bg-secondary border border-border/50",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>

        {/* Filter tags */}
        {availableTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Filter</p>
              {(activeFilters.length > 0 || searchQuery.trim() !== '') && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    activeFilters.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {wordTagLabels[tag]}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4">
          {filteredItems.length} word{filteredItems.length !== 1 ? 's' : ''}
          {(activeFilters.length > 0 || searchQuery.trim() !== '') && ` (filtered from ${category.items.length})`}
        </p>

        <div className="space-y-2">
          {filteredItems.map((item, index) => {
            const wordId = `${category.id}-${item.chinese}`;
            const saved = isWordSaved(wordId);
            
            return (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-chinese text-chinese">
                      {item.chinese}
                    </span>
                    <span className="text-sm text-pinyin">
                      {item.pinyin}
                    </span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {item.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                        >
                          {wordTagLabels[tag]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">
                    {item.english}
                  </span>
                  <button
                    onClick={() => handleToggleSave(item)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      saved
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Bookmark className={cn("w-5 h-5", saved && "fill-current")} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No words match these filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BasicsCategoryPage;
