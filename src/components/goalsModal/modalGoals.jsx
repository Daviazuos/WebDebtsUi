import React from "react";
import { Modal, Card } from "react-bootstrap";
import EditDebtForm from "../form/editDebtForm";

import Form from "../form/form"
import AddGoalsForm from "./addGoalsForm";
import "./modalGoals.css"


export default function ModalGoals(props) {
  const [modalShow, setModalShow] = React.useState(null);
  return (
    <Modal
      show={modalShow ? modalShow : props.show}
      onHide={props.onHide ? props.onHide : () => setModalShow(false)}
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
          <AddGoalsForm></AddGoalsForm>
      </Modal.Body>
    </Modal>
  );
}
