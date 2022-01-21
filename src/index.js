import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar'

import 'bootstrap/dist/css/bootstrap.min.css';
import Debts from "./pages/debts/Debts";
import Financial from "./pages/financial/Financial";
import Wallet from "./pages/wallet/Wallet";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CreditCard from "./pages/creditCard/CreditCard";
import authService from "./services/auth.service";


export function logout() {
  localStorage.removeItem("user");
}

export function isLogged() {
  const user = authService.getCurrentUser();
  if (user) {
    return (
      <div>
        <Navbar name={user['name']} home="Web Debts" link1="Dívidas" link2="Cartões" link3="Finanças" link4="Carteira" link5="Sair"></Navbar>
        <Route path="/dash" component={App} />
        <Route path="/Debts" component={Debts} />
        <Route path="/Cards" component={CreditCard} />
        <Route path="/Financial" component={Financial} />
        <Route path="/Wallet" component={Wallet} />
      </div>
    )
  }
  else {
    return (
      <div>
        <Route exact path="/sign-in" component={Login} />
        <Route path="/Register" component={Register} />
      </div>
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        {isLogged()}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);