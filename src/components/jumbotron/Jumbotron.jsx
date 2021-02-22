import React from "react";
import "./Jumbotron.css";

import { Navbar, Nav } from "react-bootstrap";

export default (props) => {
  return (
    <div className="navbar">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">WebDebts!!</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#debts">Cartões</Nav.Link>
        </Nav>
      </Navbar
    </div>
  );
};
