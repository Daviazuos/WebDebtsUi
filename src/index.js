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


ReactDOM.render(
  <React.StrictMode>
       <Router>
       <Navbar home="Web Debts" link1="Dívidas" link3="Finanças" link4="Carteira"></Navbar>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/Debts" component={Debts} />
        <Route path="/Financial" component={Financial} />
        <Route path="/Wallet" component={Wallet} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);