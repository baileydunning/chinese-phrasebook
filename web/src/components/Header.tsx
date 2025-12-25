import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
}

export const Header = ({ title, showBack = false, className, rightElement }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border/50",
      "safe-top",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="font-bold text-xl">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
