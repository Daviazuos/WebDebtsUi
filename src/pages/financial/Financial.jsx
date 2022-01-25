import React, {useEffect} from "react";

import { Card, Button, Table, Container, Pagination } from "react-bootstrap";
import "./Financial.css"

import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import { dateAdjust, monthByNumber } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import ModalPaid from "../../components/Modals/ModalPaid";
import { getMonthYear, refreshPage } from "../../utils/utils";
import { CustomPagination } from "../../components/customPagination/customPagination";


const { month, year } = getMonthYear()

function SetStatus(id, status) {
  axiosInstance.put(Endpoints.debt.put(id, status, "", "")).then(response => {
    const id = response.data.Body;
    refreshPage()
  })
}


function SetModalPaid(props) {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <>
      <Button className='btn btn-green' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalPaid
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
      />
    </>
  );
}

export default function Financial() {
  const [financial, setFinancial] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);

  const pageChange = event => {
    console.log(event.target.text)
    setPageNumber(event.target.text);
  }

  useEffect(() => {
    let mounted = true;
    console.log(pageNumber)
    axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, '', month, year, '', ''))
      .then(res => {
        setFinancial(res.data)
      })
    return () => mounted = false;
  }, [pageNumber])

  const tableData = financial.items?.map(item => {
    return (
      <tr>
        <td className="td1">{item.debtName}</td>
        <td className="td1">R$ {decimalAdjust(item.value)}</td>
        <td className="td1">{dateAdjust(item.date)}</td>
        <td className="td1">{statusTransform(item.status)}</td>
        <td className="tdd">
          <SetModalPaid modalName="" simbol="fas fa-check" value={item.id}></SetModalPaid>
          <Button className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}><i className="fas fa-times"></i></Button>
        </td>
        <td className="td1">{dateAdjust(item.paymentDate)}</td>
      </tr>
    )
  })

  return (
    <Container className="financial">
      <Card className='cardTable'>
        <Table responsive striped bordered hover variant="white" className="tableFinancial">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Ação</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {tableData}
          </tbody>
        </Table>
        <CustomPagination currentPage={financial.currentPage} totalItems={financial.totalItems} totalPages={financial.totalPages} onChange={pageChange}></CustomPagination>
      </Card>
    </Container>
  )
};
