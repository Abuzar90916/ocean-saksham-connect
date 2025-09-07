import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle,
  Waves,
  Wind,
  Zap,
  Droplets
} from 'lucide-react';
import { Report } from '@/types';
import { cn } from '@/lib/utils';

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  userType: 'citizen' | 'official';
  onVerify?: (reportId: string) => void;
  onReject?: (reportId: string) => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  language,
  userType,
  onVerify,
  onReject
}) => {
  if (!report) return null;

  const translations = {
    en: {
      reportDetails: 'Report Details',
      hazardInfo: 'Hazard Information',
      reporterInfo: 'Reporter Information',
      location: 'Location',
      reportedAt: 'Reported At',
      status: 'Status',
      urgency: 'Urgency Level',
      type: 'Hazard Type',
      description: 'Description',
      reporter: 'Reporter',
      contact: 'Contact',
      actions: 'Actions',
      verify: 'Verify Report',
      reject: 'Reject Report',
      close: 'Close',
      // Hazard types
      flood: 'Coastal Flood',
      storm: 'Storm/Cyclone',
      tsunami: 'Tsunami Warning',
      surge: 'Storm Surge',
      other: 'Other Maritime Hazard',
      // Status
      pending: 'Pending Review',
      verified: 'Verified',
      rejected: 'Rejected',
      resolved: 'Resolved'
    },
    hi: {
      reportDetails: 'रिपोर्ट विवरण',
      hazardInfo: 'खतरे की जानकारी',
      reporterInfo: 'रिपोर्टर की जानकारी',
      location: 'स्थान',
      reportedAt: 'रिपोर्ट किया गया',
      status: 'स्थिति',
      urgency: 'तात्कालिकता स्तर',
      type: 'खतरे का प्रकार',
      description: 'विवरण',
      reporter: 'रिपोर्टर',
      contact: 'संपर्क',
      actions: 'कार्य',
      verify: 'रिपोर्ट सत्यापित करें',
      reject: 'रिपोर्ट अस्वीकार करें',
      close: 'बंद करें',
      // Hazard types
      flood: 'तटीय बाढ़',
      storm: 'तूफान/चक्रवात',
      tsunami: 'सुनामी चेतावनी',
      surge: 'तूफानी लहरें',
      other: 'अन्य समुद्री खतरा',
      // Status
      pending: 'समीक्षा के लिए लंबित',
      verified: 'सत्यापित',
      rejected: 'अस्वीकृत',
      resolved: 'हल हो गया'
    }
  };

  const t = translations[language];

  const getHazardIcon = (type: Report['type']) => {
    switch (type) {
      case 'flood':
        return <Droplets className="h-4 w-4" />;
      case 'storm':
        return <Wind className="h-4 w-4" />;
      case 'tsunami':
        return <Zap className="h-4 w-4" />;
      case 'surge':
        return <Waves className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: Report['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-urgent text-urgent-foreground';
      case 'high':
        return 'bg-medium text-medium-foreground';
      case 'medium':
        return 'bg-medium text-medium-foreground';
      default:
        return 'bg-resolved text-resolved-foreground';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-resolved text-resolved-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      case 'resolved':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-medium text-medium-foreground';
    }
  };

  const getHazardTypeLabel = (type: Report['type']) => {
    const typeMap = {
      flood: t.flood,
      storm: t.storm,
      tsunami: t.tsunami,
      surge: t.surge,
      other: t.other
    };
    return typeMap[type] || t.other;
  };

  const getStatusLabel = (status: Report['status']) => {
    const statusMap = {
      pending: t.pending,
      verified: t.verified,
      rejected: t.rejected,
      resolved: t.resolved
    };
    return statusMap[status] || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getHazardIcon(report.type)}
            {t.reportDetails}
          </DialogTitle>
          <DialogDescription>
            Report ID: {report.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Urgency Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge className={cn("text-xs", getUrgencyColor(report.urgency))}>
              {report.urgency.toUpperCase()}
            </Badge>
            <Badge className={cn("text-xs", getStatusColor(report.status))}>
              {getStatusLabel(report.status)}
            </Badge>
          </div>

          {/* Hazard Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t.hazardInfo}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.type}</p>
                  <p className="flex items-center gap-2">
                    {getHazardIcon(report.type)}
                    {getHazardTypeLabel(report.type)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p className="font-medium">{report.title}</p>
                </div>
                
                {report.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.description}</p>
                    <p className="text-sm leading-relaxed">{report.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t.location}
              </h3>
              
              <div className="space-y-2">
                <p className="text-sm">{report.location.address}</p>
                <p className="text-xs text-muted-foreground">
                  Coordinates: {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reporter Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                {t.reporterInfo}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{report.reporterName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{report.reporterContact}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(report.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Notes (if any) */}
          {report.verificationNotes && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Verification Notes</h3>
                <p className="text-sm text-muted-foreground">{report.verificationNotes}</p>
                {report.verifiedBy && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Verified by: {report.verifiedBy}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {userType === 'official' && report.status === 'pending' && (
            <>
              <Button
                onClick={() => onVerify?.(report.id)}
                className="flex-1 bg-resolved hover:bg-resolved/90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t.verify}
              </Button>
              
              <Button
                onClick={() => onReject?.(report.id)}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t.reject}
              </Button>
            </>
          )}
          
          <Button
            onClick={onClose}
            variant="outline"
            className={cn(
              userType === 'official' && report.status === 'pending' 
                ? "w-auto px-6" 
                : "flex-1"
            )}
          >
            {t.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailModal;