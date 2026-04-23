export const API_BASE = 'http://localhost:4000/api';

export const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : ''
});

export const safeFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return data;
};
