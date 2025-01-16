import React from "react";
import { Modal, Card } from "react-bootstrap";
import EditDebtForm from "../form/editDebtForm";

import Form from "../form/form"
import "./modalDebts.css"


export default function ModalAddDebts(props) {
  const [modalShow, setModalShow] = React.useState(null);

  return (
    <Modal
      show={modalShow ? modalShow : props.show}
      onHide={props.onHide ? props.onHide : () => setModalShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen="md-down"
    >
      <Modal.Header className="custom-modal-header" style={{ backgroundColor: props.color }} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title} {/* Título da modal vem das props */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(props.value === undefined) ?
          <Form cardId={props.cardId != null ? props.cardId : null} data={props.data} id={props.value} update={props.update}></Form>
          : <EditDebtForm cardId={props.cardId != null ? props.cardId : null} data={props.data} id={props.value} update={props.update}></EditDebtForm>}
      </Modal.Body>
    </Modal>
  );
}
