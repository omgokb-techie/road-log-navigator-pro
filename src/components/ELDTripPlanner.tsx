import React, { useState } from 'react';
import TripPlanningForm from './TripPlanningForm';
import RouteMap from './RouteMap';
import ELDLogSheet from './ELDLogSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, FileText } from 'lucide-react';
import { TripData } from '@/types/types';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ELDTripPlanner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setTripData] = useState<TripData | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [logSheets, setLogSheets] = useState<any[]>([]);

  const handleTripSubmit = async (data: TripData) => {
    setIsLoading(true);
    setTripData(data);
    try {
      // Replace with your actual backend endpoint
      const response = await axios.post(`${baseUrl}/api/trip-plan`, data);
      // Assuming response.data = { route: ..., logs: ... }
      setRouteData(response.data.route);
      setLogSheets(response.data.logs);
    } catch (error) {
      // Handle error (show toast, etc.)
      setRouteData(null);
      setLogSheets([]);
      console.error('Failed to plan trip:', error);
    }
    setIsLoading(false);
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
          <p>© 2025 ELD Trip Planner - DOT Compliant Route Planning & Electronic Logging</p>
        </footer>
      </div>
    </div>
  );
};

export default ELDTripPlanner;