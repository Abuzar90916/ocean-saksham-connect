import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Header from './Header';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  userType: 'citizen' | 'official';
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  userType,
  children,
  activeTab,
  onTabChange
}) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertCount] = useState(3); // Mock alert count

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userType={userType}
        language={language}
        onLanguageChange={setLanguage}
        onMenuToggle={() => setMobileMenuOpen(true)}
        alertCount={alertCount}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-card border-r border-border">
          <Navigation
            userType={userType}
            language={language}
            activeTab={activeTab}
            onTabChange={onTabChange}
            className="w-full"
          />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Navigation
              userType={userType}
              language={language}
              activeTab={activeTab}
              onTabChange={onTabChange}
              className="h-full pt-6"
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {React.cloneElement(children as React.ReactElement, { language })}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;