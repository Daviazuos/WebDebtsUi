import Debts from "./pages/debts/Debts";
import Financial from "./pages/financial/Financial";
import Wallet from "./pages/wallet/Wallet";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import CreditCard from "./pages/creditCard/CreditCard";
import authService from "./services/auth.service";
import { monthByNumber } from "./utils/dateFormater";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/navbar/Navbar'
import Dashboard from "./pages/dashboard/Dashboard";
import Context from "./context/Context";
import { useState } from "react";
import './App.scss';
import Layout from "./Layout";
import Goals from "./pages/goals/Goals";
import CreditCardSelected from "./pages/creditCardSelected/CreditCardSelected";
import { GlobalProvider } from "./services/local-storage-event";
import ResponsibleParty from "./pages/responsibleParty/ResponsibleParty";
import Planner from "./pages/planner/Planner";
import PlannerV2 from "./pages/plannerV2/Planner";
import { ProvisionedValueProvider } from "./context/ProvisionedValueContext";

export function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("month");
    localStorage.removeItem("year");
}

function PrivateRoutes({ children }) {
    const user = authService.getCurrentUser();
    if (!user) {
        logout();
        return <Navigate to="/sign-in" replace />;
    }
    return (
        <Layout>
            <div className="app2">
                {children}
            </div>
        </Layout>
    );
}

export default function App() {
    const [isAltered, setIsAltered] = useState(false);
    return (
        <GlobalProvider>
            <Router>
                <Context.Provider value={[isAltered, setIsAltered]}>
                    <ProvisionedValueProvider>
                        <Routes>
                            {/* Rotas públicas */}
                            <Route path="/sign-in" element={<Login />} />
                            <Route path="/Register" element={<Register />} />
                            {/* Rotas privadas */}
                            <Route path="/*" element={
                                <PrivateRoutes>
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/Debts" element={<Debts />} />
                                        <Route path="/Cards" element={<CreditCard />} />
                                        <Route path="/Financial" element={<Financial />} />
                                        <Route path="/Wallet" element={<Wallet />} />
                                        <Route path="/Goals" element={<Goals />} />
                                        <Route path="/ResponsibleParty" element={<ResponsibleParty />} />
                                        <Route path="/CreditCardSelected/:cardId" element={<CreditCardSelected />} />
                                        <Route path="/Planner" element={<Planner />} />
                                        <Route path="/PlannerV2" element={<PlannerV2 />} />
                                    </Routes>
                                </PrivateRoutes>
                            } />
                        </Routes>
                    </ProvisionedValueProvider>
                </Context.Provider>
            </Router>
        </GlobalProvider>
    );
}

