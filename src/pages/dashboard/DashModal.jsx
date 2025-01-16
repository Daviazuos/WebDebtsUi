import React, { useContext, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { decimalAdjust } from "../../utils/valuesFormater";

import "./DashModal.css"

export default function DashModal(props) {
    const lis = props.data?.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.debtName}</td>
                <td>{item.category}</td>
                <td>R$ {decimalAdjust(item.value)}</td>
            </tr>
        )

    })

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
                    <Table striped borderless hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lis}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>

    )
}
