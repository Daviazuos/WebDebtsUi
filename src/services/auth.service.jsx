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
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      var decodedToken = jwt_decode(user['token']);
      var dateNow = new Date();
      if (decodedToken.exp < dateNow.getTime())
        return user;
      else
        return null
    }
    else
      return null
  }
}

export default new AuthService();