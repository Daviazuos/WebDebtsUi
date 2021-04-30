import React from "react";
import { Modal, Card } from "react-bootstrap";

import Form from "../form/form"

export default function ModalAddDebts(props) {
  return (
    <Modal
      {...props}
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
          <Form></Form>
        </Modal.Body>
      </Card>
    </Modal>
  );
}
