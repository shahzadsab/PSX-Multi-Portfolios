import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/portfolios');
      setPortfolios(res.data);
    } catch (err) {
      toast.error("Failed to load portfolios");
    }
  };

  const createPortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolioName) return;
    try {
      await api.post('/portfolios', { name: newPortfolioName });
      setNewPortfolioName('');
      fetchPortfolios();
      toast.success("Portfolio created!");
    } catch (err) {
      toast.error("Error creating portfolio");
    }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Portfolios</h1>
      
      <form onSubmit={createPortfolio} className="mb-8 flex gap-2">
        <input 
          className="p-2 rounded border dark:bg-gray-800 dark:border-gray-700 flex-1"
          placeholder="New Portfolio Name (e.g. Retirement)"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <PlusCircle size={20} /> Create
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map(p => (
          <Link key={p.id} to={`/portfolio/${p.id}`} className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.holdings.length} Holdings</p>
              </div>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-xs font-medium uppercase text-gray-400">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}