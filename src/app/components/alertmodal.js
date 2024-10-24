// components/AlertModal.js
import React, { useState, useEffect } from 'react';

const AlertModal = ({ stock, currentPrice, onClose, onSave }) => {
  const [alertPrice, setAlertPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAlertPrice('');
    setError('');
  }, [stock]);

  const handleSave = () => {
    const lowerLimit = currentPrice * 0.7;
    const upperLimit = currentPrice * 1.3;
    const price = parseFloat(alertPrice);

    if (price < lowerLimit || price > upperLimit) {
      setError(`Price alert must be between $${lowerLimit.toFixed(2)} and $${upperLimit.toFixed(2)}.`);
      return;
    }

    onSave(stock, price);
    onClose(); // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Set Alert for {stock}</h2>
        <p>Current price: ${currentPrice.toFixed(2)}</p>
        <p>Alert range: ${(currentPrice * 0.7).toFixed(2)} - ${(currentPrice * 1.3).toFixed(2)}</p>

        <input
          type="number"
          placeholder="Enter price alert"
          value={alertPrice}
          onChange={(e) => setAlertPrice(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mt-4"
        />

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
