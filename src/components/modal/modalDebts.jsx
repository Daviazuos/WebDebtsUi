import React from "react";
import { Modal } from "react-bootstrap";

import {  Button } from "react-bootstrap";
import Form from "../form/form"

export default function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.head}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.bodyh4}</h4>
        <Form></Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button variant="primary" type="submit"> Submit </Button>
      </Modal.Footer>
      
    </Modal>
  );
}
