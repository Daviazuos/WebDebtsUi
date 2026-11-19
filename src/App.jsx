import Debts from "./pages/debts/Debts";
import Financial from "./pages/financial/Financial";
import Wallet from "./pages/wallet/Wallet";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CreditCard from "./pages/creditCard/CreditCard";
import authService from "./services/auth.service";
import { monthByNumber } from "./utils/dateFormater";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from './components/navbar/Navbar'
import Dashboard from "./pages/dashboard/Dashboard";
import Context from "./context/Context";
import { useEffect, useState } from "react";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import './App.scss';
import Layout from "./Layout";
import Goals from "./pages/goals/Goals";
import CreditCardSelected from "./pages/creditCardSelected/CreditCardSelected";
import { GlobalProvider } from "./services/local-storage-event";
import ResponsibleParty from "./pages/responsibleParty/ResponsibleParty";
import Planner from "./pages/planner/Planner";

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
                <div className="app2">
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/Debts" component={Debts} />
                    <Route path="/Cards" component={CreditCard} />
                    <Route path="/Financial" component={Financial} />
                    <Route path="/Wallet" component={Wallet} />
                    <Route path="/Goals" component={Goals} />
                    <Route path="/ResponsibleParty" component={ResponsibleParty} />
                    <Route path="/CreditCardSelected/:cardId" component={CreditCardSelected} />
                    <Route path="/Planner" component={Planner} />
                </div>
            </Layout>
        )
    }
    else {
        logout()
        return (
            <div>
                <Switch>
                    <Route exact path="/sign-in" component={Login} />
                    <Route exact path="/" component={Login} />
                    <Route path="/Register" component={Register} />
                    {/* Sem sessão, qualquer outra rota (ex.: /Planner) volta para o login
                        em vez de ficar em branco */}
                    <Redirect to="/sign-in" />
                </Switch>
            </div>
        )
    }
}

export default function App() {
    const [isAltered, setIsAltered] = useState(false);

    // Leva para o login assim que o token vence, mesmo com a página aberta e parada.
    // Também confere ao voltar para a aba, porque os navegadores atrasam timers de
    // abas em segundo plano.
    useEffect(() => {
        let timer;
        const check = () => {
            clearTimeout(timer);
            const expiration = authService.getTokenExpiration();
            if (!expiration) return;
            const remaining = expiration - Date.now();
            if (remaining <= 0) {
                authService.expireSession();
                return;
            }
            // setTimeout aceita no máximo ~24,8 dias
            timer = setTimeout(check, Math.min(remaining, 2147483647));
        };
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') check();
        };

        check();
        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('focus', check);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('focus', check);
        };
    }, []);

    return (
        <GlobalProvider>
            <ErrorBoundary>
                <Router>
                    <Switch>
                        <Context.Provider value={[isAltered, setIsAltered]}>
                            {isLogged()}
                        </Context.Provider>
                    </Switch>
                </Router>
            </ErrorBoundary>
        </GlobalProvider>)
}

