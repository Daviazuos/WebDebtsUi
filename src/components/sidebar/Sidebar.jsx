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
import { useNavigate } from 'react-router-dom';
import "./Sidebar.css"


function Sidebar(props) {
    const [sidebar, setSidebar] = useState(false);
    const [toggled, setToggled] = useState(false);

    const today = new Date();
    const actualMonth = String(today.getMonth() + 1).padStart(2, '0');

    const [month, setMonth] = React.useState(localStorage.getItem("month") ? localStorage.getItem("month") : actualMonth)
    const [year, setYear] = React.useState(localStorage.getItem("year"));

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("user");
        navigate('/');
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

    var arr = JSON.parse(localStorage.getItem('user'));

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
        <div>
            <div className="toggle-button">
                <FaIcons.FaBars onClick={showSidebar} />
            </div>
            <ProSidebar
                breakPoint="md"
                toggled={toggled}
                onToggle={(value) => setToggled(value)}
            >
                <SidebarHeader>
                    <div
                        style={{
                            padding: "24px",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: 14,
                            letterSpacing: "1px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {sidebar === true ?
                            <><FaIcons.FaBars/></> : <>
                                <h4>Web Debts</h4>
                                <div className='userName'>{arr.name}</div>
                            </>}

                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem
                            icon={<FaIcons.FaHouseUser />}
                        >
                            Dashboard<Link to="/" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaMoneyBillAlt />}
                        >
                            Finanças<Link to="/financial" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaBalanceScale />}
                        >
                            Planejamento<Link to="/planner" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaHandHoldingUsd />}
                        >
                            Dívidas<Link to="/debts" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaCreditCard />}
                        >
                            Cartões<Link to="/cards" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaWallet />}
                        >
                            Carteira<Link to="/wallet" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaLightbulb />}
                        >
                            Metas<Link to="/goals" />
                        </MenuItem>
                        <MenuItem
                            icon={<FaIcons.FaUser />}
                        >
                            Pessoas<Link to="/responsibleParty" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>

                <SidebarFooter style={{ textAlign: "center" }}>
                    <MenuItem>
                        {!sidebar ? <>
                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title={monthByNumber(month)}
                                menuVariant="dark"
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
                                id="nav-dropdown-dark-example"
                                title={year}
                                menuVariant="dark"
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
                            </NavDropdown> </> : <FaIcons.FaCalendarAlt />}
                        <p onClick={logout} >Sair</p>
                    </MenuItem>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
}

export default Sidebar;