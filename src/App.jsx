import Debts from "./pages/debts/Debts";
import Financial from "./pages/financial/Financial";
import Wallet from "./pages/wallet/Wallet";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CreditCard from "./pages/creditCard/CreditCard";
import authService from "./services/auth.service";
import { monthByNumber } from "./utils/dateFormater";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar'
import Dashboard from "./pages/dashboard/Dashboard";
import Context from "./context/Context";
import { useState } from "react";
import './App.scss';
import Sidebar from "./components/sidebar/Sidebar";
import Layout from "./Layout";
import Goals from "./pages/goals/Goals";
import CreditCardSelected from "./pages/creditCardSelected/CreditCardSelected";

export function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("month");
    localStorage.removeItem("year");
}


export function isLogged() {
    const user = authService.getCurrentUser();
    if (user) {
        return (
            <Layout>
                <div>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/Debts" component={Debts} />
                    <Route path="/Cards" component={CreditCard} />
                    <Route path="/Financial" component={Financial} />
                    <Route path="/Wallet" component={Wallet} />
                    <Route path="/Goals" component={Goals} />
                    <Route path="/CreditCardSelected/:cardId" component={CreditCardSelected} />
                </div>
            </Layout>
        )
    }
    else {
        logout()
        return (
            <div>
                <Route exact path="/sign-in" component={Login} />
                <Route exact path="/" component={Login} />
                <Route path="/Register" component={Register} />
            </div>
        )
    }
}

export default function App() {
    const [isAltered, setIsAltered] = useState(false);
    return (
        <Router>
            <Switch>
                <Context.Provider value={[isAltered, setIsAltered]}>
                    {isLogged()}
                </Context.Provider>
            </Switch>
        </Router>)
}

