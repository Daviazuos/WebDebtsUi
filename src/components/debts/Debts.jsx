import React from "react";
import { Button, Card, Container } from "react-bootstrap";

import ModalAddDebts from "../modal/modalDebts";
import Table from "../table/table"

import "./Debts.css";

function SetModal(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='addButton' variant='dark' onClick={() => setModalShow(true)}>
        <i className="fas fa-plus"></i> {props.modalName}
      </Button>

      <ModalAddDebts
        show={modalShow}
        onHide={() => setModalShow(false)}
        head="Adicionar débitos"
      />
    </>
  );
}

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
