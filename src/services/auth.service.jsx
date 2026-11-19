import axios from 'axios';
import { Endpoints } from '../api/endpoints';
import { axiosInstance } from "../api";
import jwt_decode from "jwt-decode";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username, password) {
    const login = {
      username: username,
      password: password
    }
    return axiosInstance.post(Endpoints.user.login(), login)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    // try/catch: um "user" corrompido ou um token inválido não pode lançar erro
    // durante a renderização (isso derrubaria o app inteiro e deixaria a tela branca)
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        var decodedToken = jwt_decode(user['token']);
        var dateNow = new Date();
        var date_exp = new Date(decodedToken.exp * 1000);

        if (dateNow > date_exp)
          return null;
        else
          return user
      }
      else
        return null
    } catch (err) {
      return null;
    }
  }

  // Momento (em ms desde 1970) em que o token da sessão atual expira, ou null.
  getTokenExpiration() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user['token']) return null;
      const decodedToken = jwt_decode(user['token']);
      return decodedToken.exp ? decodedToken.exp * 1000 : null;
    } catch (err) {
      return null;
    }
  }

  // Encerra a sessão e leva a pessoa para o login. Chamado quando o token expira
  // ou quando o backend responde 401.
  expireSession() {
    if (this.sessionExpiring) return;
    this.sessionExpiring = true;
    localStorage.removeItem("user");
    window.location.assign("/sign-in");
  }
}

export default new AuthService();