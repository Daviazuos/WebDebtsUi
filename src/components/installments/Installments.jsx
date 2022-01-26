import React, { useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";


import "./installments.css"
import { dateAdjust } from "../../utils/dateFormater";
import { CustomPagination } from "../customPagination/customPagination";

export default function ModalInstallments(props) {
    const [installments, setInstallments] = React.useState([]);
    const [pageNumber, setPageNumber] = React.useState(1);

    const pageChange = event => {
        console.log(event.target.text)
        setPageNumber(event.target.text);
    }

    useEffect(() => {
        let mounted = true;
        axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 10, props.value, '', '', '', ''))
            .then(res => {
                setInstallments(res.data)
            })
        return () => mounted = false;
    }, [pageNumber])

    const lis = installments.items?.map(item => {
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
    return (
        <Modal
            {...props}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.head}
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
                <CustomPagination currentPage={installments.currentPage} totalItems={installments.totalItems} totalPages={installments.totalPages} onChange={pageChange}></CustomPagination>
            </Modal.Body>
        </Modal>
    )
}



