import axios from 'axios';
import AuthService from '../services/auth.service'

export function getToken(){
  const user = AuthService.getCurrentUser()
  const token = user ? user['token'] : ""
  return { 'Authorization': 'Bearer ' + token }
}


const axiosInstance = axios.create({
  //baseURL: 'https://localhost:5001',
  baseURL: 'https://1c75-2804-14d-4cd8-415f-00-f481.ngrok-free.app/',
  timeout: 20000,
  headers: getToken()
  
});

export default axiosInstance;
