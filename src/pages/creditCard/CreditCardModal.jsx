import React from "react";
import { Button, Modal, Form, FormControl } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';

function refreshPage() {
    window.location.reload();
}


export default class CreditCardModal extends React.Component {
    state = {
        name: '',
        dueDate: '',
        closureDate: '',
        color: ''
    }

    nameChange = event => {
        this.setState({ name: event.target.value });
    }
    dueChange = event => {
        this.setState({ dueDate: event.target.value });
    }
    closureChange = event => {
        this.setState({ closureDate: event.target.value });
    }
    colorChange = event => {
        console.log(event.target.value)
        this.setState({ color: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        const addCard = {
            name: this.state.name,
            dueDate: this.state.dueDate,
            closureDate: this.state.closureDate,
            color: this.state.color
        };

        axiosInstance.post(Endpoints.card.add(), addCard).then(response => {
            const id = response.data.Body;
            refreshPage()
        })

    }

    render() {
        const lis = []
        for (var i = 1; i <= 31; i++) {
            lis.push(<option value={i}>{i}</option>)
        }

        return (
            <Modal
                {...this.props}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.head}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control name="name" onChange={this.nameChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dia de vencimento</Form.Label>
                            <Form.Control name="dueDate" onChange={this.dueChange} as="select">
                                {lis}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dia de fechamento</Form.Label>
                            <Form.Control name="value" onChange={this.closureChange} as="select">
                                {lis}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="exampleColorInput">Cor do cartão</Form.Label>
                            <Form.Control
                                type="color"
                                id="exampleColorInput"
                                defaultValue="#563d7c"
                                title="Choose your color"
                                onChange={this.colorChange}
                            />
                        </Form.Group>


                        <Button variant="dark" type="submit"> Adicionar </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



