import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

export default function AddHoldingModal({ portfolioId, onClose, onRefresh }) {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/portfolios/${portfolioId}/holdings`, {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
        avg_buy_price: parseFloat(price)
      });
      toast.success("Stock added!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error("Failed to add stock");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Holding</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Symbol (e.g., ENGRO)</label>
            <input 
              className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input 
                type="number"
                className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Avg Buy Price</label>
              <input 
                type="number" step="0.01"
                className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-4">
            Add to Portfolio
          </button>
        </form>
      </div>
    </div>
  );
}