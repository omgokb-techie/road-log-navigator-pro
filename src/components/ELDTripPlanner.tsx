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
      const response = await axios.post(`${baseUrl}/api/trip/route/`, data);
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
          {/* {(routeData || logSheets.length > 0) && (
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
          )} */}
          {routeData && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Route Summary</h2>
              <div className="mb-2">Distance: <b>{routeData.distance} miles</b></div>
              <div className="mb-2">Estimated Duration: <b>{routeData.duration} hours</b></div>
              <div className="mb-4">
                <h3 className="font-semibold">Fuel Stops</h3>
                <ul className="list-disc ml-6">
                  {routeData.fuelStops.map((stop: any, idx: number) => (
                    <li key={idx}>
                      <b>{stop.name}</b> at {stop.location} (Mile {stop.distanceFromStart})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Rest Stops</h3>
                <ul className="list-disc ml-6">
                  {routeData.restStops.map((stop: any, idx: number) => (
                    <li key={idx}>
                      {stop.location} ({stop.type}, {stop.duration} hrs, Mile {stop.distanceFromStart})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {logSheets.length > 0 && (
            <div className="space-y-8">
              {logSheets.map((sheet, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Log Sheet for {sheet.date}
                  </h2>
                  <div className="mb-2">Driver: <b>{sheet.driverName}</b></div>
                  <div className="mb-2">Truck #: <b>{sheet.truckNumber}</b></div>
                  <div className="mb-2">Total Driving: <b>{sheet.totalDriving} hrs</b></div>
                  <div className="mb-4">Total On Duty: <b>{sheet.totalOnDuty} hrs</b></div>
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Time</th>
                        <th className="border px-2 py-1">Status</th>
                        <th className="border px-2 py-1">Location</th>
                        <th className="border px-2 py-1">Odometer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.logs.map((log: any, i: number) => (
                        <tr key={i}>
                          <td className="border px-2 py-1">{log.time}</td>
                          <td className="border px-2 py-1">{log.status}</td>
                          <td className="border px-2 py-1">
                            {typeof log.location === 'string'
                              ? log.location
                              : [
                                log.location.properties?.name,
                                log.location.properties?.city,
                                log.location.properties?.state,
                                log.location.properties?.country,
                                log.location.properties?.postcode,
                              ]
                                .filter(Boolean)
                                .join(', ') || 'Unknown'}
                          </td>
                          <td className="border px-2 py-1">{log.odometer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
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