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
import ModalNextMonth from "../../components/Modals/ModalNextMonth";


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
      <div className={`indicator ${props.status === 'Paid' ? '' : 'unpaid'}`} onClick={props.status === 'Paid' ? '' : () => setModalShow(!modalShow)}>
        <span className="icon">{props.status === 'Paid' ? '\u2714' : '\u26A0'}</span> {/* Ícone de alerta ou check */}
      </div>

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

function SetModalJumpNextMonth(props) {
  const [modalShow, setModalShow] = React.useState(false);

  function updateValuesv2() {
    props.update(!props.updateStatus);
  }

  return (
    <>
      <Button disabled={props.disabled} size="sm" className='nexMonthbutton' onClick={() => setModalShow(true)}>
        <i className={props.simbol}></i> {props.modalName}
      </Button>
      <ModalNextMonth
        value={props.value}
        show={modalShow}
        onHide={() => setModalShow(false)}
        head={props.name}
        data={props.data}
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
  const [pageCardNumber, setPageCardNumber] = React.useState(1);
  const [year, setYear] = React.useState(localStorage.getItem("year"))
  const [month, setMonth] = React.useState(localStorage.getItem("month"))
  const [paidStatus, setPaidStatus] = React.useState("")
  const [updateStatus, setUpdateStatus] = React.useState(false)
  const [modalShow, setModalShow] = React.useState(false);
  const [cardModalShow, setCardModalShow] = React.useState(false);
  const [cardPaginationData, setCardPaginationData] = React.useState([])


  const pageChange = event => {
    setPageNumber(event.target.text);
  }

  const pageCardChange = event => {
    setPageCardNumber(event.target.text);
  }

  const statusChange = event => {
    setPaidStatus(event.target.value);
  }

  function updateValues(change) {
    setUpdateStatus(change);
  }

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(pageNumber, 7, '', month, year, '', paidStatus, 'Simple', '', null))
      .then(res => {
        setFinancial(res.data)
      })
  }, [pageNumber, month, paidStatus, updateStatus])

  useEffect(() => {
    axiosInstance.get(Endpoints.card.filterCards(pageCardNumber, 7, '', month, year, false))
      .then(res => {
        let resultFiltered = []
        for (const card in res.data.items) {
          let debts = res.data.items[card]?.debts
          for (const debt in debts) {
            if (paidStatus !== "") {
              if (debts[debt]?.installments[0]?.status === paidStatus) {
                resultFiltered.push(res.data.items[card])
                break
              }
            } else {
              resultFiltered.push(res.data.items[card])
              break
            }

          }
        }
        setCardPaginationData(res.data)
        setCards(resultFiltered)
      })
  }, [pageCardNumber, month, paidStatus, updateStatus])
  
  const debtTableData = financial.items?.map(item => {
    let installmentText = ""
    if (item.numberOfInstallments > 0 && item.installmentNumber > 0) {
      installmentText = `Parcela ${item.installmentNumber} de ${item.numberOfInstallments}`
    } else if (item.numberOfInstallments === 0 && item.installmentNumber === 1) {
      installmentText = "Parcela única"
    } else if (item.numberOfInstallments === 0 && item.installmentNumber === 0) {
      installmentText = "Fixa"
    }

    return (
      <div className="card-financial">
        <div className="card-content-financial">
          <div className="debt-name">{item.debtName}</div>
          <div className="installment-text">{installmentText}</div>
          <div className="debt-value">R$ {decimalAdjust(item.value)}</div>
          <div className="debt-date">{dateAdjust(item.date)}</div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: item.numberOfInstallments === 0 ? '0%' : `${(item.installmentNumber / item.numberOfInstallments) * 100}%` }}></div> {/* Ajuste a largura conforme necessário */}
          </div>
        </div>
        <SetModalPaid
          disabled={false}
          name={item.debtName}
          modalName="Pagar"
          simbol=""
          value={item.id}
          month={month}
          year={year}
          isCard={false}
          update={updateValues}
          updateStatus={updateStatus}
          amount={item.value}
          status={item.status}>
        </SetModalPaid>
      </div>
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

    return (
        <div className="card-financial">
          <div className="card-background" style={{ '--corFundo': item.color }}></div>
          <div className="card-content-financial">
            <div className="debt-name">{item.name}</div>
            <div className="installment-text">Cartão de crédito</div>
            <div className="debt-value">R$ {decimalAdjust(cardValue)}</div>
            <div className="debt-date">{item.dueDate}/{addLeadingZeros(month, 2)}/{year}</div>

          </div>
           <SetModalPaid 
              disabled={false}
              name={item.name}
              modalName="Pagar"
              simbol=""
              value={item.id} 
              month={month} 
              year={year} 
              isCard={true} 
              update={updateValues} 
              updateStatus={updateStatus} 
              amount={cardValue} 
              classname='btn btn-danger'
              status={cardStatus}>
            </SetModalPaid>
        </div >
    )
  })

  return (
    <>
      <span id="PagesTitle">Finanças</span>
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
        <Card className='cardFinancialTable'>
          {debtTableData}
          <p></p>
          {(financial.totalItems !== undefined) ?
            <PaginationComponent
              itemsCount={financial.totalItems}
              itemsPerPage={7}
              currentPage={financial.currentPage}
              setCurrentPage={setPageNumber}
              alwaysShown={false}
            /> : ""}
        </Card>
        <Card className='cardFinancialTable'>
          {cardTableData}
          <p></p>
          {(cardPaginationData.totalItems !== undefined) ?
            <PaginationComponent
              itemsCount={cardPaginationData.totalItems}
              itemsPerPage={7}
              currentPage={cardPaginationData.currentPage}
              setCurrentPage={setPageCardNumber}
              alwaysShown={false}
            /> : ""}
        </Card>
        <Card className='cardFinancialTable'></Card>
      </div>
    </>)
};
