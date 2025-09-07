import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import CitizenDashboard from '@/components/Citizen/Dashboard';
import GovernmentDashboard from '@/components/Government/Dashboard';
import InteractiveMap from '@/components/Map/InteractiveMap';
import QuickReportForm from '@/components/Forms/QuickReportForm';
import ReportDetailModal from '@/components/Modals/ReportDetailModal';
import { Report, Statistics, Alert as AlertType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [userType, setUserType] = useState<'citizen' | 'official'>('citizen');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Mock data - In real app, this would come from backend
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT-001',
      title: 'High waves at Marine Drive',
      type: 'storm',
      urgency: 'high',
      description: 'Unusually high waves observed near Marine Drive. Several fishing boats returning to shore.',
      location: { lat: 18.9220, lng: 72.8347, address: 'Marine Drive, Mumbai, Maharashtra' },
      reporterId: 'user-123',
      reporterName: 'Raj Patel',
      reporterContact: '+91-9876543210',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'verified'
    },
    {
      id: 'RPT-002', 
      title: 'Coastal flooding in Kochi',
      type: 'flood',
      urgency: 'urgent',
      description: 'Water levels rising rapidly in coastal areas. Immediate evacuation recommended.',
      location: { lat: 9.9312, lng: 76.2673, address: 'Fort Kochi, Kerala' },
      reporterId: 'user-456',
      reporterName: 'Priya Menon',
      reporterContact: '+91-9876543211',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      status: 'pending'
    },
    {
      id: 'RPT-003',
      title: 'Storm approaching Visakhapatnam',
      type: 'storm',
      urgency: 'medium',
      description: 'Dark clouds and strong winds observed. Fishermen advised to return to harbor.',
      location: { lat: 17.6868, lng: 83.2185, address: 'Visakhapatnam, Andhra Pradesh' },
      reporterId: 'user-789',
      reporterName: 'Kumar Reddy',
      reporterContact: '+91-9876543212',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'resolved'
    }
  ]);

  const [activeAlerts, setActiveAlerts] = useState<AlertType[]>([
    {
      id: 'ALERT-001',
      title: 'Cyclone Warning',
      message: 'Cyclone Biparjoy approaching Gujarat coast. All fishing activities suspended.',
      type: 'urgent',
      area: 'Gujarat Coast',
      timestamp: new Date(),
      isActive: true
    },
    {
      id: 'ALERT-002',
      title: 'High Tide Alert',
      message: 'Higher than normal tides expected along Mumbai coastline.',
      type: 'warning',
      area: 'Mumbai',
      timestamp: new Date(),
      isActive: true
    }
  ]);

  const statistics: Statistics = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    activeAlerts: activeAlerts.length,
    recentReports: reports
  };

  // User type switcher for demo (in real app, this would be determined by authentication)
  useEffect(() => {
    if (userType === 'citizen') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('overview');
    }
  }, [userType]);

  const handleSubmitReport = (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      timestamp: new Date(),
      status: 'pending'
    };

    setReports(prev => [newReport, ...prev]);
    setActiveTab('dashboard');
    
    toast({
      title: "Report Submitted",
      description: "Your hazard report has been submitted successfully and is under review.",
    });
  };

  const handleVerifyReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'verified' as const, verifiedBy: 'Officer Kumar' }
        : report
    ));
    setShowReportModal(false);
    
    toast({
      title: "Report Verified",
      description: "The report has been verified and marked as confirmed.",
    });
  };

  const handleRejectReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: 'rejected' as const, verificationNotes: 'Unable to verify the reported conditions.' }
        : report
    ));
    setShowReportModal(false);
    
    toast({
      title: "Report Rejected",
      description: "The report has been rejected and marked as unverified.",
      variant: "destructive"
    });
  };

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const renderContent = () => {
    if (userType === 'citizen') {
      switch (activeTab) {
        case 'quickReport':
          return (
            <QuickReportForm
              language="en"
              onSubmit={handleSubmitReport}
              onCancel={() => setActiveTab('dashboard')}
            />
          );
        case 'map':
          return (
            <InteractiveMap
              language="en"
              userType={userType}
              reports={reports}
              onMarkerClick={handleMarkerClick}
            />
          );
        case 'myReports':
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">My Reports</h2>
              <div className="space-y-4">
                {reports.filter(r => r.reporterId.includes('user')).map(report => (
                  <div key={report.id} className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                       onClick={() => handleMarkerClick(report)}>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.location.address}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(report.timestamp).toLocaleDateString()} • Status: {report.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'alerts':
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
              <div className="space-y-4">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-4 border border-medium rounded-lg bg-medium/5">
                    <h3 className="font-semibold text-medium">{alert.title}</h3>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {alert.area} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        default:
          return (
            <CitizenDashboard
              language="en"
              onQuickReport={() => setActiveTab('quickReport')}
              onViewMap={() => setActiveTab('map')}
              recentReports={reports.filter(r => r.reporterId.includes('user'))}
              activeAlerts={activeAlerts}
            />
          );
      }
    } else {
      // Government Official views
      switch (activeTab) {
        case 'reports':
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Manage Reports</h2>
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                       onClick={() => handleMarkerClick(report)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.location.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported by {report.reporterName} • {new Date(report.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          report.status === 'pending' ? 'bg-medium text-white' :
                          report.status === 'verified' ? 'bg-resolved text-white' :
                          report.status === 'rejected' ? 'bg-destructive text-white' :
                          'bg-primary text-white'
                        }`}>
                          {report.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{report.urgency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'map':
          return (
            <InteractiveMap
              language="en"
              userType={userType}
              reports={reports}
              onMarkerClick={handleMarkerClick}
            />
          );
        case 'broadcast':
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Broadcast Alert</h2>
              <p className="text-muted-foreground">Alert broadcasting system will be implemented here.</p>
            </div>
          );
        case 'analytics':
          return (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Analytics</h2>
              <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
            </div>
          );
        default:
          return (
            <GovernmentDashboard
              language="en"
              statistics={statistics}
              onBroadcastAlert={() => setActiveTab('broadcast')}
              onViewReports={() => setActiveTab('reports')}
              onViewMap={() => setActiveTab('map')}
            />
          );
      }
    }
  };

  return (
    <>
      <MainLayout
        userType={userType}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </MainLayout>

      {/* Demo User Type Switcher */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card border rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2">Demo Mode:</p>
          <div className="flex gap-1">
            <button
              onClick={() => setUserType('citizen')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                userType === 'citizen' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => setUserType('official')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                userType === 'official' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Official
            </button>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        language="en"
        userType={userType}
        onVerify={handleVerifyReport}
        onReject={handleRejectReport}
      />
    </>
  );
};

export default Index;
