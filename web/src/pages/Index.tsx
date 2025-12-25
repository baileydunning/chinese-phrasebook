import { situations } from '@/data/phrases';
import { SituationCard } from '@/components/SituationCard';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen pb-24">
      <Header title="Chinese Phrasebook" />
      
      {/* Search */}
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <SearchBar />
      </div>

      {/* Situations grid */}
      <div className="px-4 max-w-lg mx-auto">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Situations
        </h2>
        <div className="space-y-3">
          {situations.map((situation) => (
            <SituationCard 
              key={situation.id} 
              situation={situation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
