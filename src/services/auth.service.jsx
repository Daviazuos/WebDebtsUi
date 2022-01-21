import axios from 'axios';
import { Endpoints } from '../api/endpoints';
import { axiosInstance } from "../api";


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
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();