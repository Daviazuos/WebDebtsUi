import "./Navbar.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { monthByNumber } from "../../utils/dateFormater";
import React, { useEffect } from "react";
import { refreshPage } from "../../utils/utils";


export function logout() {
  localStorage.removeItem("user");
}


const Header = (props) => {
  const today = new Date();
  const actualMonth = String(today.getMonth() + 1).padStart(2, '0');

  const [month, setMonth] = React.useState(localStorage.getItem("month") ? localStorage.getItem("month") : actualMonth)

  const handleSelect = (newMonth) => {
    const year = new Date().getFullYear()
    localStorage.setItem("year", year);
    localStorage.setItem("month", newMonth);
    setMonth(newMonth)
    refreshPage()
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/dash">{props.home}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/financial">{props.link3}</Nav.Link>
          <Nav.Link href="/debts">{props.link1}</Nav.Link>
          <Nav.Link href="/cards">{props.link2}</Nav.Link>
          <Nav.Link href="/wallet">{props.link4}</Nav.Link>
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
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Logado como: {props.name}
        </Navbar.Text>
        <Nav.Link className="logout" onClick={logout} href="/sign-in">{props.link5}</Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};


export default Header
