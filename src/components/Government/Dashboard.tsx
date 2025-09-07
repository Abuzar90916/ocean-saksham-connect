import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  MapPin,
  Radio,
  Shield
} from 'lucide-react';
import { Statistics, Report } from '@/types';

interface GovernmentDashboardProps {
  language: 'en' | 'hi';
  statistics: Statistics;
  onBroadcastAlert: () => void;
  onViewReports: () => void;
  onViewMap: () => void;
}

const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  language,
  statistics,
  onBroadcastAlert,
  onViewReports,
  onViewMap
}) => {
  const translations = {
    en: {
      overview: 'Emergency Operations Dashboard',
      subtitle: 'Marine Safety Command Center',
      totalReports: 'Total Reports',
      pendingReports: 'Pending Review',
      resolvedReports: 'Resolved',
      activeAlerts: 'Active Alerts',
      broadcastAlert: 'Broadcast Alert',
      manageReports: 'Manage Reports',
      viewMap: 'Command Map',
      recentActivity: 'Recent Activity',
      responseTime: 'Avg Response Time',
      resolution: 'Resolution Rate',
      quickActions: 'Quick Actions',
      systemStatus: 'System Status',
      online: 'Online'
    },
    hi: {
      overview: 'आपातकालीन संचालन डैशबोर्ड',
      subtitle: 'समुद्री सुरक्षा कमांड केंद्र',
      totalReports: 'कुल रिपोर्ट',
      pendingReports: 'समीक्षा के लिए लंबित',
      resolvedReports: 'हल हो गया',
      activeAlerts: 'सक्रिय अलर्ट',
      broadcastAlert: 'अलर्ट प्रसारण',
      manageReports: 'रिपोर्ट प्रबंधन',
      viewMap: 'कमांड मैप',
      recentActivity: 'हाल की गतिविधि',
      responseTime: 'औसत प्रतिक्रिया समय',
      resolution: 'समाधान दर',
      quickActions: 'त्वरित कार्य',
      systemStatus: 'सिस्टम की स्थिति',
      online: 'ऑनलाइन'
    }
  };

  const t = translations[language];

  const resolutionRate = statistics.totalReports > 0 
    ? (statistics.resolvedReports / statistics.totalReports) * 100 
    : 0;

  const pendingPercentage = statistics.totalReports > 0
    ? (statistics.pendingReports / statistics.totalReports) * 100
    : 0;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-ocean-gradient rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t.overview}</h1>
            <p className="text-white/90">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-resolved rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{t.online}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalReports}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.pendingReports}</CardTitle>
            <Clock className="h-4 w-4 text-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medium">{statistics.pendingReports}</div>
            <Progress value={pendingPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.resolvedReports}</CardTitle>
            <CheckCircle className="h-4 w-4 text-resolved" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-resolved">{statistics.resolvedReports}</div>
            <p className="text-xs text-muted-foreground">
              {resolutionRate.toFixed(1)}% {t.resolution.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeAlerts}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-urgent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-urgent">{statistics.activeAlerts}</div>
            <Badge variant="destructive" className="mt-1 text-xs">
              Urgent attention
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.quickActions}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={onBroadcastAlert}
              className="h-16 flex-col gap-2 bg-urgent hover:bg-urgent/90"
            >
              <Radio className="h-5 w-5" />
              {t.broadcastAlert}
            </Button>
            
            <Button 
              onClick={onViewReports}
              variant="outline"
              className="h-16 flex-col gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <CheckCircle className="h-5 w-5" />
              {t.manageReports}
            </Button>
            
            <Button 
              onClick={onViewMap}
              variant="outline"
              className="h-16 flex-col gap-2 border-resolved text-resolved hover:bg-resolved hover:text-resolved-foreground"
            >
              <MapPin className="h-5 w-5" />
              {t.viewMap}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t.recentActivity}</CardTitle>
          <CardDescription>Latest reports and system updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.recentReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    report.urgency === 'urgent' ? 'bg-urgent/10' : 
                    report.urgency === 'high' ? 'bg-medium/10' : 
                    'bg-resolved/10'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      report.urgency === 'urgent' ? 'text-urgent' : 
                      report.urgency === 'high' ? 'text-medium' : 
                      'text-resolved'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{report.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.location.address} • {new Date(report.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      report.status === 'resolved' ? 'default' : 
                      report.status === 'verified' ? 'secondary' : 
                      'outline'
                    }
                    className={
                      report.status === 'pending' ? 'text-medium border-medium' : ''
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentDashboard;