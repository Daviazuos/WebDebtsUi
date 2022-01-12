import React from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";


import "./installments.css"

export default class ModalInstallments extends React.Component {
    state = {
        installments: []
    }
    componentDidMount() {
        axiosInstance.get(Endpoints.debt.filterInstallments(this.props.value, '','','',''))
            .then(res => {
                const installments = res.data;
                this.setState({ installments });
            })
    }

    render() {
        const lis = this.state.installments.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.installmentNumber == 0? "" : item.installmentNumber}</td>
                    <td>
                        R$ {decimalAdjust(item.value)}
                    </td>
                    <td>{item.date}</td>
                    <td>{statusTransform(item.status)}</td>
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



