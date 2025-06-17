import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Truck, Route } from 'lucide-react';
import LocationCombobox from './LocationCombobox';
import { LocationFeature, TripData } from '@/types/types';

interface TripPlanningFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const TripPlanningForm: React.FC<TripPlanningFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<TripData>({
    currentLocation: null,
    pickupLocation: null,
    dropoffLocation: null,
    currentCycleUsed: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TripData, value: LocationFeature | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-trucking-200">
      <CardHeader className="bg-gradient-to-r from-trucking-600 to-trucking-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Truck className="h-6 w-6" />
          ELD Trip Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentLocation" className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-trucking-600" />
                Current Location
              </Label>
              <LocationCombobox
                value={formData.currentLocation}
                onChange={(value) => handleInputChange('currentLocation', value)}
                placeholder="Enter current location"
                icon={<MapPin className="h-4 w-4 text-trucking-600" />}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCycleUsed" className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4 text-trucking-600" />
                Current Cycle Used (Hrs)
              </Label>
              <Input
                id="currentCycleUsed"
                type="number"
                min="0"
                max="70"
                step="0.5"
                placeholder="0.0"
                value={formData.currentCycleUsed}
                onChange={(e) => handleInputChange('currentCycleUsed', parseFloat(e.target.value) || 0)}
                className="border-trucking-200 focus:border-trucking-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupLocation" className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-green-600" />
              Pickup Location
            </Label>
            <LocationCombobox
              value={formData.pickupLocation}
              onChange={(value) => handleInputChange('pickupLocation', value)}
              placeholder="Enter pickup location"
              icon={<MapPin className="h-4 w-4 text-green-600" />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffLocation" className="flex items-center gap-2 font-medium">
              <MapPin className="h-4 w-4 text-red-600" />
              Dropoff Location
            </Label>
            <LocationCombobox
              value={formData.dropoffLocation}
              onChange={(value) => handleInputChange('dropoffLocation', value)}
              placeholder="Enter dropoff location"
              icon={<MapPin className="h-4 w-4 text-red-600" />}
            />
          </div>

          <div className="bg-trucking-50 p-4 rounded-lg border border-trucking-200">
            <h4 className="font-medium text-trucking-800 mb-2">Compliance Assumptions</h4>
            <ul className="text-sm text-trucking-700 space-y-1">
              <li>• Property-carrying driver (70hrs/8days cycle)</li>
              <li>• No adverse driving conditions</li>
              <li>• Fueling required every 1,000 miles</li>
              <li>• Standard DOT regulations apply</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-trucking-600 hover:bg-trucking-700 text-white py-3 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Planning Route...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Plan Trip & Generate ELD Logs
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripPlanningForm;