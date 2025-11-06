import React, { useEffect, useState } from "react";
import { Card, Table, Image, Modal, Button } from "react-bootstrap";
import imageEmpty from '../../assets/empty.png'


import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

import { addLeadingZeros, decimalAdjust, decimalAdjustWithoutPoint } from "../../utils/valuesFormater";

import "./Dashboard.css";
import CustomCard from "../../components/customCard/CustomCard";
import CardApexGraphic from "../../components/cardGraphic/CardApexGraphic";
import CardApexGraphicPie from "../../components/cardGraphicPie/CardApexGraphicPie";
import CardApexGraphicByDay from "../../components/cardGraphic/CardApexGraphicByDay";
import CustomCardSize from "../../components/customCardSize/CustomCardSize";
import { addOrRemoveMonth, monthByNumber } from "../../utils/dateFormater";
import DebtList from "../../components/form/form";
import FloatingButtonWithModal from "../../components/floatingButton/floatingButton";
import GanttGraphic from "../../components/ganttGraphic/GanttGraphic";
import DashModal from "./DashModal";
import UpcomingBill from "../../components/cardCommingBills/CardCommingBills";


export default function Dashboard() {
  const [month, setMonth] = useState(localStorage.getItem("month"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [sumAllValue, setSumAllValue] = useState([]);
  const [fixedValue, setFixedValue] = useState([]);
  const [simpleValue, setSimpleValue] = useState([]);
  const [installmentValue, setInstallmentValue] = useState([]);
  const [category, setCategory] = useState(null);
  const [debts, setDebts] = useState({ items: [] })
  const [cards, setCards] = useState([])
  const [drafts, setDrafts] = useState([])
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transformAddDebt, setTransformAddDebt] = useState(false);
  const [draftSelected, setDraftSelected] = useState(null);
  const [deletedDraft, setDeletedDraft] = useState(false);
  const [list_instalments, setListInstalments] = useState([]);
  const [totalFinishing, setTotalFinishing] = useState(0.00);
  const [installmentTable, setInstallmentTable] = useState(<div></div>);
  const [fixedTable, setFixedTable] = useState(<div></div>);
  const [simpleTable, setSimpleTable] = useState(<div></div>);

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', '', null))
      .then(res => {
        setSumAllValue(res.data)
      })
  }, [month])


  const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Fixed', '', '', '', null))
      .then(res => {
        setFixedValue(res.data)
        const fixedTr = (res.data.items?.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.debtName}</td>
              <td>{item.category}</td>
              <td>R$ {decimalAdjust(item.value)}</td>
            </tr>
          )
        })
        )
        setFixedTable(<Table striped borderless hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {fixedTr}
          </tbody>
        </Table>)
      })
  }, [month])


  useEffect(() => {
    let lastDayFromMonth = new Date(year, month, 0).getUTCDate();
    axiosInstance.get(Endpoints.debt.filterWDate(1, 9999, '', '', 'Installment', '', false, `${year}-${month}-01T00:00:00`, `${year}-${month}-${lastDayFromMonth}T23:59:59`))
      .then(res => {
        setDebts(res.data);
        const lis_instalments = [];
        let totalFinishingSum = 0.00;
        const items = res.data.items;
        items.forEach(debtItem => {
          (debtItem.installments || []).forEach(inst => {
            if (debtItem.numberOfInstallments === inst.installmentNumber) {
              lis_instalments.push(
                <tr key={debtItem.id}>
                  <td>{debtItem.name}</td>
                  <td>R$ {decimalAdjust(inst.value)}</td>
                  <td>{inst.installmentNumber}/{debtItem.numberOfInstallments}</td>
                </tr>
              );
              totalFinishingSum += inst.value || 0;
            }
          });
        });

        setListInstalments(lis_instalments);
        setTotalFinishing(totalFinishingSum);
      })
  }, [month])

  const fixed = fixedValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Simple', '', '', '', null))
      .then(res => {
        setSimpleValue(res.data)
        const simpleTr = (res.data.items?.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.debtName}</td>
              <td>{item.category}</td>
              <td>R$ {decimalAdjust(item.value)}</td>
            </tr>
          )
        })
        )
        setSimpleTable(<Table striped borderless hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {simpleTr}
          </tbody>
        </Table>)
      })
  }, [month])

  const simple = simpleValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Installment', '', '', '', null))
      .then(res => {
        setInstallmentValue(res.data)
        const installmentTr = (res.data.items?.map(item => {
          return (
            <tr key={item.id}>
              <td>{item.debtName}</td>
              <td>{item.category}</td>
              <td>R$ {decimalAdjust(item.value)}</td>
            </tr>
          )

        })
        )
        setInstallmentTable(<Table striped borderless hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {installmentTr}
          </tbody>
        </Table>)
      }

      )

  }, [month])

  const installment = installmentValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getDebtCategories(month, year))
      .then(res => {
        const lis = res.data.map(item => {
          return (
            <tr>
              <td className='td1'>{item.name || "Sem categoria"}</td>
              <td className='td1'>R$ {decimalAdjust(item.value)}</td>
            </tr>
          )
        })
        setCategory(lis)
      })
  }, [month])

  useEffect(() => {
    setIsLoading(true)
    axiosInstance.get(Endpoints.card.filterCards(1, 9999, null, month, year))
      .then(res => {
        setCards(res.data.items);
        setIsLoading(!isLoading)
      })
  }, [month])

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.getDraftsDebtsByUser())
      .then(res => {
        setDrafts(res.data);
        if (res.data.length === 0) {
          setShow(false)
        }
        else {
          setShow(true)
        }
      })
  }, [transformAddDebt, deletedDraft])

  let lis_drafts = []

  for (const item in drafts) {
    lis_drafts.push(<tr key={item.id}>
      <td>{drafts[item].name}</td>
      <td>R$ {decimalAdjustWithoutPoint(drafts[item].value)}</td>
      <td>{drafts[item].card.name}</td>
      <td><i className="fas fa-arrow-down" onClick={() => {
        setTransformAddDebt(!transformAddDebt)
        setDraftSelected({ value: decimalAdjustWithoutPoint(drafts[item].value), cardId: drafts[item].card.id, name: drafts[item].name, date: drafts[item].date, draftId: drafts[item].id })
      }}></i></td>
      <td><i className="fas fa-trash" onClick={() => deleteDraft(drafts[item].id, false)}></i></td>
    </tr>)
  }

  let minDate = new Date()
  let minCreditCard = ''
  let closureDate = 0

  if (isLoading === false && cards[0]?.closureDate) {
    minDate = cards[0].closureDate > cards[0].dueDate ? new Date(year, month - 2, cards[0].closureDate) : new Date(year, month - 1, cards[0].closureDate)
    for (const card in cards) {
      let closingDate = cards[card].closureDate > cards[card].dueDate ? new Date(year, month - 2, cards[card].closureDate) : new Date(year, month - 1, cards[card].closureDate)
      if (closingDate < minDate) {
        minDate = closingDate
        minCreditCard = cards[card].name
        closureDate = cards[card].closureDate
      }
    }
  }

  const dataHoje = new Date();
  const calculateDate = new Date(dataHoje.getFullYear(), month == dataHoje.getMonth() ? addOrRemoveMonth(-1, month) : addOrRemoveMonth(-2, month), addOrRemoveMonth(-1, month) != addOrRemoveMonth(1, dataHoje.getMonth()) ? 1 : dataHoje.getDate())

  let provisionedValue = localStorage.getItem("provisionedValue");

  const dataFechamento = minDate

  function deleteDraft(id, transform = true) {
    axiosInstance.delete(Endpoints.debt.deleteDraft(id))
      .then(res => {
        if (transform) {
          setTransformAddDebt(!transformAddDebt)
        }
        setDeletedDraft(!deletedDraft)
      })
  }

  function updateValues(id) {
    deleteDraft(id)
  }



  return (
    <div>
      <div className="graphics">
        <Card className="graphicPagePie">
          <CardApexGraphicPie></CardApexGraphicPie>
        </Card>
        <Card className="cardDash">
          <CardApexGraphic></CardApexGraphic>
        </Card>
        <div style={{ display: "flex", padding: '0px' }} className="cardsValues">
          <CustomCard
            title="Fixas"
            children={decimalAdjust(fixed)}
            icon="far fa-calendar blue custom-icon"
            table={fixedTable}
          >
          </CustomCard>
          <CustomCard
            title="Simples"
            children={decimalAdjust(simple)}
            icon="fas fa-coins blue custom-icon"
            table={simpleTable}
          >
          </CustomCard>
          <CustomCard
            title="Parceladas"
            children={decimalAdjust(installment)}
            icon="fas fa-credit-card blue custom-icon"
            table={installmentTable}
          >
          </CustomCard>
        </div>
      </div>
      <div className="analitics">
        <Card className="outsByDay">
          <CardApexGraphicByDay></CardApexGraphicByDay>
        </Card>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Compras vindas do APP
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {transformAddDebt ? <DebtList draftId={draftSelected?.draftId} update={updateValues} cardId={draftSelected?.cardId} data={draftSelected}></DebtList> :
              <Table borderless striped responsive hover variant="black">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Cartão</th>
                  </tr>
                </thead>
                <tbody>
                  {lis_drafts}
                </tbody>
              </Table>}
          </Modal.Body>
        </Modal>
      </div>
    </div>);
};
