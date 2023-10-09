import React, { useContext, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";

import { dateAdjust, monthByNumber } from "../../utils/dateFormater";
import Context from "../../context/Context";
import { CustomPagination } from "../customPagination/customPagination";
import "./CustomModal.css"

export default function CustomModal(props) {
    const [installments, setInstallments] = React.useState([]);
    const [month, setMonth] = React.useState(props.month);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [year, setyear] = React.useState(localStorage.getItem("year"));

    const pageChange = event => {
        setPageNumber(event.target.text);
    }

    useEffect(() => {
        if (props.show === true) {
            axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 25, '', month, year, '', '', '', props.id, null))
                .then(res => {
                    setInstallments(res.data);
                })
        }
    }, [pageNumber, month, props.show])


    const lis = installments?.items?.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.debtName}</td>
                <td>{item.category}</td>
                <td>{item.installmentNumber == 0 ? "Fixa" : item.installmentNumber}</td>
                <td>R$ {decimalAdjust(item.value)}</td>
                <td>{dateAdjust(item.date)}</td>
            </tr>
        )

    })

    let cardValue = 0.00

    for (const installment in installments?.items) {
        cardValue = cardValue + installments?.items[installment].value
    }

    return (
        <Modal
            {...props}
            className="modalInstallments"
            scrollable
            size="lg"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.head} - R$ {props.totalValue}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive hover variant="white" size="sm">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Parcela</th>
                            <th>Valor</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lis}
                    </tbody>
                </Table>
                <CustomPagination currentPage={installments.currentPage} totalItems={installments.totalItems} totalPages={installments.totalPages} onChange={pageChange}></CustomPagination>
            </Modal.Body>
        </Modal>
    )
}
