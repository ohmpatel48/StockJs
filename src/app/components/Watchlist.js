"use client";
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, LinearScale, CategoryScale, LineElement, PointElement, LineController, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // To support date formats
import { format } from 'date-fns';
import fetchStockPrices from "@/app/utils/stockApi";

// Register necessary components
ChartJS.register(LinearScale, CategoryScale, LineElement, PointElement, LineController, Tooltip, Legend, TimeScale);

export default function Watchlist({ selectedStock }) {
  const [historicalData, setHistoricalData] = useState([]);
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStock) {
        const data = await fetchStockPrices(selectedStock, timeframe);
        setHistoricalData(data.historicalData);
      }
    };
    fetchData();
  }, [selectedStock, timeframe]);

  const formatXLabels = (datetime) => {
    if (timeframe === '1d') {
      return format(new Date(datetime), 'HH:mm'); // Show hours and minutes for 1d
    } else if (timeframe === '1w' || timeframe === '1m') {
      return format(new Date(datetime), 'MMM d'); // Show month and day for 1w
    } else if (['6m', '1y', 'all'].includes(timeframe)) {
      return format(new Date(datetime), 'MMM yyyy'); // Show month and year for longer intervals
    }
    return datetime;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 className='bold text-2xl text-[#60bfbe] '>{selectedStock}</h2>
      <div style={{ width: '100%', flex: 1 }} >
        <div style={{ marginBottom: '20px' }} className='flex justify-end flex-row '>
          {['1d', '1w', '1m', '6m', '1y', 'all'].map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              style={{
                margin: '0 5px',
                padding: '10px',
                backgroundColor: timeframe === time ? '#60bfbe' : '#e0e0e0',
                color: timeframe === time ? '#fff' : '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {time === 'all' ? 'All Time' : time}
            </button>
          ))}
        </div>

        {selectedStock && historicalData.length > 0 ? (
          <div style={{ marginBottom: '20px', width: '100%', height: '400px' }}>
            <Line
              data={{
                labels: historicalData.flat().reverse().map(data => formatXLabels(data.datetime)), // Use formatted datetime for x-axis
                datasets: [
                  {
                    data: historicalData.flat().reverse().map(data => data.close), // Map close prices for y-axis
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 0,
                    pointStyle: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'category',
                    title: {
                      display: true,
                      text: 'Date', // Adding title for the x-axis
                    },
                    ticks: {
                      maxTicksLimit: 10, // Limit the number of labels
                    },
                  },
                  y: {
                    type: 'linear',
                    beginAtZero: false,
                    title: {
                      display: true,
                      text: 'Price ($)', // Adding title for the y-axis
                    },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p>No data available for the selected stock</p>
        )}
      </div>
    </div>
  );
}
