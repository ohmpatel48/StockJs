'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { MdAddAlert } from "react-icons/md";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { monitorStockPrice, fetchCurrentPrice, fetchStockSymbols } from '../utils/stockApi'; // Assume fetchStockSymbols is the new function you create
import AlertModal from '@/app/components/alertmodal';
import Watchlist from '../components/Watchlist';

export default function DashboardPage() {
  const { user, logout, saveWatchlist, loadWatchlist } = useAuth();
  const [stockSymbol, setStockSymbol] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceAlerts, setPriceAlerts] = useState({});
  const [alertTriggered, setAlertTriggered] = useState('');
  const [currentPrices, setCurrentPrices] = useState({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalStock, setModalStock] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const userWatchlist = await loadWatchlist();
      setWatchlist(userWatchlist);
      if (userWatchlist.length > 0) {
        setSelectedStock(userWatchlist[0]);
      }
    };
    fetchWatchlist();
  }, [loadWatchlist]);

  // Fetch stock suggestions based on input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (stockSymbol) {
        const fetchedSymbols = await fetchStockSymbols(stockSymbol);
        setSuggestions(fetchedSymbols);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [stockSymbol]);

  const handleAddStock = async () => {
    if (stockSymbol) {
      const updatedWatchlist = [...watchlist, stockSymbol.toUpperCase()];
      setWatchlist(updatedWatchlist);
      await saveWatchlist(updatedWatchlist);
      setSelectedStock(stockSymbol.toUpperCase());
      setStockSymbol('');
      setSuggestions([]);
    }
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock === selectedStock ? null : stock);
    setStockSymbol(stock); // Set the input to the selected stock
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleRemoveStock = async (stock) => {
    const updatedWatchlist = watchlist.filter(item => item !== stock);
    setWatchlist(updatedWatchlist);
    await saveWatchlist(updatedWatchlist);
    if (selectedStock === stock) {
      setSelectedStock(updatedWatchlist.length > 0 ? updatedWatchlist[0] : null);
    }
  };

  const handleSetPriceAlert = async (stock, threshold) => {
    try {
      const currentPrice = await fetchCurrentPrice(stock);
      const lowerLimit = currentPrice * 0.7;
      const upperLimit = currentPrice * 1.3;
      const alertThreshold = parseFloat(threshold);

      if (alertThreshold < lowerLimit || alertThreshold > upperLimit) {
        alert(`Price alert must be between $${lowerLimit.toFixed(2)} and $${upperLimit.toFixed(2)}.`);
        return;
      }

      setPriceAlerts(prevAlerts => ({
        ...prevAlerts,
        [stock]: alertThreshold,
      }));

      setCurrentPrices(prevPrices => ({
        ...prevPrices,
        [stock]: currentPrice,
      }));

    } catch (error) {
      console.error('Error setting price alert:', error);
    }
  };

  const openAlertModal = async (stock) => {
    try {
      const currentPrice = await fetchCurrentPrice(stock);
      setModalStock({ stock, currentPrice });
      setShowAlertModal(true);
    } catch (error) {
      console.error('Error fetching current price for modal:', error);
    }
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setModalStock(null);
  };

  useEffect(() => {
    const intervals = Object.keys(priceAlerts).map(stock => {
      return setInterval(async () => {
        const alertPrice = priceAlerts[stock];
        const currentPrice = await monitorStockPrice(stock, alertPrice, ({ ticker, currentPrice, alertPrice }) => {
          setAlertTriggered(`Alert! ${ticker} has reached or exceeded your threshold of $${alertPrice} with a current price of $${currentPrice}.`);
        });

        setCurrentPrices(prevPrices => ({
          ...prevPrices,
          [stock]: currentPrice,
        }));
      }, 60000);
    });

    return () => {
      intervals.forEach(intervalId => clearInterval(intervalId));
    };
  }, [priceAlerts]);

  return (
    <div className="flex flex-col h-full">
      <nav className="bg-[#60bfbe] p-2 flex justify-between text-white">
        <h1 className="text-xl font-bold p-1">Stock Tracker</h1>
        <button className="bg-white px-3 py-1 rounded text-[#60bfbe]" onClick={logout}>Log Out</button>
      </nav>

      <div className="flex flex-1">
        <aside className="relative w-1/4 bg-[#60bfbe] p-4 pr-0"> {/* Changed to relative for absolute positioning */}
          <h2 className="text-lg text-white font-semibold text-center">Your Watchlist</h2>

          <div className="flex gap-2 pt-3">
            <input
              type="text"
              placeholder="Enter stock symbol"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#60bfbe]"
            />
            <button onClick={handleAddStock} className="bg-white p-3 text-[#60bfbe] hover:shadow-2xl transition-all duration-300 rounded-full">
              <FaPlus />
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto z-10"> {/* Positioned absolutely and made scrollable */}
              {suggestions.slice(0, 5).map((symbol, index) => ( // Only showing first 5 suggestions
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleStockSelect(symbol)}
                >
                  {symbol}
                </li>
              ))}
            </ul>
          )}

          <ul className="space-y-2 mt-4">
            {watchlist.map((stock, index) => (
              <li key={index} className={`p-2 flex rounded-md justify-between items-center cursor-pointer transition-all duration-300
                ${selectedStock === stock ? 'bg-white text-[#60bfbe]' : 'hover:text-[#60bfbe] hover:bg-white text-white'} `}>
                <span className='w-full' onClick={() => handleStockSelect(stock)}>
                  {stock}
                </span>
                <span className='flex'>
                  <button onClick={() => handleRemoveStock(stock)} className="text-red-500 hover:text-red-700 p-1">
                    <FaTrashAlt />
                  </button>
                  <button className="text-black p-1" onClick={() => openAlertModal(stock)}>
                    <MdAddAlert />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-4 rounded-md">
          <div className="bg-white rounded shadow p-4">
            <Watchlist selectedStock={selectedStock}></Watchlist>
          </div>
        </main>
        {showAlertModal && modalStock && (
          <AlertModal
            stock={modalStock.stock}
            currentPrice={modalStock.currentPrice}
            onClose={closeAlertModal}
            onSave={handleSetPriceAlert}
          />
        )}
      </div>
    </div>
  );
}
