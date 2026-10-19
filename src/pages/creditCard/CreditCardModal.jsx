import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import "./CreditCardModal.css";

function refreshPage() {
    window.location.reload();
}


export default class CreditCardModal extends React.Component {
    state = {
        name: '',
        dueDate: '',
        closureDate: '',
        color: '#5840d8'
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
                centered
                className="creditCardCreateModal"
            >
                <Modal.Header closeButton>
                    <div className="creditCardCreateHeading">
                        <span className="creditCardCreateIcon"><i className="fas fa-credit-card" aria-hidden="true"></i></span>
                        <div>
                            <span className="creditCardCreateEyebrow">FINANÇAS / CRÉDITO</span>
                            <Modal.Title>{this.props.head}</Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form className="creditCardCreateForm" onSubmit={this.handleSubmit}>
                        <Form.Group className="creditCardCreateField" controlId="creditCardName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control name="name" placeholder="Ex.: Cartão principal" onChange={this.nameChange} />
                        </Form.Group>
                        <Form.Group className="creditCardCreateField" controlId="creditCardDueDate">
                            <Form.Label>Dia de vencimento</Form.Label>
                            <Form.Control name="dueDate" onChange={this.dueChange} as="select">
                                {lis}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="creditCardCreateField" controlId="creditCardClosureDate">
                            <Form.Label>Dia de fechamento</Form.Label>
                            <Form.Control name="value" onChange={this.closureChange} as="select">
                                {lis}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="creditCardCreateField creditCardColorField" controlId="creditCardColor">
                            <Form.Label>Cor do cartão</Form.Label>
                            <div className="creditCardColorOptions" aria-label="Escolha a cor do cartão">
                                {[
                                    { name: "Violeta", value: "#5840d8" },
                                    { name: "Azul", value: "#2584d8" },
                                    { name: "Verde", value: "#348c59" },
                                    { name: "Turquesa", value: "#159e9a" },
                                    { name: "Laranja", value: "#d9822b" },
                                    { name: "Vermelho", value: "#c74747" },
                                    { name: "Grafite", value: "#424b57" }
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`creditCardColorSwatch${this.state.color === option.value ? " isSelected" : ""}`}
                                        style={{ backgroundColor: option.value }}
                                        aria-pressed={this.state.color === option.value}
                                        aria-label={option.name}
                                        title={option.name}
                                        onClick={() => this.setState({ color: option.value })}
                                    />
                                ))}
                                <label className="creditCardCustomColor" title="Escolher outra cor">
                                    <Form.Control
                                        type="color"
                                        value={this.state.color}
                                        aria-label="Escolher outra cor"
                                        onChange={this.colorChange}
                                    />
                                    <i className="fas fa-palette" aria-hidden="true"></i>
                                </label>
                            </div>
                            <span className="creditCardSelectedColor">
                                Cor selecionada <strong>{this.state.color.toUpperCase()}</strong>
                            </span>
                        </Form.Group>

                        <Button className="creditCardCreateSubmit" type="submit">
                            <i className="fas fa-plus" aria-hidden="true"></i>
                            Adicionar cartão
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}
