import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User,
  Upload,
  Navigation,
  CheckCircle,
  Waves,
  Wind,
  Zap,
  Droplets
} from 'lucide-react';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface QuickReportFormProps {
  language: 'en' | 'hi';
  onSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  onCancel: () => void;
}

const QuickReportForm: React.FC<QuickReportFormProps> = ({
  language,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: '' as Report['type'],
    urgency: '' as Report['urgency'],
    description: '',
    reporterName: '',
    reporterContact: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    }
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationObtained, setLocationObtained] = useState(false);

  const translations = {
    en: {
      quickReport: 'Quick Hazard Report',
      reportDesc: 'Report marine hazards to help keep everyone safe',
      hazardType: 'Hazard Type',
      selectType: 'Select hazard type',
      flood: 'Coastal Flood',
      storm: 'Storm/Cyclone',
      tsunami: 'Tsunami Warning',
      surge: 'Storm Surge',
      other: 'Other Maritime Hazard',
      urgency: 'Urgency Level',
      selectUrgency: 'Select urgency',
      low: 'Low - Monitor',
      medium: 'Medium - Caution',
      high: 'High - Warning', 
      urgent: 'Urgent - Immediate Action',
      title: 'Brief Title',
      titlePlaceholder: 'e.g., High waves near fishing dock',
      description: 'Description',
      descPlaceholder: 'Provide details about the hazard...',
      yourName: 'Your Name',
      namePlaceholder: 'Enter your full name',
      contact: 'Contact Number',
      contactPlaceholder: 'Enter your phone number',
      location: 'Location',
      getLocation: 'Get Current Location',
      locationPlaceholder: 'Getting location...',
      submitReport: 'Submit Report',
      cancel: 'Cancel',
      locationSuccess: 'Location obtained successfully',
      locationError: 'Could not get location',
      submitting: 'Submitting...',
      reportSubmitted: 'Report submitted successfully'
    },
    hi: {
      quickReport: 'त्वरित खतरा रिपोर्ट',
      reportDesc: 'सभी की सुरक्षा के लिए समुद्री खतरों की रिपोर्ट करें',
      hazardType: 'खतरे का प्रकार',
      selectType: 'खतरे का प्रकार चुनें',
      flood: 'तटीय बाढ़',
      storm: 'तूफान/चक्रवात',
      tsunami: 'सुनामी चेतावनी',
      surge: 'तूफानी लहरें',
      other: 'अन्य समुद्री खतरा',
      urgency: 'तात्कालिकता स्तर',
      selectUrgency: 'तात्कालिकता चुनें',
      low: 'कम - निगरानी',
      medium: 'मध्यम - सावधानी',
      high: 'उच्च - चेतावनी',
      urgent: 'तत्काल - तुरंत कार्रवाई',
      title: 'संक्षिप्त शीर्षक',
      titlePlaceholder: 'जैसे, मछली पकड़ने की गोदी के पास ऊंची लहरें',
      description: 'विवरण',
      descPlaceholder: 'खतरे के बारे में विवरण प्रदान करें...',
      yourName: 'आपका नाम',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',
      contact: 'संपर्क नंबर',
      contactPlaceholder: 'अपना फोन नंबर दर्ज करें',
      location: 'स्थान',
      getLocation: 'वर्तमान स्थान प्राप्त करें',
      locationPlaceholder: 'स्थान प्राप्त कर रहे हैं...',
      submitReport: 'रिपोर्ट सबमिट करें',
      cancel: 'रद्द करें',
      locationSuccess: 'स्थान सफलतापूर्वक प्राप्त',
      locationError: 'स्थान प्राप्त नहीं कर सका',
      submitting: 'सबमिट कर रहे हैं...',
      reportSubmitted: 'रिपोर्ट सफलतापूर्वक सबमिट की गई'
    }
  };

  const t = translations[language];

  const hazardTypes = [
    { value: 'flood', label: t.flood, icon: <Droplets className="h-4 w-4" /> },
    { value: 'storm', label: t.storm, icon: <Wind className="h-4 w-4" /> },
    { value: 'tsunami', label: t.tsunami, icon: <Zap className="h-4 w-4" /> },
    { value: 'surge', label: t.surge, icon: <Waves className="h-4 w-4" /> },
    { value: 'other', label: t.other, icon: <AlertTriangle className="h-4 w-4" /> }
  ];

  const urgencyLevels = [
    { value: 'low', label: t.low, color: 'bg-resolved' },
    { value: 'medium', label: t.medium, color: 'bg-medium' },
    { value: 'high', label: t.high, color: 'bg-medium' },
    { value: 'urgent', label: t.urgent, color: 'bg-urgent' }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: t.locationError,
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // In a real app, you'd use reverse geocoding API
          const address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: address
            }
          }));
          
          setLocationObtained(true);
          setIsGettingLocation(false);
          
          toast({
            title: "Success",
            description: t.locationSuccess,
          });
        } catch (error) {
          setIsGettingLocation(false);
          toast({
            title: "Error", 
            description: t.locationError,
            variant: "destructive"
          });
        }
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Error",
          description: t.locationError,
          variant: "destructive"
        });
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.urgency || !formData.reporterName || !formData.reporterContact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!locationObtained) {
      toast({
        title: "Error", 
        description: "Please get your current location",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      ...formData,
      reporterId: 'user-' + Date.now(),
    });

    toast({
      title: "Success",
      description: t.reportSubmitted,
    });
  };

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-6 w-6" />
            {t.quickReport}
          </CardTitle>
          <CardDescription>{t.reportDesc}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hazard Type */}
            <div className="space-y-2">
              <Label htmlFor="type">{t.hazardType} *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Report['type'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectType} />
                </SelectTrigger>
                <SelectContent>
                  {hazardTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Urgency Level */}
            <div className="space-y-2">
              <Label htmlFor="urgency">{t.urgency} *</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as Report['urgency'] }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectUrgency} />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t.title} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t.titlePlaceholder}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t.descPlaceholder}
                rows={3}
              />
            </div>

            {/* Reporter Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.yourName} *</Label>
                <Input
                  id="name"
                  value={formData.reporterName}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                  placeholder={t.namePlaceholder}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">{t.contact} *</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.reporterContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
                  placeholder={t.contactPlaceholder}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>{t.location} *</Label>
              <div className="flex gap-2">
                <Input
                  value={locationObtained ? formData.location.address : ''}
                  placeholder={isGettingLocation ? t.locationPlaceholder : 'Location not obtained'}
                  disabled
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="whitespace-nowrap"
                >
                  {isGettingLocation ? (
                    <>
                      <Navigation className="h-4 w-4 mr-2 animate-spin" />
                      Getting...
                    </>
                  ) : locationObtained ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-resolved" />
                      Update
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      {t.getLocation}
                    </>
                  )}
                </Button>
              </div>
              {locationObtained && (
                <Alert className="bg-resolved/10 border-resolved">
                  <CheckCircle className="h-4 w-4 text-resolved" />
                  <AlertDescription className="text-resolved-foreground">
                    {t.locationSuccess}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover"
                disabled={isGettingLocation}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t.submitReport}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                {t.cancel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickReportForm;