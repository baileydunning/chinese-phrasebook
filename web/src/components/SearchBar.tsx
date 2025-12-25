import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { searchPhrases } from '@/data/phrases';
import { Phrase } from '@/types/phrase';
import { PhraseCard } from './PhraseCard';
import { useSavedPhrases } from '@/hooks/useSavedPhrases';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  showRecentSearches?: boolean;
}

export const SearchBar = ({ className, showRecentSearches = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Phrase[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { savePhrase, removePhrase, isPhrasesSaved } = useSavedPhrases();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();

  useEffect(() => {
    if (query.trim().length > 0) {
      const found = searchPhrases(query);
      setResults(found);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length > 0) {
      addSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      addSearch(query);
    }
  };

  const handleRecentClick = (term: string) => {
    handleSearch(term);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search phrases..."
          className={cn(
            "w-full pl-12 pr-10 py-3 rounded-xl",
            "bg-secondary text-foreground placeholder:text-muted-foreground",
            "border border-border focus:border-primary/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Recent searches (shown when no query and enabled) */}
      {showRecentSearches && !query && recentSearches.length > 0 && (
        <div className="mt-4 animate-fade-in">
          <p className="text-sm text-muted-foreground mb-2">
            Recent searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentClick(term)}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-accent transition-colors"
              >
                <span>{term}</span>
                <X 
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(term);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isOpen && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {results.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </p>
              {results.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isSaved={isPhrasesSaved(phrase.id)}
                  onSave={() => savePhrase(phrase)}
                  onRemove={() => removePhrase(phrase.id)}
                  showCategory
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No phrases found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try searching for common phrases like "hello", "thank you", or "how much"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
