import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { monthByNumber } from "../../utils/dateFormater";
import { refreshPage } from '../../utils/utils';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";
import { useHistory, useLocation } from 'react-router-dom';
import "./Sidebar.css"


function Sidebar(props) {
    const [toggled, setToggled] = useState(false);

    const today = new Date();
    const actualMonth = String(today.getMonth() + 1).padStart(2, '0');

    const [month, setMonth] = React.useState(localStorage.getItem("month") ? localStorage.getItem("month") : actualMonth)
    const [year, setYear] = React.useState(localStorage.getItem("year"));

    const history = useHistory();
    const location = useLocation();

    function logout() {
        localStorage.removeItem("user");
        history.push('/')
        refreshPage()
    }

    const handleSelect = (newMonth) => {
        localStorage.setItem("year", year);
        localStorage.setItem("month", newMonth);
        setMonth(newMonth)
        refreshPage()
    }

    const handleSelectYear = (newYear) => {
        localStorage.setItem("year", newYear);
        localStorage.setItem("month", 1);
        setYear(newYear)
        refreshPage()
    }

    const showSidebar = () => setToggled(!toggled);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user?.name || 'Minha conta';

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setToggled(false); // ou true, dependendo do comportamento desejado
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // chama uma vez para pegar o tamanho inicial

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="sidebarShell">
            <button type="button" className="toggle-button" aria-label="Abrir navegação" onClick={showSidebar}>
                <FaIcons.FaBars aria-hidden="true" />
            </button>
            <ProSidebar
                className="appSidebar"
                breakPoint="md"
                toggled={toggled}
                onToggle={(value) => setToggled(value)}
            >
                <SidebarHeader>
                    <div className="sidebarBrand">
                        <span className="sidebarBrandMark"><FaIcons.FaWallet aria-hidden="true" /></span>
                        <div className="sidebarBrandText">
                            <strong>Web Debts</strong>
                            <span>CONTROLE FINANCEIRO</span>
                        </div>
                    </div>
                    <div className="sidebarAccount">
                        <span className="sidebarAccountAvatar">{userName.charAt(0).toUpperCase()}</span>
                        <div className="sidebarAccountText">
                            <span>Conta</span>
                            <strong title={userName}>{userName}</strong>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem
                            active={location.pathname === '/'}
                            icon={<FaIcons.FaHouseUser />}
                        >
                            Dashboard<Link to="/" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/financial'}
                            icon={<FaIcons.FaMoneyBillAlt />}
                        >
                            Finanças<Link to="/financial" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/planner'}
                            icon={<FaIcons.FaBalanceScale />}
                        >
                            Planejamento<Link to="/planner" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/debts'}
                            icon={<FaIcons.FaHandHoldingUsd />}
                        >
                            Dívidas<Link to="/debts" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase().startsWith('/creditcardselected') || location.pathname.toLowerCase() === '/cards'}
                            icon={<FaIcons.FaCreditCard />}
                        >
                            Cartões<Link to="/cards" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/wallet'}
                            icon={<FaIcons.FaWallet />}
                        >
                            Carteira<Link to="/wallet" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/goals'}
                            icon={<FaIcons.FaLightbulb />}
                        >
                            Metas<Link to="/goals" />
                        </MenuItem>
                        <MenuItem
                            active={location.pathname.toLowerCase() === '/responsibleparty'}
                            icon={<FaIcons.FaUser />}
                        >
                            Pessoas<Link to="/responsibleParty" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>

                <SidebarFooter>
                    <div className="sidebarFooterContent">
                        <span className="sidebarFooterLabel">PERÍODO ATIVO</span>
                        <div className="sidebarPeriodControls">
                            <NavDropdown
                                className="sidebarPeriodDropdown"
                                id="nav-dropdown-dark-example"
                                title={monthByNumber(month)}
                                onSelect={handleSelect}
                            >
                                <NavDropdown.Item eventKey={1}>Janeiro</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2}>Fevereiro</NavDropdown.Item>
                                <NavDropdown.Item eventKey={3}>Março</NavDropdown.Item>
                                <NavDropdown.Item eventKey={4}>Abril</NavDropdown.Item>
                                <NavDropdown.Item eventKey={5}>Maio</NavDropdown.Item>
                                <NavDropdown.Item eventKey={6}>Junho</NavDropdown.Item>
                                <NavDropdown.Item eventKey={7}>Julho</NavDropdown.Item>
                                <NavDropdown.Item eventKey={8}>Agosto</NavDropdown.Item>
                                <NavDropdown.Item eventKey={9}>Setembro</NavDropdown.Item>
                                <NavDropdown.Item eventKey={10}>Outubro</NavDropdown.Item>
                                <NavDropdown.Item eventKey={11}>Novembro</NavDropdown.Item>
                                <NavDropdown.Item eventKey={12}>Dezembro</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown
                                className="sidebarPeriodDropdown sidebarYearDropdown"
                                id="nav-dropdown-dark-example"
                                title={year}
                                onSelect={handleSelectYear}
                            >
                                <NavDropdown.Item eventKey={2022}>2022</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2023}>2023</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2024}>2024</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2025}>2025</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2026}>2026</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2027}>2027</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2028}>2028</NavDropdown.Item>
                                <NavDropdown.Item eventKey={2029}>2029</NavDropdown.Item>
                            </NavDropdown>
                        </div>
                        <button type="button" className="sidebarLogout" onClick={logout}>
                            <FaIcons.FaSignOutAlt aria-hidden="true" />
                            <span>Sair da conta</span>
                        </button>
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
}

export default Sidebar;