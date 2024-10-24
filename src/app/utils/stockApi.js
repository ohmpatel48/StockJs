export default async function fetchStockPrices(ticker, timeframe = '1d') {
  const API_KEY = "492686d32c784348aa3f517135fb400a";
  const prices = {};
  let historicalData = [];

  // Define the interval based on the timeframe
  let interval = '1min'; // Default interval
  let outputsize = 1; // Default to
  // Determine interval and number of days based on the timeframe
  switch (timeframe) {
    case '1d':
      interval = '1min';
      outputsize = 390; // Fetch data for today
      break;
    case '1w':
      interval = '5min'; // For a week, use 5min intervals
      outputsize = 546;
      break;
    case '1m':
      interval = '30min'; // For a month, use 15min intervals
      outputsize = 312;
      break;
    case '6m':
      interval = '2h'; // For 6 months, use 30min intervals
      outputsize = 504;
      break;
    case '1y':
      interval = '1day'; // For 1 year, use 60min intervals
      outputsize = 252;
      break;
    case 'all':
      interval = '1month';
      outputsize = 5000;
      break;
    default:
      throw new Error('Unsupported timeframe');
  }

  const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&apikey=${API_KEY}&outputsize=${outputsize}`);
  const data = await response.json();
  // console.log(data);
  // Check for intraday time series data
  if (data[`values`]) {
    const timeSeries = data[`values`];
    historicalData = timeSeries;
  } else {
    console.error(`No data found for ${ticker}:`, data);
    throw new Error(`Unable to fetch data for ${ticker}.`);
  }

  return { prices, historicalData };
}

// apiSocket.js

export async function fetchCurrentPrice(ticker) {
  const API_KEY = "492686d32c784348aa3f517135fb400a";

  try {
    const response = await fetch(`https://api.twelvedata.com/price?symbol=${ticker}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.price) {
      const currentPrice = parseFloat(data.price);
      return currentPrice;
    } else {
      console.error(`Error fetching price for ${ticker}`, data);
      throw new Error(`Unable to fetch price for ${ticker}`);
    }
  } catch (error) {
    console.error('Error fetching current stock price:', error);
    throw error;
  }
}

export async function monitorStockPrice(ticker, alertPrice, callback) {
  const currentPrice = await fetchCurrentPrice(ticker);

  // Check if current price is equal to or exceeds alert price
  if (currentPrice >= alertPrice) {
    callback({ ticker, currentPrice, alertPrice });
  }

  // Return the current price for validation purposes
  return currentPrice;
}


// utils/stockApi.js
export const fetchStockSymbols = async (symbol) => {
  const API_KEY = '492686d32c784348aa3f517135fb400a'; // Replace with your actual API key from Twelve Data
  const url = `https://api.twelvedata.com/symbol_search?symbol=${symbol}&apikey=${API_KEY}&show_plan=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    const data2 = data.data
      .map(item => {
        const s = item.access;
        const sa = s.plan;
        return sa === "Basic" ? item.symbol : undefined; // Return undefined if plan is not "Basic"
      })
      .filter(symbol => symbol !== undefined); // Remove undefined values
    return data2; // Adjust this based on the API response structure
  } catch (error) {
    console.error('Error fetching stock symbols:', error);
    return []; // Return an empty array on error
  }
};

