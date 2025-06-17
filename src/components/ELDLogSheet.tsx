
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

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
  // Generate hourly grid (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Convert logs to grid format
  const getStatusAtHour = (hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const log = logs.find(log => log.time === timeString);
    return log?.status || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driving': return 'bg-black';
      case 'on-duty': return 'bg-red-600';
      case 'sleeper': return 'bg-blue-600';
      case 'off-duty': return 'bg-white border-gray-400';
      default: return 'bg-gray-100';
    }
  };

  const renderGridRow = (label: string, status: string) => (
    <div className="grid grid-cols-25 gap-0 border-b border-gray-400">
      <div className="col-span-1 border-r border-gray-400 p-1 text-xs font-medium bg-gray-50 flex items-center">
        {label}
      </div>
      {hours.map(hour => (
        <div 
          key={hour} 
          className={`h-6 border-r border-gray-300 ${
            getStatusAtHour(hour) === status ? getStatusColor(status) : 'bg-white'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border-2 border-black p-4 text-sm font-mono">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">Driver's Daily Log</h1>
        <div className="grid grid-cols-4 gap-4 mt-2">
          <div>
            <span className="font-bold">Date:</span> {date}
          </div>
          <div>
            <span className="font-bold">From:</span> ________________
          </div>
          <div>
            <span className="font-bold">To:</span> ________________
          </div>
          <div>
            <span className="font-bold">Driver:</span> {driverName}
          </div>
        </div>
      </div>

      {/* Mileage Section */}
      <div className="grid grid-cols-4 gap-4 mb-4 p-2 border border-gray-400">
        <div>
          <div className="font-bold text-center">Total Miles Driving Today</div>
          <div className="border border-gray-400 h-8 mt-1"></div>
        </div>
        <div>
          <div className="font-bold text-center">Total Mileage Today</div>
          <div className="border border-gray-400 h-8 mt-1"></div>
        </div>
        <div>
          <div className="font-bold text-center">Name of Carrier or Carriers</div>
          <div className="border border-gray-400 h-8 mt-1"></div>
        </div>
        <div>
          <div className="font-bold text-center">Main Office Address</div>
          <div className="border border-gray-400 h-8 mt-1"></div>
        </div>
      </div>

      {/* Time Grid */}
      <div className="mb-4">
        {/* Hour headers */}
        <div className="grid grid-cols-25 gap-0 mb-1">
          <div className="col-span-1"></div>
          {hours.map(hour => (
            <div key={hour} className="text-xs text-center font-bold">
              {hour.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
        
        {/* Midnight row */}
        <div className="grid grid-cols-25 gap-0 mb-2">
          <div className="col-span-1 text-xs">Mid.</div>
          {hours.map(hour => (
            <div key={hour} className="text-xs text-center border-l border-gray-300">
              {hour === 0 || hour === 12 ? '|' : ''}
            </div>
          ))}
        </div>

        {/* Status rows */}
        {renderGridRow('1. Off Duty', 'off-duty')}
        {renderGridRow('2. Sleeper Berth', 'sleeper')}
        {renderGridRow('3. Driving', 'driving')}
        {renderGridRow('4. On Duty (Not Driving)', 'on-duty')}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-400"></div>
          <span>Off Duty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600"></div>
          <span>Sleeper Berth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-black"></div>
          <span>Driving</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600"></div>
          <span>On Duty</span>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mb-4">
        <div className="font-bold mb-2">Remarks</div>
        <div className="border border-gray-400 h-16 p-2">
          {/* Remarks content */}
        </div>
      </div>

      {/* Shipping Documents */}
      <div className="mb-4">
        <div className="font-bold mb-2">Shipping Documents:</div>
        <div className="border border-gray-400 h-12 p-2">
          <div className="text-xs">Bill of Lading No:</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="mb-2">
            <span className="font-bold">Driver's Signature:</span> _____________________
          </div>
          <div>
            <span className="font-bold">Date:</span> ___________
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-bold">24 Hour Period:</span> From _______ To _______
          </div>
          <div>
            <span className="font-bold">Total Hours:</span> ___________
          </div>
        </div>
      </div>

      {/* Hours Summary Table */}
      <div className="mt-4 border border-gray-400">
        <div className="grid grid-cols-8 gap-0 text-xs">
          <div className="border-r border-gray-400 p-1 font-bold bg-gray-50">Daily Hours</div>
          <div className="border-r border-gray-400 p-1 text-center">A. Total Hours</div>
          <div className="border-r border-gray-400 p-1 text-center">B. Total Hours</div>
          <div className="border-r border-gray-400 p-1 text-center">C. Total Hours</div>
          <div className="border-r border-gray-400 p-1 text-center">Day Drivers</div>
          <div className="border-r border-gray-400 p-1 text-center">A. Total</div>
          <div className="border-r border-gray-400 p-1 text-center">B. Total</div>
          <div className="p-1 text-center">C. Total</div>
        </div>
        <div className="grid grid-cols-8 gap-0 text-xs border-t border-gray-400">
          <div className="border-r border-gray-400 p-1">Today</div>
          <div className="border-r border-gray-400 p-1 text-center">{totalDriving.toFixed(1)}</div>
          <div className="border-r border-gray-400 p-1 text-center">{totalOnDuty.toFixed(1)}</div>
          <div className="border-r border-gray-400 p-1 text-center">8.0</div>
          <div className="border-r border-gray-400 p-1 text-center">{totalDriving.toFixed(1)}</div>
          <div className="border-r border-gray-400 p-1 text-center">{totalOnDuty.toFixed(1)}</div>
          <div className="border-r border-gray-400 p-1 text-center">8.0</div>
          <div className="p-1 text-center">consecutive</div>
        </div>
      </div>
    </div>
  );
};

export default ELDLogSheet;
