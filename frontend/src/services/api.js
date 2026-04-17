import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const psxApi = {
  // PSX Terminal APIs
  getQuote: (symbol) => axios.get(`https://psxterminal.com/api/ticks/REG/${symbol}`),
  getKlines: (symbol) => axios.get(`https://psxterminal.com/api/klines/${symbol}/1d`),
  getSymbols: () => axios.get(`https://psxterminal.com/api/symbols`),
};

export default api;