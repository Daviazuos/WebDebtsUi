import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';


function refreshPage() {
    window.location.reload();
}


export default class ModalPaid extends React.Component {
    state = {
        date: '',
    }

    dateChange = event => {
        this.setState({ date: event.target.value });
    }
   
    handleSubmit = event => {
        event.preventDefault();
        if (this.props.isCard == true) {
            axiosInstance.put(Endpoints.debt.put(null, this.props.value, "Paid", this.state.date)).then(response => {
                const id = response.data.Body;
                refreshPage()
            })
        }else {
            axiosInstance.put(Endpoints.debt.put(this.props.value, null,  "Paid", this.state.date)).then(response => {
                const id = response.data.Body;
                refreshPage()
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
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Data pagamento</Form.Label>
                            <Form.Control required="true" name='date' type="date" onChange={this.dateChange} placeholder="Entre com o data" />
                        </Form.Group>
                        <Button className="btn btn-success" type="submit">Pago <i className="fas fa-check"></i></Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



