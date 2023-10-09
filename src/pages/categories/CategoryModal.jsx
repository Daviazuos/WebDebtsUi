import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';

import "./CategoryModal.css"


export default function CategoryModal(props) {
    const [name, setName] = useState('')
    const [addCategory, setAddCategory] = useState(false)

    const nameChange = event => {
        setName(event.target.value)
    }

    useEffect(() => {
        if (addCategory) {
            const categoryModel = {
                name: name
            };

            axiosInstance.post(Endpoints.debt.addCategory(), categoryModel).then(response => {
                props.refresh()
                props.onHide()
            })
        }

    }, [addCategory])

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
                    <Button variant="dark" onClick={() => setAddCategory(true)}>Adicionar</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}


