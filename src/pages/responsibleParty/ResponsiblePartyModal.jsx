import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';

import "./ResponsiblePartyModal.css"


export default function ResponsiblePartyModal(props) {
    const [name, setName] = useState('')
    const [addResponsibleParty, setAddResponsibleParty] = useState(false)

    const nameChange = event => {
        setName(event.target.value)
    }

    useEffect(() => {
        if (addResponsibleParty) {
            const responsiblePartyModel = {
                name: name
            };

            axiosInstance.post(Endpoints.responsibleParty.add(), responsiblePartyModel).then(response => {
                props.onHide()
                props.refresh()
            })
        }

    }, [addResponsibleParty])

    return (
        <Modal
            {...props}
            centered
            className="peopleCreateModal"
        >
            <Modal.Header closeButton>
                <div className="peopleCreateHeading">
                    <span className="peopleCreateIcon"><i className="fas fa-user-plus" aria-hidden="true"></i></span>
                    <div>
                        <span className="peopleCreateEyebrow">FINANÇAS / RELACIONAMENTOS</span>
                        <Modal.Title>{props.head || "Adicionar pessoa"}</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form className="peopleCreateForm">
                    <Form.Group className="peopleCreateField" controlId="responsiblePartyName">
                        <Form.Label>Nome da pessoa</Form.Label>
                        <Form.Control required name="name" onChange={nameChange} placeholder="Digite o nome" />
                    </Form.Group>
                </Form>
                {props.dataTable !== undefined ?
                    <div className="peopleCreateExistingList">
                        <h2>Pessoas já adicionadas</h2>
                        <Table borderless striped responsive hover size="sm">
                            <tbody>
                                {props.dataTable}
                            </tbody>
                        </Table>
                    </div>
                    : ""}

                <Button className="peopleCreateSubmit" onClick={() => setAddResponsibleParty(true)}>
                    <i className="fas fa-plus" aria-hidden="true"></i>
                    Adicionar pessoa
                </Button>
            </Modal.Body>
        </Modal>
    )
}
