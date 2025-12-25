import { useState } from 'react';
import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { basicCategories } from '@/data/basicVocabulary';
import { cn } from '@/lib/utils';

const BasicsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeText = (text: string) => {
    return text.toLowerCase()
      .replace(/[āáǎà]/g, 'a')
      .replace(/[ēéěè]/g, 'e')
      .replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o')
      .replace(/[ūúǔù]/g, 'u')
      .replace(/[ǖǘǚǜü]/g, 'v');
  };

  const filteredCategories = searchQuery.trim() === '' 
    ? basicCategories 
    : basicCategories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          normalizeText(item.chinese).includes(normalizeText(searchQuery)) ||
          normalizeText(item.pinyin).includes(normalizeText(searchQuery)) ||
          normalizeText(item.english).includes(normalizeText(searchQuery))
        )
      })).filter(category => category.items.length > 0);

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Basics" showBack={false} />
      
      <main className="px-4 py-4 max-w-lg mx-auto">
        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vocabulary..."
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl",
              "bg-secondary border border-border/50",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>

        {searchQuery.trim() !== '' && (
          <p className="text-muted-foreground text-sm mb-4">
            {totalResults} result{totalResults !== 1 ? 's' : ''} found
          </p>
        )}

        {searchQuery.trim() === '' ? (
          <>
            <p className="text-muted-foreground text-sm mb-4">
              Quick reference for essential vocabulary
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {basicCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.id}
                    to={`/basics/${category.id}`}
                    className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <Icon className="w-8 h-8 mb-2 text-primary" />
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.items.length} words
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between"
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
                        </div>
                        <div className="text-right">
                          <span className="text-foreground font-medium">
                            {item.english}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {searchQuery.trim() !== '' && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BasicsPage;
