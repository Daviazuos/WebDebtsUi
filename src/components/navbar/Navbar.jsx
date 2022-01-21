import "./Navbar.css";

import { Navbar, Nav } from "react-bootstrap";

export function logout() {
  localStorage.removeItem("user");
}

const Header = (props) => {
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
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
      <Navbar.Text>
        {props.name}
      </Navbar.Text>
      <Nav.Link className="logout" onClick={logout} href="/sign-in">{props.link5}</Nav.Link>
    </Navbar.Collapse>
    </Navbar>
  );
};


export default Header
