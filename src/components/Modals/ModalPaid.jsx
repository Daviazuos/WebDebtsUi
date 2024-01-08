import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import LoadingButton from "../loadingButton/LoadingButton";
import { decimalAdjust } from "../../utils/valuesFormater";


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
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.head}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Valor a pagar: R$ {decimalAdjust(this.props.data?.value)}
                    <p></p>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Data pagamento</Form.Label>
                            <Form.Control required="true" name='date' type="date" onChange={this.dateChange} defaultValue={this.state.date} placeholder="Entre com o data" />
                        </Form.Group>
                        <p></p>
                        <LoadingButton variant="dark" type="submit" name="Pagar" isLoading={this.state.isLoading}></LoadingButton>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



