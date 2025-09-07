import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Filter, 
  AlertTriangle, 
  Waves, 
  Wind, 
  Zap,
  Info,
  Navigation
} from 'lucide-react';
import { MapMarker, Report } from '@/types';
import { cn } from '@/lib/utils';

interface InteractiveMapProps {
  language: 'en' | 'hi';
  userType: 'citizen' | 'official';
  reports: Report[];
  onMarkerClick: (report: Report) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  language,
  userType,
  reports,
  onMarkerClick
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedMarker, setSelectedMarker] = useState<Report | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const translations = {
    en: {
      liveMap: 'Live Hazard Map',
      mapDesc: 'Real-time marine hazard locations',
      filterBy: 'Filter by',
      all: 'All Hazards',
      urgent: 'Urgent',
      high: 'High Priority',
      medium: 'Medium',
      flood: 'Flood',
      storm: 'Storm',
      tsunami: 'Tsunami',
      surge: 'Storm Surge',
      other: 'Other',
      legend: 'Legend',
      myLocation: 'My Location',
      getLocation: 'Get Location',
      reportedBy: 'Reported by',
      timeAgo: 'ago'
    },
    hi: {
      liveMap: 'लाइव खतरा मैप',
      mapDesc: 'वास्तविक समय समुद्री खतरे के स्थान',
      filterBy: 'फ़िल्टर करें',
      all: 'सभी खतरे',
      urgent: 'तत्काल',
      high: 'उच्च प्राथमिकता',
      medium: 'मध्यम',
      flood: 'बाढ़',
      storm: 'तूफान',
      tsunami: 'सुनामी',
      surge: 'तूफानी लहरें',
      other: 'अन्य',
      legend: 'लीजेंड',
      myLocation: 'मेरा स्थान',
      getLocation: 'स्थान प्राप्त करें',
      reportedBy: 'द्वारा रिपोर्ट किया गया',
      timeAgo: 'पहले'
    }
  };

  const t = translations[language];

  // Simulated map data - In real app, this would be from a mapping service
  const mapBounds = {
    north: 23.0,
    south: 8.0,
    east: 97.0,
    west: 68.0
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Default to Mumbai coordinates if location access denied
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    }
  }, []);

  const getUrgencyColor = (urgency: Report['urgency']) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-urgent';
      case 'high':
        return 'bg-medium';
      case 'medium':
        return 'bg-medium';
      default:
        return 'bg-resolved';
    }
  };

  const getHazardIcon = (type: Report['type']) => {
    switch (type) {
      case 'flood':
        return <Waves className="h-3 w-3" />;
      case 'storm':
        return <Wind className="h-3 w-3" />;
      case 'tsunami':
        return <Zap className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'urgent') return report.urgency === 'urgent';
    if (selectedFilter === 'high') return report.urgency === 'high';
    if (selectedFilter === 'medium') return report.urgency === 'medium';
    return report.type === selectedFilter;
  });

  // Calculate position on map (simplified projection)
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {t.liveMap}
              </CardTitle>
              <CardDescription>{t.mapDesc}</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t.filterBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.all}</SelectItem>
                  <SelectItem value="urgent">{t.urgent}</SelectItem>
                  <SelectItem value="high">{t.high}</SelectItem>
                  <SelectItem value="medium">{t.medium}</SelectItem>
                  <SelectItem value="flood">{t.flood}</SelectItem>
                  <SelectItem value="storm">{t.storm}</SelectItem>
                  <SelectItem value="tsunami">{t.tsunami}</SelectItem>
                  <SelectItem value="surge">{t.surge}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-primary/20 rounded-lg overflow-hidden">
            {/* Simulated Ocean Map Background */}
            <div 
              className="w-full h-96 bg-gradient-to-b from-blue-200 to-blue-400 relative"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.2) 0%, transparent 50%),
                  linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.2) 100%)
                `
              }}
            >
              {/* Coastline representation */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M0,100 Q20,80 40,90 T80,85 Q90,80 100,85 L100,100 Z"
                  fill="rgba(34, 197, 94, 0.3)"
                  stroke="rgba(34, 197, 94, 0.5)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,200 Q30,180 60,185 T100,180 L100,200 Z"
                  fill="rgba(34, 197, 94, 0.2)"
                  stroke="rgba(34, 197, 94, 0.4)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* User Location */}
              {userLocation && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    left: `${getMapPosition(userLocation.lat, userLocation.lng).x}%`,
                    top: `${getMapPosition(userLocation.lat, userLocation.lng).y}%`
                  }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
                  </div>
                </div>
              )}

              {/* Report Markers */}
              {filteredReports.map((report) => {
                const position = getMapPosition(report.location.lat, report.location.lng);
                const isSelected = selectedMarker?.id === report.id;
                
                return (
                  <div
                    key={report.id}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-ocean z-20",
                      isSelected && "scale-125"
                    )}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`
                    }}
                    onClick={() => {
                      setSelectedMarker(report);
                      onMarkerClick(report);
                    }}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white",
                      getUrgencyColor(report.urgency)
                    )}>
                      {getHazardIcon(report.type)}
                    </div>
                    
                    {/* Tooltip */}
                    {isSelected && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border rounded-lg shadow-lg p-2 min-w-48 z-30">
                        <p className="font-semibold text-sm">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{report.location.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t.reportedBy} {report.reporterName}
                        </p>
                        <Badge 
                          className={cn(
                            "mt-1 text-xs",
                            report.urgency === 'urgent' ? 'bg-urgent' : 
                            report.urgency === 'high' ? 'bg-medium' : 
                            'bg-resolved'
                          )}
                        >
                          {report.urgency}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">{t.legend}:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-urgent rounded-full"></div>
                <span>{t.urgent}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-medium rounded-full"></div>
                <span>{t.medium}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-resolved rounded-full"></div>
                <span>Resolved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>{t.myLocation}</span>
              </div>
            </div>
            
            <Badge variant="outline" className="text-xs">
              {filteredReports.length} hazard{filteredReports.length !== 1 ? 's' : ''} shown
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMap;