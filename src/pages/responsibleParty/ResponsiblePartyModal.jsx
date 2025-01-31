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
        >
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Nome da pessoa</Form.Label>
                        <Form.Control required="true" name="name" onChange={nameChange} placeholder="Nome" />
                    </Form.Group>
                </Form>
                <p></p>
                {props.dataTable !== undefined ?
                    <div>
                        <>Pessoa já adicionadas</>
                        <Table  borderless striped responsive hover variant="white" size="sm">
                            <tbody>
                                {props.dataTable}
                            </tbody>
                        </Table>
                        <p></p>
                    </div>
                    : ""}

                <Button variant="dark" onClick={() => setAddResponsibleParty(true)}>Adicionar</Button>
            </Modal.Body>
        </Modal>
    )
}


