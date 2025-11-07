import React, { useContext, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";

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
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.head}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.table}
                </Modal.Body>
            </Modal>
        </div>

    )
}
