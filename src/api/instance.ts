import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://web-debts.herokuapp.com/',
  timeout: 20000,
});

export default axiosInstance;
