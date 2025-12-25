import { useState } from 'react';
import { Phrase } from '@/types/phrase';
import { useSpeech } from '@/hooks/useSpeech';
import { 
  Volume2, 
  VolumeX, 
  Bookmark, 
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhraseCardProps {
  phrase: Phrase;
  isSaved?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
  showCategory?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const PhraseCard = ({ 
  phrase, 
  isSaved = false,
  onSave,
  onRemove,
  showCategory = false,
  className,
  style
}: PhraseCardProps) => {
  const { speak, stop, isSpeaking } = useSpeech();
  const [showDetails, setShowDetails] = useState(false);
  const [isLargeMode, setIsLargeMode] = useState(false);
  const [showTaiwan, setShowTaiwan] = useState(false);

  const hasTaiwanVariant = !!phrase.taiwanChinese;
  
  // Get displayed text based on toggle
  const displayChinese = showTaiwan && phrase.taiwanChinese ? phrase.taiwanChinese : phrase.chinese;
  const displayPinyin = showTaiwan && phrase.taiwanPinyin ? phrase.taiwanPinyin : phrase.pinyin;

  const handleSpeak = (slow: boolean = false) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(displayChinese, slow);
    }
  };

  const handleSaveToggle = () => {
    if (isSaved) {
      onRemove?.();
    } else {
      onSave?.();
    }
  };

  if (isLargeMode) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6"
        onClick={() => setIsLargeMode(false)}
      >
        <div className="text-center animate-scale-in">
          <p className="font-chinese text-chinese text-chinese-2xl mb-4">{displayChinese}</p>
          <p className="text-pinyin text-2xl mb-3">{displayPinyin}</p>
          <p className="text-english text-xl">{phrase.english}</p>
          
          {hasTaiwanVariant && (
            <div className="flex justify-center mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTaiwan(!showTaiwan);
                }}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm"
              >
                {showTaiwan ? 'Show China' : 'Show Taiwan'}
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak(false);
              }}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground",
                "transition-all duration-200 hover:opacity-90"
              )}
            >
              {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              <span>{isSpeaking ? 'Stop' : 'Play'}</span>
            </button>
          </div>

          <p className="text-muted-foreground mt-8 text-sm">Tap anywhere to close</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("phrase-card", className)} style={style}>
      {/* Region toggle - only if Taiwan variant exists */}
      {hasTaiwanVariant && (
        <div className="flex mb-3">
          <div className="inline-flex rounded-md bg-muted p-0.5">
            <button
              onClick={() => setShowTaiwan(false)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-all",
                !showTaiwan
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              China
            </button>
            <button
              onClick={() => setShowTaiwan(true)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-all",
                showTaiwan
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Taiwan
            </button>
          </div>
        </div>
      )}

      {/* Main phrase display */}
      <div className="mb-4">
        <p className="font-chinese text-chinese text-chinese-lg mb-1">{displayChinese}</p>
        <p className="text-pinyin text-base mb-1">{displayPinyin}</p>
        <p className="text-english text-sm">{phrase.english}</p>
      </div>

      {/* Politeness badge */}
      {phrase.politeness && (
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            phrase.politeness === 'casual' && "bg-muted text-muted-foreground",
            phrase.politeness === 'polite' && "bg-accent text-accent-foreground",
            phrase.politeness === 'very-polite' && "bg-primary/10 text-primary"
          )}>
            {phrase.politeness === 'casual' && 'Casual'}
            {phrase.politeness === 'polite' && 'Polite'}
            {phrase.politeness === 'very-polite' && 'Formal'}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSpeak(false)}
            className={cn(
              "audio-ripple flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium",
              "bg-primary text-primary-foreground transition-all duration-200",
              "hover:opacity-90 active:scale-95",
              isSpeaking && "playing"
            )}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop' : 'Play'}
          </button>
          
          <button
            onClick={() => handleSpeak(true)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium",
              "bg-secondary text-secondary-foreground transition-all duration-200",
              "hover:bg-secondary/80 active:scale-95"
            )}
          >
            Slow
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsLargeMode(true)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            title="Show large"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSaveToggle}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isSaved 
                ? "text-primary hover:bg-primary/10" 
                : "text-muted-foreground hover:bg-muted"
            )}
            title={isSaved ? 'Remove from saved' : 'Save phrase'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Cultural note (collapsible) */}
      {phrase.culturalNote && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Cultural note
          </button>
          {showDetails && (
            <p className="mt-2 text-sm text-muted-foreground animate-fade-in">
              {phrase.culturalNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
