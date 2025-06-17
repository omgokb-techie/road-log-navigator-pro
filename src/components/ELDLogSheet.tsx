
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import jsPDF from 'jspdf';

interface LogEntry {
  time: string;
  status: 'driving' | 'on-duty' | 'sleeper' | 'off-duty';
  location: string;
  odometer: number;
  remarks?: string;
}

interface ELDLogSheetProps {
  date: string;
  driverName?: string;
  coDriverName?: string;
  truckNumber?: string;
  logs: LogEntry[];
  totalDriving: number;
  totalOnDuty: number;
  totalMiles?: number;
  carrierName?: string;
  carrierAddress?: string;
}

const ELDLogSheet: React.FC<ELDLogSheetProps> = ({
  date,
  driverName = "John Doe",
  coDriverName = "",
  truckNumber = "TRK001",
  logs,
  totalDriving,
  totalOnDuty,
  totalMiles = 450,
  carrierName = "ABC Trucking Co.",
  carrierAddress = "123 Main St, City, State 12345"
}) => {
  // Generate hourly grid (24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Convert logs to grid format for visual representation
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
      case 'off-duty': return 'bg-white border border-gray-800';
      default: return 'bg-white';
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DRIVER\'S RECORD OF DUTY STATUS', 148, 20, { align: 'center' });
    
    // Add date and driver info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${date}`, 20, 35);
    pdf.text(`Driver: ${driverName}`, 20, 45);
    pdf.text(`Truck: ${truckNumber}`, 20, 55);
    pdf.text(`Total Miles: ${totalMiles}`, 150, 35);
    pdf.text(`Carrier: ${carrierName}`, 150, 45);
    
    // Add time grid headers
    let startX = 20;
    let startY = 80;
    
    // Hour headers
    for (let i = 0; i < 24; i++) {
      pdf.text(i.toString().padStart(2, '0'), startX + (i * 10), startY - 5);
    }
    
    // Status rows
    const statusLabels = ['1. Off Duty', '2. Sleeper Berth', '3. Driving', '4. On Duty (Not Driving)'];
    const statusTypes = ['off-duty', 'sleeper', 'driving', 'on-duty'];
    
    statusLabels.forEach((label, rowIndex) => {
      const y = startY + (rowIndex * 15);
      pdf.text(label, 20, y);
      
      // Draw grid boxes for each hour
      for (let hour = 0; hour < 24; hour++) {
        const x = startX + (hour * 10);
        pdf.rect(x, y - 10, 8, 10);
        
        // Fill if this status is active at this hour
        if (getStatusAtHour(hour) === statusTypes[rowIndex]) {
          pdf.setFillColor(0, 0, 0);
          pdf.rect(x, y - 10, 8, 10, 'F');
        }
      }
    });
    
    // Add totals
    pdf.text(`Total Driving Hours: ${totalDriving}`, 20, startY + 80);
    pdf.text(`Total On-Duty Hours: ${totalOnDuty}`, 20, startY + 90);
    
    // Add signature line
    pdf.text('Driver\'s Signature: ________________________', 20, startY + 110);
    
    return pdf;
  };

  const handlePreview = () => {
    const pdf = generatePDF();
    const pdfDataUri = pdf.output('datauristring');
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>
      `);
    }
  };

  const handleDownload = () => {
    const pdf = generatePDF();
    pdf.save(`eld-log-${date}-${driverName.replace(/\s+/g, '-')}.pdf`);
  };

  const renderGridRow = (label: string, status: string) => (
    <div className="flex border-b border-gray-600">
      <div className="w-40 border-r border-gray-600 p-2 text-xs font-medium bg-gray-50 flex items-center">
        {label}
      </div>
      <div className="flex flex-1">
        {hours.map(hour => (
          <div 
            key={hour} 
            className={`flex-1 h-8 border-r border-gray-300 ${
              getStatusAtHour(hour) === status ? getStatusColor(status) : 'bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto bg-white border-2 border-black p-6 text-sm">
      {/* PDF Actions */}
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={handlePreview} variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview PDF
        </Button>
        <Button onClick={handleDownload} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold mb-2">DRIVER'S RECORD OF DUTY STATUS</h1>
        <div className="text-xs text-gray-600">
          FOR 24 HOUR PERIOD STARTING WITH MIDNIGHT
        </div>
      </div>

      {/* Driver Information Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div className="flex">
            <span className="w-20 font-semibold">Date:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{date}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold">Driver:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{driverName}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold">Co-Driver:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{coDriverName}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold">Truck No:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{truckNumber}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex">
            <span className="w-32 font-semibold">Total Miles:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{totalMiles}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold">Carrier:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{carrierName}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold">Address:</span>
            <span className="border-b border-gray-400 flex-1 px-2">{carrierAddress}</span>
          </div>
        </div>
      </div>

      {/* Time Grid */}
      <div className="mb-6">
        {/* Hour headers */}
        <div className="flex border-b-2 border-gray-600 mb-1">
          <div className="w-40 p-2 font-bold">DUTY STATUS</div>
          <div className="flex flex-1">
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-xs text-center font-bold py-1 border-r border-gray-300">
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Midnight indicator */}
        <div className="flex mb-2">
          <div className="w-40"></div>
          <div className="flex flex-1">
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-xs text-center border-r border-gray-300">
                {hour === 0 || hour === 12 ? 'MIDNIGHT' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Status rows */}
        {renderGridRow('1. OFF DUTY', 'off-duty')}
        {renderGridRow('2. SLEEPER BERTH', 'sleeper')}
        {renderGridRow('3. DRIVING', 'driving')}
        {renderGridRow('4. ON DUTY (NOT DRIVING)', 'on-duty')}
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
        <div className="border border-gray-600 p-3">
          <div className="font-bold mb-2">TOTAL HOURS</div>
          <div>Driving: <span className="font-mono">{totalDriving.toFixed(1)}</span></div>
          <div>On-Duty: <span className="font-mono">{totalOnDuty.toFixed(1)}</span></div>
          <div>Sleeper: <span className="font-mono">{(24 - totalOnDuty).toFixed(1)}</span></div>
        </div>
        <div className="border border-gray-600 p-3">
          <div className="font-bold mb-2">LOCATION</div>
          <div className="space-y-1">
            <div>From: {logs[0]?.location || '_____________'}</div>
            <div>To: {logs[logs.length - 1]?.location || '_____________'}</div>
          </div>
        </div>
        <div className="border border-gray-600 p-3">
          <div className="font-bold mb-2">ODOMETER</div>
          <div className="space-y-1">
            <div>Start: {logs[0]?.odometer || '_____________'}</div>
            <div>End: {logs[logs.length - 1]?.odometer || '_____________'}</div>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mb-6">
        <div className="font-bold mb-2">REMARKS</div>
        <div className="border border-gray-600 h-20 p-2 text-xs">
          {logs.filter(log => log.remarks).map((log, index) => (
            <div key={index}>{log.time}: {log.remarks}</div>
          ))}
        </div>
      </div>

      {/* Certification */}
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <div className="mb-4">
            <div className="font-bold mb-2">Driver's Signature:</div>
            <div className="border-b border-gray-600 h-8"></div>
          </div>
          <div>
            <span className="font-bold">Date:</span>
            <span className="border-b border-gray-600 ml-2 px-4">{date}</span>
          </div>
        </div>
        <div className="text-xs">
          <div className="font-bold mb-2">CERTIFICATION</div>
          <div className="leading-relaxed">
            I certify that my duty status time as recorded above is true and correct.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELDLogSheet;
