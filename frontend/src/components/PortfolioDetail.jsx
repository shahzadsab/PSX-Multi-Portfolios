import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api, { psxApi } from '../services/api';
import { RefreshCw, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    const res = await api.get('/portfolios');
    const p = res.data.find(x => x.id === parseInt(id));
    setPortfolio(p);
    return p;
  }, [id]);

  const refreshPrices = async () => {
    if (!portfolio) return;
    setLoading(true);
    const newPrices = {};
    try {
      await Promise.all(portfolio.holdings.map(async (h) => {
        try {
          const res = await psxApi.getQuote(h.symbol);
          newPrices[h.symbol] = res.data; // Assuming shape: { price: float, change: float, percent: float }
        } catch (e) {
          console.error(`Error fetching ${h.symbol}`);
        }
      }));
      setPrices(newPrices);
      toast.success("Prices updated");
    } catch (err) {
      toast.error("Rate limit or API error");
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async (symbol) => {
    setSelectedSymbol(symbol);
    try {
      const res = await psxApi.getKlines(symbol);
      // Map API kline data to { date, price }
      const formatted = res.data.slice(-30).map(d => ({ 
        date: new Date(d[0]).toLocaleDateString(), 
        price: d[4] 
      }));
      setChartData(formatted);
    } catch (err) {
      toast.error("Could not fetch chart data");
    }
  };

  useEffect(() => {
    fetchPortfolio().then(p => {
      if (p && p.holdings.length > 0) refreshPrices();
    });
  }, [id, fetchPortfolio]);

  if (!portfolio) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{portfolio.name}</h1>
        <button 
          onClick={refreshPrices} 
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Avg Price</th>
              <th className="px-6 py-4">Current Price</th>
              <th className="px-6 py-4">P&L</th>
              <th className="px-6 py-4">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {portfolio.holdings.map(h => {
              const current = prices[h.symbol]?.price || 0;
              const pnl = (current - h.avg_buy_price) * h.quantity;
              const pnlPercent = ((current - h.avg_buy_price) / h.avg_buy_price * 100).toFixed(2);
              
              return (
                <tr key={h.id} onClick={() => fetchChart(h.symbol)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 font-bold">{h.symbol}</td>
                  <td className="px-6 py-4">{h.quantity}</td>
                  <td className="px-6 py-4">Rs. {h.avg_buy_price}</td>
                  <td className="px-6 py-4 font-semibold">
                    {current > 0 ? `Rs. ${current}` : "---"}
                  </td>
                  <td className={`px-6 py-4 flex items-center gap-1 ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pnl >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                    {pnlPercent}%
                  </td>
                  <td className="px-6 py-4 font-bold">Rs. {(current * h.quantity).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Analytics/Chart Section */}
      {selectedSymbol && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4">{selectedSymbol} - 30 Day History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}