import React, { useEffect } from "react";

import { Button, Table, Form } from "react-bootstrap";
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
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";


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
      <button
        type="button"
        className={`indicator ${props.status === 'Paid' ? 'isPaid' : 'unpaid'}`}
        aria-label={props.status === 'Paid' ? `${props.name} pago` : `Registrar pagamento de ${props.name}`}
        title={props.status === 'Paid' ? 'Pago' : 'Registrar pagamento'}
        disabled={props.status === 'Paid'}
        onClick={() => setModalShow(true)}
      >
        <i className={`fas ${props.status === 'Paid' ? 'fa-check' : 'fa-exclamation'}`} aria-hidden="true"></i>
      </button>

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
      <article className="card-financial" key={item.id}>
        <div className="card-content-financial">
          <div className="debt-name">{item.debtName}</div>
          <div className="installment-text">{installmentText}</div>
          <div className="financialEntryDetails">
            <div className="debt-date">{dateAdjust(item.date)}</div>
            <div className="debt-value">R$ {decimalAdjust(item.value)}</div>
          </div>
          {item.numberOfInstallments === 0 && item.installmentNumber === 0 ? <div></div> :
          <div className="progress-bar-custom">
            <div className="progress-bar-fill" style={{ width: item.numberOfInstallments === 0 ? '0%' : `${(item.installmentNumber / item.numberOfInstallments) * 100}%` }}></div>
          </div>}
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
      </article>
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
      <article className="card-financial financialCardEntry" key={item.id}>
          <div className="card-background" style={{ '--corFundo': item.color }}></div>
          <div className="card-content-financial">
            <div className="debt-name">{item.name}</div>
            <div className="installment-text">Cartão de crédito</div>
            <div className="financialEntryDetails">
              <div className="debt-date">Vence {addLeadingZeros(item.dueDate, 2)}/{addLeadingZeros(month, 2)}/{year}</div>
              <div className="debt-value">R$ {decimalAdjust(cardValue)}</div>
            </div>

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
        </article >
    )
  })

  return (
    <main className="financialPage">
      <header className="financialPageHeader">
        <div>
          <span className="financialEyebrow">FINANÇAS / MOVIMENTAÇÕES</span>
          <h1>Finanças</h1>
          <p>Acompanhe pagamentos e vencimentos do período.</p>
        </div>
      </header>

      <section className="financialToolbar" aria-label="Filtros de movimentações">
        <div>
          <span className="financialToolbarLabel">Movimentações</span>
          <span className="financialToolbarHint">Filtre os lançamentos pelo status de pagamento</span>
        </div>
        <Form.Group className="financialStatusFilter">
          <Form.Label htmlFor="typeSearch">Status</Form.Label>
          <Form.Control id="typeSearch" as="select" value={paidStatus} onChange={statusChange}>
            <option value="">Todos os status</option>
            <option value="Paid">Pago</option>
            <option value="NotPaid">Não pago</option>
          </Form.Control>
        </Form.Group>
      </section>

      <div className="financialTables">
        <section className="financialPanel">
          <header className="financialPanelHeader">
            <span className="financialPanelIcon"><i className="fas fa-receipt" aria-hidden="true"></i></span>
            <div><h2>Despesas simples</h2><p>Lançamentos fora do cartão de crédito</p></div>
            <span className="financialPanelCount">{financial.totalItems || 0}</span>
          </header>
          <div className="financialEntries">
            {debtTableData?.length ? debtTableData : <div className="financialEmptyState">Nenhuma despesa encontrada.</div>}
          </div>
          <footer className="financialPanelFooter">
            {financial.totalItems !== undefined && (
              <PaginationComponent
                itemsCount={financial.totalItems}
                itemsPerPage={7}
                currentPage={financial.currentPage}
                setCurrentPage={setPageNumber}
                alwaysShown={false}
              />
            )}
          </footer>
        </section>

        <section className="financialPanel">
          <header className="financialPanelHeader">
            <span className="financialPanelIcon financialPanelIcon--card"><i className="fas fa-credit-card" aria-hidden="true"></i></span>
            <div><h2>Faturas de cartão</h2><p>Resumo dos cartões no período</p></div>
            <span className="financialPanelCount">{cardPaginationData.totalItems || 0}</span>
          </header>
          <div className="financialEntries">
            {cardTableData?.length ? cardTableData : <div className="financialEmptyState">Nenhuma fatura encontrada.</div>}
          </div>
          <footer className="financialPanelFooter">
            {cardPaginationData.totalItems !== undefined && (
              <PaginationComponent
                itemsCount={cardPaginationData.totalItems}
                itemsPerPage={7}
                currentPage={cardPaginationData.currentPage}
                setCurrentPage={setPageCardNumber}
                alwaysShown={false}
              />
            )}
          </footer>
        </section>
      </div>
    </main>
  )
};
