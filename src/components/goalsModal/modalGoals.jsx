import React from "react";
import { Modal } from "react-bootstrap";
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
      className="goalCreateModal"
    >
      <Modal.Header closeButton>
        <div className="goalCreateHeading">
          <span className="goalCreateIcon"><i className="fas fa-bullseye" aria-hidden="true"></i></span>
          <div>
            <span className="goalCreateEyebrow">FINANÇAS / OBJETIVOS</span>
            <Modal.Title id="contained-modal-title-vcenter">{props.head}</Modal.Title>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
          <AddGoalsForm />
      </Modal.Body>
    </Modal>
  );
}
