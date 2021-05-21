import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar'

import 'bootstrap/dist/css/bootstrap.min.css';
import Debts from "./components/debts/Debts";
import Financial from "./components/financial/Financial"

ReactDOM.render(
  <React.StrictMode>
       <Router>
       <Navbar home="Web Debts" link1="Dívidas" link2="Cartões" link3="Finanças"></Navbar>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/Debts" component={Debts} />
        <Route path="/Financial" component={Financial} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);