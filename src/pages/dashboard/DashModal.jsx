import React from "react";
import { Modal } from "react-bootstrap";

import "./DashModal.css"

export default function DashModal(props) {
    return (
        <div onClick={e => e.stopPropagation()}>
            <Modal
                {...props}
                size="lg"
                centered
                scrollable
                dialogClassName="GlobalModal"
            >
                <Modal.Header closeButton>
                    <div className="dashboardModalHeading">
                        {props.modalIcon && (
                            <span className="dashboardModalIcon">
                                <i className={props.modalIcon} aria-hidden="true"></i>
                            </span>
                        )}
                        <Modal.Title id="contained-modal-title-vcenter">
                            {props.head}
                        </Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {props.table}
                </Modal.Body>
            </Modal>
        </div>

    )
}
