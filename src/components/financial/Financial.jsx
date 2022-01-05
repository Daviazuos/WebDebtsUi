import React from "react";
import { Container, Button } from "react-bootstrap";
import CardAnaliticValue from "../cardAnaliticValue/CardAnaliticValue"
import ModalAddDebts from "../modal/modalDebts";
import "./Financial.css"

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
    <div className="financial">
      <Container>
        <CardAnaliticValue></CardAnaliticValue>
        {<SetModal modalName="Débitos"></SetModal>}{" "}
      </Container>
    </div>);
};
