import React, { useContext, useEffect } from "react";

import { Card, Button, Table, Container, Pagination } from "react-bootstrap";
import "./Financial.css"

import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import { dateAdjust } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import ModalPaid from "../../components/Modals/ModalPaid";
import { getMonthYear, refreshPage } from "../../utils/utils";
import { CustomPagination } from "../../components/customPagination/customPagination";
import Context from "../../context/Context";


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
      <Button disabled={props.disabled} size="sm" className='btn btn-green' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalPaid
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
        month={props.month}
        year={props.year}
        isCard={props.isCard}
      />
    </>
  );
}

export default function Financial() {
  const [financial, setFinancial] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [year, setYear] = React.useState(localStorage.getItem("year"))
  const [month, setMonth] = React.useState(localStorage.getItem("month"))


  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 5, '', month, year, '', '', 'Simple', ''))
      .then(res => {
        setFinancial(res.data)
      })
  }, [pageNumber, month])

  useEffect(() => {
    axiosInstance.get(Endpoints.card.filterCards('', month, year))
      .then(res => {
        setCards(res.data)
      })
  }, [month])

  const debtTableData = financial.items?.map(item => {
    return (
      <tr>
        <td className="td1">{item.debtName}</td>
        <td className="td1">R$ {decimalAdjust(item.value)}</td>
        <td className="td1">{dateAdjust(item.date)}</td>
        <td className="td1">{item.status == 'Paid' ? <i class="fas fa-circle success fa-xs"></i> : <i class="fas fa-circle red fa-xs"></i>}   {statusTransform(item.status)}</td>
        <td className="td1">{dateAdjust(item.paymentDate)}</td>
        <td className="tdd">
          {item.status == 'Paid' ? <SetModalPaid disabled={true} modalName="Pagar" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={false}></SetModalPaid> :
            <SetModalPaid disabled={false} modalName="Pagar" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={false}></SetModalPaid>}
          {item.status == 'Paid' ?
            <Button disabled={false} size="sm" className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}><i className="fas fa-times"></i> Pendente</Button> :
            <Button disabled={true} size="sm" className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}><i className="fas fa-times"></i> Pendente</Button>}
        </td>
      </tr>
    )
  })
  const cardTableData = cards.map(item => {

    let cardValue = 0.00


    for (const debt in item?.debts) {
      if (item?.debts[debt]?.installments[0]?.value != undefined) {
        cardValue = cardValue + item?.debts[debt]?.installments[0]?.value
      }
    }

    if (cardValue === 0) {
      return ""
    }

    const cardStatus = item.debts[0]?.installments[0]?.status

    const paymentDate = item.debts[0]?.installments[0]?.paymentDate

    return (
      <tr>
        <td className="td1">{item.name}</td>
        <td className="td1">R$ {decimalAdjust(cardValue)}</td>
        <td className="td1">{item.dueDate}/{month}/{year}</td>
        <td className="td1">{cardStatus == 'Paid' ? <i class="fas fa-circle success fa-xs"></i> : <i class="fas fa-circle red fa-xs"></i>}  {statusTransform(cardStatus)}</td>
        <td className="td1">{dateAdjust(paymentDate)}</td>
        <td className="tdd">
          {cardStatus == 'Paid' ? <SetModalPaid disabled={true} modalName="Pagar" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={true}></SetModalPaid> :
            <SetModalPaid disabled={false} modalName="Pagar" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={true}></SetModalPaid>}
          {cardStatus == 'Paid' ?
            <Button disabled={false} size="sm" className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}><i className="fas fa-times"></i> Pendente</Button> :
            <Button disabled={true} size="sm" className="btn btn-danger" onClick={() => SetStatus(item.id, "NotPaid")}><i className="fas fa-times"></i> Pendente</Button>}
        </td>
      </tr>
    )
  })

  return (
    <Container className="financial">
      <Card className='cardTable'>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Pagamento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {debtTableData}
          </tbody>
        </Table>
        <CustomPagination currentPage={financial.currentPage} totalItems={financial.totalItems} totalPages={financial.totalPages} onChange={pageChange}></CustomPagination>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th>Pagamento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {cardTableData}
          </tbody>
        </Table>
      </Card>
    </Container>
  )
};
