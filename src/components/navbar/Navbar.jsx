import "./Navbar.css";
import React, { useContext } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Context from "../../context/Context";
import { monthByNumber } from "../../utils/dateFormater";


export function logout() {
  localStorage.removeItem("user");
}


const Header = (props) => {
  const [month, setMonth] = useContext(Context);
  const handleSelect=(e)=>{
    setMonth(e);
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
