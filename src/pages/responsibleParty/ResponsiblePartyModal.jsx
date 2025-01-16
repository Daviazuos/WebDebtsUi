import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
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
                props.refresh()
                props.onHide()
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
                        <Form.Label>Nome</Form.Label>
                        <Form.Control required="true" name="name" onChange={nameChange} placeholder="Nome" />
                    </Form.Group>
                    <Button variant="dark" onClick={() => setAddResponsibleParty(true)}>Adicionar</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}


