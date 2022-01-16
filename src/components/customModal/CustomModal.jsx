import React from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";

import { dateAdjust } from "../../utils/dateFormater";

export default class CustomModal extends React.Component {
    state = {
        installments: []
    }
    componentDidMount() {
        axiosInstance.get(Endpoints.card.filterCards(this.props.id, this.props.month, this.props.year))
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    render() {
        const lis = this.state.installments[0]?.debts.map(item => {
            console.log(this.props.month)
            return (
                <tr key={item.installments[0]?.id}>
                    <td>{item.name}</td>
                    <td>{item.installments[0]?.installmentNumber == 0? "" : item.installments[0]?.installmentNumber}</td>
                    <td>R$ {decimalAdjust(item.installments[0]?.value)}</td>
                    <td>{dateAdjust(item.installments[0]?.date)}</td>
                    <td>{statusTransform(item.installments[0]?.status)}</td>
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
                    <Table responsive striped bordered hover variant="white" className="installmentsTable">
                        <thead>
                            <tr className="trr">
                                <th>Nome</th>
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



