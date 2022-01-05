import React from "react";
import { Button, Card, Container } from "react-bootstrap";

import ModalAddDebts from "../modal/modalDebts";
import Table from "../table/table"

import "./Debts.css";

export default () => {
  return (
    <div className="debts">
      <Container className="containerDebtpage">
        <Card className="cardTable">
          <Table></Table>
        </Card>
      </Container>
    </div>);
};
