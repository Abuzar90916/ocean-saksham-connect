import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  TrendingUp,
  Waves,
  Wind,
  Zap
} from 'lucide-react';
import { Report, Alert as AlertType } from '@/types';
import heroImage from '@/assets/hero-ocean.jpg';

interface CitizenDashboardProps {
  language: 'en' | 'hi';
  onQuickReport: () => void;
  onViewMap: () => void;
  recentReports: Report[];
  activeAlerts: AlertType[];
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  language,
  onQuickReport,
  onViewMap,
  recentReports,
  activeAlerts
}) => {
  const translations = {
    en: {
      welcome: 'Welcome to OceanSaksham',
      subtitle: 'Marine Safety & Disaster Management System',
      quickReport: 'Quick Report',
      reportDesc: 'Report marine hazards instantly',
      viewMap: 'Live Map',
      mapDesc: 'View real-time hazard locations',
      recentReports: 'Your Recent Reports',
      activeAlerts: 'Active Alerts',
      noReports: 'No recent reports',
      noAlerts: 'No active alerts in your area',
      reportNow: 'Report Hazard',
      viewAll: 'View All'
    },
    hi: {
      welcome: 'ओशन सक्षम में आपका स्वागत है',
      subtitle: 'समुद्री सुरक्षा और आपदा प्रबंधन प्रणाली',
      quickReport: 'त्वरित रिपोर्ट',
      reportDesc: 'समुद्री खतरों की तुरंत रिपोर्ट करें',
      viewMap: 'लाइव मैप',
      mapDesc: 'वास्तविक समय खतरे के स्थान देखें',
      recentReports: 'आपकी हाल की रिपोर्ट',
      activeAlerts: 'सक्रिय अलर्ट',
      noReports: 'कोई हाल की रिपोर्ट नहीं',
      noAlerts: 'आपके क्षेत्र में कोई सक्रिय अलर्ट नहीं',
      reportNow: 'खतरे की रिपोर्ट करें',
      viewAll: 'सभी देखें'
    }
  };

  const t = translations[language];

  const getUrgencyColor = (urgency: Report['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return 'urgent';
      case 'high':
        return 'medium';
      case 'medium':
        return 'medium';
      default:
        return 'resolved';
    }
  };

  const getHazardIcon = (type: Report['type']) => {
    switch (type) {
      case 'flood':
        return <Waves className="h-4 w-4" />;
      case 'storm':
        return <Wind className="h-4 w-4" />;
      case 'tsunami':
        return <Zap className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden rounded-lg bg-ocean-gradient p-8 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{t.welcome}</h1>
          <p className="text-white/90 mb-6">{t.subtitle}</p>
          <Button 
            onClick={onQuickReport}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 transition-ocean"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            {t.reportNow}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="transition-ocean hover:shadow-card cursor-pointer" onClick={onQuickReport}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertTriangle className="h-5 w-5" />
              {t.quickReport}
            </CardTitle>
            <CardDescription>{t.reportDesc}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-ocean hover:shadow-card cursor-pointer" onClick={onViewMap}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              {t.viewMap}
            </CardTitle>
            <CardDescription>{t.mapDesc}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t.activeAlerts}
              <Badge variant="destructive">{activeAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.slice(0, 3).map((alert) => (
              <Alert key={alert.id} className="border-medium bg-medium/5">
                <AlertTriangle className="h-4 w-4 text-medium" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Badge variant="outline" className="text-xs">
                    {alert.area}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t.recentReports}</CardTitle>
            <CardDescription>
              {recentReports.length > 0 ? `${recentReports.length} reports` : t.noReports}
            </CardDescription>
          </div>
          {recentReports.length > 0 && (
            <Button variant="outline" size="sm">
              {t.viewAll}
            </Button>
          )}
        </CardHeader>
        {recentReports.length > 0 && (
          <CardContent>
            <div className="space-y-3">
              {recentReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-${getUrgencyColor(report.urgency)}/10`}>
                      {getHazardIcon(report.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={report.status === 'resolved' ? 'default' : 'outline'}
                    className={report.status === 'pending' ? 'text-medium' : ''}
                  >
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CitizenDashboard;