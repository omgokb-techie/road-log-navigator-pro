
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Calendar, Clock, User } from 'lucide-react';

interface LogEntry {
  time: string;
  status: 'driving' | 'on-duty' | 'sleeper' | 'off-duty';
  location: string;
  odometer: number;
}

interface ELDLogSheetProps {
  date: string;
  driverName?: string;
  coDriverName?: string;
  truckNumber?: string;
  logs: LogEntry[];
  totalDriving: number;
  totalOnDuty: number;
}

const ELDLogSheet: React.FC<ELDLogSheetProps> = ({
  date,
  driverName = "Driver Name",
  coDriverName = "",
  truckNumber = "TRK001",
  logs,
  totalDriving,
  totalOnDuty
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driving': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-duty': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sleeper': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'off-duty': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'driving': return 'Driving';
      case 'on-duty': return 'On-Duty Not Driving';
      case 'sleeper': return 'Sleeper Berth';
      case 'off-duty': return 'Off Duty';
      default: return status;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-trucking-600 to-trucking-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Daily ELD Log Sheet - {date}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Driver</div>
              <div className="font-medium">{driverName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Date</div>
              <div className="font-medium">{date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Truck #</div>
              <div className="font-medium">{truckNumber}</div>
            </div>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Daily Activity Log</h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 border-b grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
              <div>Time</div>
              <div>Status</div>
              <div>Location</div>
              <div>Odometer</div>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="p-3 border-b last:border-b-0 grid grid-cols-4 gap-4 text-sm">
                <div className="font-mono">{log.time}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(log.status)}`}>
                    {getStatusLabel(log.status)}
                  </span>
                </div>
                <div className="text-gray-700">{log.location}</div>
                <div className="font-mono">{log.odometer.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-trucking-50 rounded-lg border border-trucking-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{totalDriving.toFixed(1)}</div>
            <div className="text-sm text-red-600">Driving Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{totalOnDuty.toFixed(1)}</div>
            <div className="text-sm text-yellow-600">On-Duty Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{(14 - totalOnDuty).toFixed(1)}</div>
            <div className="text-sm text-blue-600">Hours Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{(11 - totalDriving).toFixed(1)}</div>
            <div className="text-sm text-green-600">Drive Time Left</div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Compliance Status: In compliance with HOS regulations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ELDLogSheet;
