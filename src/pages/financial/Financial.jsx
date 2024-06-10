import React, { useEffect } from "react";

import { Card, Button, Table, Form } from "react-bootstrap";
import "./Financial.css"

import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";
import { dateAdjust } from "../../utils/dateFormater";
import { statusTransform } from "../../utils/enumFormatter";
import ModalPaid from "../../components/Modals/ModalPaid";
import { refreshPage } from "../../utils/utils";
import PaginationComponent from "../../components/customPagination/paginationComponent";


function SetStatus(id, status, date) {
  axiosInstance.put(Endpoints.debt.put(id, status, date, "")).then(response => {
    refreshPage()
  })
}

function SetCardStatus(id, status, date) {
  axiosInstance.put(Endpoints.debt.put("", id, status, date, "")).then(response => {
    refreshPage()
  })
}


function SetModalPaid(props) {
  const [modalShow, setModalShow] = React.useState(false);

  function updateValuesv2() {
    props.update(!props.updateStatus);
  }

  return (
    <>
      <Button disabled={props.disabled} size="sm" className={props.classname} onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalPaid
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
        amount={props.amount}
        month={props.month}
        year={props.year}
        isCard={props.isCard}
        update={updateValuesv2}
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
  const [paidStatus, setPaidStatus] = React.useState("")
  const [updateStatus, setUpdateStatus] = React.useState(false)


  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  const statusChange = event => {
    setPaidStatus(event.target.value);
  }

  function updateValues(change) {
    setUpdateStatus(change);
  }


  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 15, '', month, year, '', paidStatus, 'Simple', '', null))
      .then(res => {
        setFinancial(res.data)
      })
  }, [pageNumber, month, paidStatus, updateStatus])

  useEffect(() => {
    axiosInstance.get(Endpoints.card.filterCards('', month, year))
      .then(res => {
        let resultFiltered = []
        for (const card in res.data) {
          let debts = res.data[card]?.debts
          for (const debt in debts) {
            if (paidStatus !== "") {
              if (debts[debt]?.installments[0]?.status === paidStatus) {
                resultFiltered.push(res.data[card])
                break
              }
            } else {
              resultFiltered.push(res.data[card])
              break
            }

          }
        }

        setCards(resultFiltered)
      })
  }, [month, paidStatus, updateStatus])

  const debtTableData = financial.items?.map(item => {
    return (
      <tr>
        <td>{item.debtName}</td>
        <td>R$ {decimalAdjust(item.value)}</td>
        <td>{dateAdjust(item.date)}</td>
        <td>{dateAdjust(item.paymentDate)}</td>
        <td>
          {item.status === 'Paid' ? <SetModalPaid disabled={true} modalName="Pago" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={false} classname='btn btn-green'></SetModalPaid> :
            <SetModalPaid disabled={false} name={item.debtName} modalName="A pagar" simbol="fas fa-times" value={item.id} month={month} year={year} isCard={false} update={updateValues} updateStatus={updateStatus} amount={item.value} classname='btn btn-danger'></SetModalPaid>}
        </td>
      </tr>
    )
  })
  const cardTableData = cards.map(item => {

    let cardValue = 0.00
    let cardStatus = undefined
    let paymentDate = undefined


    for (const debt in item?.debts) {
      if (item?.debts[debt]?.installments[0]?.value != undefined) {
        cardValue = cardValue + item?.debts[debt]?.installments[0]?.value
        cardStatus = item?.debts[debt]?.installments[0]?.status
        paymentDate = item?.debts[debt]?.installments[0]?.paymentDate
      }
    }

    if (cardValue === 0) {
      return ""
    }

    return (
      <tr>
        <td>{item.name}</td>
        <td>R$ {decimalAdjust(cardValue)}</td>
        <td>{item.dueDate}/{addLeadingZeros(month, 2)}/{year}</td>
        <td>{dateAdjust(paymentDate)}</td>
        <td>
          {cardStatus === 'Paid' ? <SetModalPaid disabled={true} modalName="Pago" simbol="fas fa-check" value={item.id} month={month} year={year} isCard={true} classname='btn btn-green'></SetModalPaid> :
            <SetModalPaid disabled={false} name={item.name} modalName="A pagar" simbol="fas fa-times" value={item.id} month={month} year={year} isCard={true} update={updateValues} updateStatus={updateStatus} amount={cardValue} classname='btn btn-danger'></SetModalPaid>}
        </td>
      </tr>
    )
  })

  return (
    <>
    <div className="selectorPaid">
        <Form.Group className="mb-3">
          <Form.Control type="search" id="typeSearch" as="select" onChange={statusChange}>
            <option value="">Filtrar por status</option>
            <option value="Paid">Pago</option>
            <option value="NotPaid">Não pago</option>
          </Form.Control>
        </Form.Group>
      </div>
    <div className="financialTables">
      <Card className='debtTable'>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {debtTableData}
          </tbody>
        </Table>
        {(financial.totalItems !== undefined) ?
          <PaginationComponent
            itemsCount={financial.totalItems}
            itemsPerPage={15}
            currentPage={financial.currentPage}
            setCurrentPage={setPageNumber}
            alwaysShown={false}
          /> : ""}
      </Card>
      <Card className='cardTable'>
        <Table responsive hover variant="white" className="tableFinancial" size="sm">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {cardTableData}
          </tbody>
        </Table>
      </Card>

    </div>
    </>)
};
