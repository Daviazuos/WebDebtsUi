import React from "react";
import { Table, Card, Modal } from "react-bootstrap";
import axios from "axios";
import "./installments.css"

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
                    <td>{item.status}</td>
                </tr>
            )
        })
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
                    <Table striped bordered hover variant="white" className="installmentsTable">
                        <thead>
                            <tr className="trr">
                                <th>Parcela</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lis}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        )
    }
}



