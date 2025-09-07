import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  MapPin,
  AlertTriangle,
  FileText,
  BarChart3,
  Radio,
  CheckCircle,
  Users
} from 'lucide-react';

interface NavigationProps {
  userType: 'citizen' | 'official';
  language: 'en' | 'hi';
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  userType,
  language,
  activeTab,
  onTabChange,
  className
}) => {
  const translations = {
    en: {
      // Citizen tabs
      dashboard: 'Dashboard',
      quickReport: 'Quick Report',
      map: 'Live Map',
      myReports: 'My Reports',
      alerts: 'Alerts',
      // Official tabs
      overview: 'Overview',
      reports: 'Reports',
      broadcast: 'Broadcast',
      analytics: 'Analytics'
    },
    hi: {
      // Citizen tabs
      dashboard: 'डैशबोर्ड',
      quickReport: 'त्वरित रिपोर्ट',
      map: 'लाइव मैप',
      myReports: 'मेरी रिपोर्ट',
      alerts: 'अलर्ट',
      // Official tabs
      overview: 'अवलोकन',
      reports: 'रिपोर्ट',
      broadcast: 'प्रसारण',
      analytics: 'विश्लेषण'
    }
  };

  const t = translations[language];

  const citizenTabs = [
    { id: 'dashboard', label: t.dashboard, icon: Home },
    { id: 'quickReport', label: t.quickReport, icon: AlertTriangle },
    { id: 'map', label: t.map, icon: MapPin },
    { id: 'myReports', label: t.myReports, icon: FileText },
    { id: 'alerts', label: t.alerts, icon: Radio }
  ];

  const officialTabs = [
    { id: 'overview', label: t.overview, icon: BarChart3 },
    { id: 'reports', label: t.reports, icon: CheckCircle },
    { id: 'map', label: t.map, icon: MapPin },
    { id: 'broadcast', label: t.broadcast, icon: Radio },
    { id: 'analytics', label: t.analytics, icon: Users }
  ];

  const tabs = userType === 'citizen' ? citizenTabs : officialTabs;

  return (
    <nav className={cn("flex flex-col gap-1 p-2", className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "justify-start gap-3 h-12 transition-ocean",
              isActive
                ? "bg-primary text-primary-foreground shadow-card"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;