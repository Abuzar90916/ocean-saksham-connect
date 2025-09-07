import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Bell, Menu, Shield, Waves, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userType: 'citizen' | 'official';
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onMenuToggle: () => void;
  alertCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  userType,
  language,
  onLanguageChange,
  onMenuToggle,
  alertCount = 0
}) => {
  const { theme, setTheme } = useTheme();
  const translations = {
    en: {
      oceanSaksham: 'OceanSaksham',
      citizen: 'Citizen Portal',
      official: 'Government Official',
      alerts: 'Alerts'
    },
    hi: {
      oceanSaksham: 'ओशन सक्षम',
      citizen: 'नागरिक पोर्टल',
      official: 'सरकारी अधिकारी',
      alerts: 'अलर्ट'
    }
  };

  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 w-full bg-ocean-gradient shadow-ocean backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="text-white hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Waves className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white">{t.oceanSaksham}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant={userType === 'official' ? 'default' : 'secondary'}
            className={cn(
              "flex items-center gap-1",
              userType === 'official' 
                ? "bg-white/20 text-white hover:bg-white/30" 
                : "bg-white text-primary"
            )}
          >
            {userType === 'official' && <Shield className="h-3 w-3" />}
            {userType === 'citizen' ? t.citizen : t.official}
          </Badge>

          {alertCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {alertCount > 9 ? '9+' : alertCount}
              </Badge>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-white hover:bg-white/10"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="gap-1 text-white hover:bg-white/10"
          >
            <Languages className="h-4 w-4" />
            {language.toUpperCase()}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;