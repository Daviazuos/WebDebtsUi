import { React, useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';

function refreshPage() {
    window.location.reload();
}


export default function CreditCardEditModal(props) {
    const [modalShow, setModalShow] = useState(null);

    const [name, setName] = useState(props.name);
    const [dueDate, setDueDate] = useState(props.dueDate);
    const [closureDate, setClosureDate] = useState(props.closureDate);
    const [color, setColor] = useState(props.color);
    const [submit, setSubmit] = useState(false);

    const nameChange = event => {
        setName(event.target.value);
    }
    const dueChange = event => {
        setDueDate(event.target.value);
    }
    const closureChange = event => {
        setClosureDate(event.target.value);
    }
    const colorChange = event => {
        setColor(event.target.value);
    }


    useEffect(() => {
        const editCard = {
            name: name,
            dueDate: dueDate,
            closureDate: closureDate,
            color: color
        };

        if (submit === true) {
            axiosInstance.put(Endpoints.card.edit(props.id), editCard)
            .then(response => {
                const id = response.data.Body;
                refreshPage()
            })
        }
    }, [submit])



    const lis = []
    for (var i = 1; i <= 31; i++) {
        lis.push(<option value={i}>{i}</option>)
    }

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
                <Form>
                    <Form.Group>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name="name" onChange={nameChange} defaultValue={name} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Dia de vencimento</Form.Label>
                        <Form.Control name="dueDate" onChange={dueChange} as="select" defaultValue={dueDate}>
                            {lis}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Dia de fechamento</Form.Label>
                        <Form.Control name="value" onChange={closureChange} as="select" defaultValue={closureDate}>
                            {lis}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="exampleColorInput">Cor do cartão</Form.Label>
                        <Form.Control
                            type="color"
                            id="exampleColorInput"
                            defaultValue={color}
                            title="Choose your color"
                            onChange={colorChange}
                        />
                    </Form.Group>

                    <Button variant="dark" type="submit" onClick={() => {setSubmit(true)}}> Atualizar </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}



