import axios from 'axios';
import AuthService from '../services/auth.service'

export function getToken(){
  const user = AuthService.getCurrentUser()
  const token = user ? user['token'] : ""
  return { 'Authorization': 'Bearer ' + token }
}


const axiosInstance = axios.create({
  //baseURL: 'https://localhost:5001',
  baseURL: 'https://backend.webdebt.net',
  timeout: 20000,
  headers: getToken()

});

// O token é lido a cada requisição (e não só quando o módulo carrega), para nunca
// enviar um token antigo depois de um novo login.
axiosInstance.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getToken() };
  return config;
});

// Sessão expirada: o backend responde 401 e a pessoa volta para o login em vez de
// ficar presa numa tela vazia. O 401 do próprio login (senha errada) é ignorado,
// porque a tela de login já mostra esse erro.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url || '');
    const isLoginRequest = url.toLowerCase().includes('/login');

    if (status === 401 && !isLoginRequest) {
      AuthService.expireSession();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
