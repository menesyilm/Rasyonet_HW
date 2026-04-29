import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7083/api',
});

export const getWatchlist = () => api.get('/stocks');
export const addStock = (symbol, companyName) =>
  api.post('/stocks/watch', { symbol, companyName });
export const removeStock = (symbol) => api.delete(`/stocks/${symbol}`);
export const refreshPrice = (symbol) => api.post(`/stocks/${symbol}/refresh`);
export const getTopGainers = (count = 5) =>
  api.get(`/stocks/analytics/top-gainers?count=${count}`);