import React, { useContext, useEffect } from "react";
import { Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import { statusTransform } from "../../utils/enumFormatter";

import { dateAdjust } from "../../utils/dateFormater";
import Context from "../../context/Context";
import { CustomPagination } from "../customPagination/customPagination";

export default function CustomModal(props) {
    const [installments, setInstallments] = React.useState([]);
    const [month, setMonth] = useContext(Context);
    const [pageNumber, setPageNumber] = React.useState(1);
  
    const pageChange = event => {
      setPageNumber(event.target.text);
    }

    useEffect(() => {
        let mounted = true;
        axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 20, '', props.month, '2022', '', '', '', props.id))
            .then(res => {
                setInstallments(res.data);
            })
        return () => mounted = false;
    }, [pageNumber, props.month])


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
    return (
        <Modal
            {...props}
            className="modalInstallments"
            scrollable="true"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.head} - R$ {props.totalValue}
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
