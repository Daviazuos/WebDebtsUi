import axios from 'axios';
import AuthService from '../services/auth.service'

export function getToken(){
  const user = AuthService.getCurrentUser()
  const token = user ? user['token'] : ""
  return { 'Authorization': 'Bearer ' + token }
}


const axiosInstance = axios.create({
  baseURL: 'https://web-debts.herokuapp.com/',
  timeout: 20000,
  headers: getToken()
  
});

export default axiosInstance;
