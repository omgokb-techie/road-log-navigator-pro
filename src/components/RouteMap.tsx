
import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Fuel, Clock } from 'lucide-react';

interface RouteMapProps {
  route?: {
    distance: number;
    duration: number;
    fuelStops: Array<{
      name: string;
      location: string;
      distanceFromStart: number;
    }>;
    restStops: Array<{
      location: string;
      type: 'break' | 'rest';
      duration: number;
      distanceFromStart: number;
    }>;
  };
}

const RouteMap: React.FC<RouteMapProps> = ({ route }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Placeholder map implementation - in real app would integrate with mapping service
  useEffect(() => {
    if (!mapRef.current || !route) return;

    // This would be replaced with actual map integration (Google Maps, Mapbox, etc.)
    console.log('Route data:', route);
  }, [route]);

  if (!route) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter trip details to see route planning</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-trucking-600 to-trucking-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Route Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map placeholder */}
        <div 
          ref={mapRef}
          className="h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center border-b"
        >
          <div className="text-center text-gray-600">
            <Navigation className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Interactive Map</p>
            <p className="text-sm">Route visualization will be displayed here</p>
          </div>
        </div>

        {/* Route details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-trucking-50 rounded-lg">
              <div className="text-2xl font-bold text-trucking-700">{route.distance}</div>
              <div className="text-sm text-trucking-600">Miles</div>
            </div>
            <div className="text-center p-3 bg-trucking-50 rounded-lg">
              <div className="text-2xl font-bold text-trucking-700">{Math.round(route.duration)}</div>
              <div className="text-sm text-trucking-600">Hours</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{route.fuelStops.length}</div>
              <div className="text-sm text-green-600">Fuel Stops</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{route.restStops.length}</div>
              <div className="text-sm text-amber-600">Rest Stops</div>
            </div>
          </div>

          {/* Fuel stops */}
          {route.fuelStops.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Fuel className="h-4 w-4 text-green-600" />
                Planned Fuel Stops
              </h4>
              <div className="space-y-2">
                {route.fuelStops.map((stop, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="font-medium text-green-800">{stop.name}</div>
                      <div className="text-sm text-green-600">{stop.location}</div>
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      Mile {stop.distanceFromStart}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rest stops */}
          {route.restStops.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Required Rest Stops
              </h4>
              <div className="space-y-2">
                {route.restStops.map((stop, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <div className="font-medium text-amber-800 capitalize">{stop.type} Stop</div>
                      <div className="text-sm text-amber-600">{stop.location}</div>
                    </div>
                    <div className="text-sm text-amber-700 font-medium">
                      {stop.duration}h @ Mile {stop.distanceFromStart}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteMap;
