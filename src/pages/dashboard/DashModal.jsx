import React from "react";
import { Modal } from "react-bootstrap";

import "./DashModal.css"

export default function DashModal({ show, onHide, table, head, modalIcon, className }) {
    return (
        <div onClick={e => e.stopPropagation()}>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered
                scrollable
                className={`appPurchaseModal ${className || ""}`}
                aria-labelledby="dashboard-summary-title"
            >
                <Modal.Header closeButton>
                    <div className="appPurchaseHeading">
                        {modalIcon && (
                            <span className="appPurchaseHeadingIcon">
                                <i className={modalIcon} aria-hidden="true"></i>
                            </span>
                        )}
                        <div>
                            <span className="appPurchaseEyebrow">DETALHES DO PERÍODO</span>
                            <Modal.Title id="dashboard-summary-title">{head}</Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {table}
                </Modal.Body>
            </Modal>
        </div>

    )
}
