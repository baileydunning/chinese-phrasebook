import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSituationById } from '@/data/phrases';
import { Header } from '@/components/Header';
import { PhraseCard } from '@/components/PhraseCard';
import { useSavedPhrases } from '@/hooks/useSavedPhrases';
import { SituationCategory, PhraseTag } from '@/types/phrase';
import { cn } from '@/lib/utils';

const tagLabels: Record<PhraseTag, string> = {
  basic: 'Basic',
  polite: 'Polite',
  urgent: 'Urgent',
  payment: 'Payment',
  directions: 'Directions',
  questions: 'Questions',
  problems: 'Problems',
  numbers: 'Numbers',
  time: 'Time',
  'food-types': 'Food Types',
  allergies: 'Allergies',
  requests: 'Requests',
  compliments: 'Compliments',
  greetings: 'Greetings',
  farewells: 'Farewells',
  booking: 'Booking',
  bargaining: 'Bargaining',
  sizing: 'Sizing',
  complaints: 'Complaints',
};

const SituationPage = () => {
  const { id } = useParams<{ id: string }>();
  const situation = getSituationById(id as SituationCategory);
  const { savePhrase, removePhrase, isPhrasesSaved } = useSavedPhrases();
  const [activeFilters, setActiveFilters] = useState<PhraseTag[]>([]);

  if (!situation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Situation not found</p>
      </div>
    );
  }

  // Get all unique tags from phrases in this situation
  const availableTags = Array.from(
    new Set(situation.phrases.flatMap(p => p.tags || []))
  ).sort();

  // Filter phrases based on active filters
  const filteredPhrases = activeFilters.length === 0
    ? situation.phrases
    : situation.phrases.filter(phrase =>
        activeFilters.some(tag => phrase.tags?.includes(tag))
      );

  const toggleFilter = (tag: PhraseTag) => {
    setActiveFilters(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  return (
    <div className="min-h-screen pb-24">
      <Header title={situation.name} showBack />
      
      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Filter tags */}
        {availableTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Filter</p>
              {activeFilters.length > 0 && (
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
                  {tagLabels[tag]}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4">
          {filteredPhrases.length} phrase{filteredPhrases.length !== 1 ? 's' : ''}
          {activeFilters.length > 0 && ` (filtered from ${situation.phrases.length})`}
        </p>

        <div className="space-y-4">
          {filteredPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isSaved={isPhrasesSaved(phrase.id)}
              onSave={() => savePhrase(phrase)}
              onRemove={() => removePhrase(phrase.id)}
            />
          ))}
        </div>

        {filteredPhrases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No phrases match these filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SituationPage;
