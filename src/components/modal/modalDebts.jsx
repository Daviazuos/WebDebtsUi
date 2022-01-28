import React from "react";
import { Modal, Card } from "react-bootstrap";

import Form from "../form/form"
import "./modalDebts.css"


export default function ModalAddDebts(props) {
  const [modalShow, setModalShow] = React.useState(null);
  return (
    <Modal
      show={modalShow ? modalShow : props.show}
      onHide={props.onHide ? props.onHide : () => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Card>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.head}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form cardId={props.cardId != null ? props.cardId : null}></Form>
        </Modal.Body>
      </Card>
    </Modal>
  );
}
