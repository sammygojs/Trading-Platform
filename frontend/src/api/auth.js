import axios from 'axios';

const API_URL = 'http://backend:5003/api/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
