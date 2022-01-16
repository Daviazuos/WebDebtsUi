import React from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";

import { dateAdjust } from "../../utils/dateFormater";

function SetStatus(id, status) {
    axiosInstance.put(Endpoints.debt.put(id, status)).then(response => {
        const id = response.data.Body;
        refreshPage()
    })
    return (
        <>
            Status Trocado!
        </>
    )
}

function refreshPage() {
    window.location.reload();
  }
  

export default class ModalPaid extends React.Component {
    state = {
        installments: []
    }
    componentDidMount() {
        axiosInstance.get(Endpoints.debt.filterInstallments(1, this.props.value, '', '', '', ''))
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    render() {
        const lis = this.state.installments.items?.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.installmentNumber == 0 ? "" : item.installmentNumber}</td>
                    <td>
                        R$ {decimalAdjust(item.value)}
                    </td>
                    <td>{dateAdjust(item.date)}</td>
                    <td>{statusTransform(item.status)}</td>
                </tr>
            )
        })
        console.log(this.props)
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
                            <Form.Control name='date' type="date" onChange={this.dateChange} placeholder="Entre com o data" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Carteira</Form.Label>
                            <Form.Control as="select" name='debtInstallmentType' onChange={this.typeChange}>
                                <option value="0">Salário</option>
                                <option value="1">Piscina</option>
                                <option value="2">Bolsa</option>
                            </Form.Control>
                        </Form.Group>
                        <Button className="btn btn-success" onClick={() => SetStatus(this.props.value, "Paid")}>Pago <i className="fas fa-check"></i></Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}



