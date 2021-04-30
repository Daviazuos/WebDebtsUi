import React from "react";
import { Table, Card, Modal } from "react-bootstrap";
import axios from "axios";

export default class ModalInstallments extends React.Component {
    state = {
        installments: []
    }
    componentDidMount() {
        axios.get(`https://localhost:5001/Debts/FilterInstallments?DebtId=${this.props.value}`)
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    render() {
        const lis = this.state.installments.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.installmentNumber}</td>
                    <td>
                        R$ {item.value}
                    </td>
                    <td>{item.date}</td>
                </tr>
            )
        })
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Card>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.head}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped bordered hover variant="white" className="table">
                            <thead>
                                <tr>
                                    <th>Parcela</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lis}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Card>
            </Modal>
        )
    }
}



