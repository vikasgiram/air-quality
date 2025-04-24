import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import GaugeChart from 'react-gauge-chart';

const socket = io('http://localhost:5000');

function HomeAirQuality() {
  const [ppmData, setPpmData] = useState({ ppm: null, status: 'Unknown' });

  useEffect(() => {
    socket.on('ppmUpdate', (data) => {
      setPpmData(data);
    });

    return () => {
      socket.off('ppmUpdate');
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Home Air Quality</h2>
      <div className="text-center">
        {ppmData.ppm !== null ? (
          <>
            <GaugeChart
              id="ppm-gauge"
              nrOfLevels={20}
              percent={ppmData.ppm / 2000}
              arcsLength={[0.5, 0.25, 0.25]}
              colors={['#10b981', '#facc15', '#ef4444']}
              needleColor="#1e40af"
              textColor="#1f2937"
              formatTextValue={() => `${ppmData.ppm.toFixed(2)} PPM`}
            />
            <p className={`text-lg font-medium ${ppmData.status === 'Good' ? 'text-green-500' : 'text-red-500'} mt-4`}>
              Status: <span className="font-bold">{ppmData.status}</span>
            </p>
          </>
        ) : (
          <p className="text-lg text-gray-600">Waiting for data...</p>
        )}
      </div>
    </div>
  );
}

export default HomeAirQuality;