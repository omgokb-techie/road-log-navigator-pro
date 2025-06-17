
import React, { useState } from 'react';
import TripPlanningForm from './TripPlanningForm';
import RouteMap from './RouteMap';
import ELDLogSheet from './ELDLogSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, FileText } from 'lucide-react';

interface TripData {
  currentLocation: string;
  pickupLocation: string;
  dropoffLocation: string;
  currentCycleUsed: number;
}

const ELDTripPlanner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [logSheets, setLogSheets] = useState<any[]>([]);

  const handleTripSubmit = async (data: TripData) => {
    setIsLoading(true);
    setTripData(data);

    // Simulate API call to generate route and logs
    setTimeout(() => {
      // Mock route data
      const mockRoute = {
        distance: 1250,
        duration: 18.5,
        fuelStops: [
          { name: "Flying J Travel Center", location: "Springfield, IL", distanceFromStart: 485 },
          { name: "Love's Travel Stop", location: "Oklahoma City, OK", distanceFromStart: 965 }
        ],
        restStops: [
          { location: "Rest Area - I-70", type: 'break' as const, duration: 0.5, distanceFromStart: 250 },
          { location: "Truck Stop - Kansas City", type: 'rest' as const, duration: 10, distanceFromStart: 750 }
        ]
      };

      // Mock ELD log data
      const mockLogs = [
        {
          date: new Date().toLocaleDateString(),
          driverName: "John Doe",
          truckNumber: "TRK001",
          logs: [
            { time: "06:00", status: 'on-duty' as const, location: data.currentLocation, odometer: 123456 },
            { time: "07:00", status: 'driving' as const, location: "Highway Mile 15", odometer: 123471 },
            { time: "11:00", status: 'on-duty' as const, location: data.pickupLocation, odometer: 123635 },
            { time: "12:00", status: 'driving' as const, location: "Highway Mile 180", odometer: 123651 },
            { time: "16:30", status: 'off-duty' as const, location: "Rest Stop", odometer: 123890 },
            { time: "02:00", status: 'sleeper' as const, location: "Truck Stop", odometer: 123890 },
            { time: "12:00", status: 'on-duty' as const, location: "Truck Stop", odometer: 123890 },
            { time: "13:00", status: 'driving' as const, location: "Highway Mile 480", odometer: 123905 },
            { time: "19:00", status: 'on-duty' as const, location: data.dropoffLocation, odometer: 124155 }
          ],
          totalDriving: 8.5,
          totalOnDuty: 11.0
        }
      ];

      setRouteData(mockRoute);
      setLogSheets(mockLogs);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-trucking-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-trucking-600 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">ELD Trip Planner</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional trip planning with automated ELD logging for DOT compliance and optimal route efficiency
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Trip Planning Form */}
          <div className="animate-fade-in">
            <TripPlanningForm onSubmit={handleTripSubmit} isLoading={isLoading} />
          </div>

          {/* Results Tabs */}
          {(routeData || logSheets.length > 0) && (
            <div className="animate-fade-in">
              <Tabs defaultValue="route" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="route" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Route & Map
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ELD Logs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="route" className="mt-6">
                  <RouteMap route={routeData} />
                </TabsContent>

                <TabsContent value="logs" className="mt-6 space-y-6">
                  {logSheets.map((logSheet, index) => (
                    <ELDLogSheet
                      key={index}
                      date={logSheet.date}
                      driverName={logSheet.driverName}
                      truckNumber={logSheet.truckNumber}
                      logs={logSheet.logs}
                      totalDriving={logSheet.totalDriving}
                      totalOnDuty={logSheet.totalOnDuty}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8">
          <p>© 2024 ELD Trip Planner - DOT Compliant Route Planning & Electronic Logging</p>
        </footer>
      </div>
    </div>
  );
};

export default ELDTripPlanner;
