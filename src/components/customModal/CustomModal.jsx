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

    const pageChange = event => {
        setPageNumber(event.target.text);
    }

    useEffect(() => {
        axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 20, '', month, '2022', '', '', '', props.id))
            .then(res => {
                setInstallments(res.data);
            })
    }, [pageNumber, month])


    const lis = installments?.items?.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.debtName}</td>
                <td>{item.installmentNumber == 0 ? "Fixa" : item.installmentNumber}</td>
                <td>R$ {decimalAdjust(item.value)}</td>
                <td>{dateAdjust(item.date)}</td>
                <td>{statusTransform(item.status)}</td>
            </tr>
        )
    })

    const valueTotal = installments?.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);
    return (
        <Modal
            {...props}
            className="modalInstallments"
            scrollable="true"
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <div id="head">
                        <Button size="sm" onClick={() => setMonth(parseInt(month) - 1)}>
                            <i className="fas fa-angle-left" aria-hidden="true"></i>
                        </Button>
                        {monthByNumber(month)}
                        <Button size="sm" onClick={() => setMonth(parseInt(month) + 1)}>
                            <i className="fas fa-angle-right" aria-hidden="true"></i>
                        </Button>
                    </div>
                    {props.head} - R$ {decimalAdjust(valueTotal)}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table responsive hover variant="white" className="installmentsTable" size="sm">
                    <thead>
                        <tr>
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
                <CustomPagination currentPage={installments.currentPage} totalItems={installments.totalItems} totalPages={installments.totalPages} onChange={pageChange}></CustomPagination>
            </Modal.Body>
        </Modal>
    )
}
