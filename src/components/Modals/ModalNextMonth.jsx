import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import LoadingButton from "../loadingButton/LoadingButton";
import { decimalAdjust } from "../../utils/valuesFormater";
import { addMonthsToDate, addMonthsToMonth, monthByNumber } from "../../utils/dateFormater";


export default class ModalNextMonth extends React.Component {
    state = {
        date: new Date().toISOString(),
        isLoading: false
    }

    dateChange = event => {
        this.setState({ date: event.target.value });
    }

    

    handleSubmit = event => {
        this.setState({ isLoading: true })
        event.preventDefault();
        const editInstallmentLine = {
            date: this.state.date,
            paymentDate: this.props.data.paymentDate,
            installmentNumber: this.props.data.installmentNumber,
            value: this.props.data.value,
        };

        axiosInstance.put(Endpoints.debt.putInstallment(this.props.value), editInstallmentLine)
            .then(response => {
                this.setState({ isLoading: false })
                this.props.update()
                this.props.onHide()
            })
    }

    render() {
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
                    Valor a adiar: R$ {decimalAdjust(this.props.data.value)}
                    <p></p>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Data da transferencia</Form.Label>
                            <Form.Control required="true" name='date' type="date" onChange={this.dateChange} defaultValue={this.state.date} placeholder="Entre com o data" />
                        </Form.Group>
                        <p></p>
                        <LoadingButton variant="dark" type="submit" name="Adiar" isLoading={this.state.isLoading}></LoadingButton>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



