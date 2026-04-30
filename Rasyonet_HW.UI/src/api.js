import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5154/api',
});

export const getWatchlist = () => api.get('/stocks');
export const addStock = (symbol, companyName) =>
  api.post('/stocks/watch', { symbol, companyName });
export const removeStock = (symbol) => api.delete(`/stocks/${symbol}`);
export const refreshPrice = (symbol) => api.post(`/stocks/${symbol}/refresh`);
export const getTopGainers = (count = 5) =>
  api.get(`/stocks/analytics/top-gainers?count=${count}`);
export const getTopLosers = (count = 5) =>
  api.get(`/stocks/analytics/top-losers?count=${count}`);