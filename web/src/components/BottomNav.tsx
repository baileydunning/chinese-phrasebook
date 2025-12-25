import { NavLink, useLocation } from 'react-router-dom';
import { MessagesSquare, Languages, Bookmark, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: MessagesSquare, label: 'Phrases' },
  { to: '/basics', icon: Languages, label: 'Vocab' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/saved', icon: Bookmark, label: 'Saved' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || 
            (to !== '/' && location.pathname.startsWith(to));

          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "nav-item flex-1 max-w-[80px]",
                isActive && "active"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
