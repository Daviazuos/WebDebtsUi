import React from "react";
import { Form, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import LoadingButton from "../loadingButton/LoadingButton";
import { decimalAdjust } from "../../utils/valuesFormater";
import "./ModalPaid.css";


export default class ModalPaid extends React.Component {
    state = {
        date: new Date().toISOString().substring(0, 10),
        isLoading: false
    }

    dateChange = event => {
        this.setState({ date: event.target.value });
    }

    handleSubmit = event => {
        this.setState({ isLoading: true })
        event.preventDefault();
        if (this.props.isCard == true) {
            axiosInstance.put(Endpoints.debt.put(null, this.props.value, "Paid", this.state.date)).then(response => {
                this.setState({ isLoading: false })
                this.props.update()
                this.props.onHide()
            })
        } else {
            axiosInstance.put(Endpoints.debt.put(this.props.value, null, "Paid", this.state.date)).then(response => {
                this.setState({ isLoading: false })
                this.props.update()
                this.props.onHide()
            })
        }
    }

    render() {
        return (
            <Modal
                {...this.props}
                centered
                className="paymentModal"
            >
                <Modal.Header closeButton>
                    <div className="paymentModalHeading">
                        <span className="paymentModalIcon"><i className="fas fa-hand-holding-usd" aria-hidden="true"></i></span>
                        <div>
                            <span className="paymentModalEyebrow">REGISTRAR PAGAMENTO</span>
                            <Modal.Title>{this.props.head}</Modal.Title>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="paymentAmount">
                        <span>Valor a pagar</span>
                        <strong>R$ {decimalAdjust(this.props.amount)}</strong>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group className="paymentDateGroup" controlId="paymentDate">
                            <Form.Label>Data do pagamento</Form.Label>
                            <Form.Control required name="date" type="date" onChange={this.dateChange} defaultValue={this.state.date} />
                        </Form.Group>
                        <LoadingButton className="paymentSubmit" type="submit" name="Confirmar pagamento" isLoading={this.state.isLoading} />
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}


