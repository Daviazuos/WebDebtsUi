import { useEffect, useState } from "react";
import { Card, Table, Image } from "react-bootstrap";
import imageEmpty from '../../assets/empty.png'


import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";

import "./Dashboard.css";
import CustomCard from "../../components/customCard/CustomCard";
import CardApexGraphic from "../../components/cardGraphic/CardApexGraphic";
import CardApexGraphicPie from "../../components/cardGraphicPie/CardApexGraphicPie";
import CardApexGraphicByDay from "../../components/cardGraphic/CardApexGraphicByDay";
import CustomCardSize from "../../components/customCardSize/CustomCardSize";
import { addOrRemoveMonth, monthByNumber } from "../../utils/dateFormater";


export default function Dashboard() {
  const [month, setMonth] = useState(localStorage.getItem("month"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [sumAllValue, setSumAllValue] = useState([]);
  const [fixedValue, setFixedValue] = useState([]);
  const [simpleValue, setSimpleValue] = useState([]);
  const [installmentValue, setInstallmentValue] = useState([]);
  const [category, setCategory] = useState(null);
  const [debts, setDebts] = useState([])
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(true);



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
      })
  }, [month])


  useEffect(() => {
    let lastDayFromMonth = new Date(year, month, 0).getUTCDate();
    axiosInstance.get(Endpoints.debt.filterWDate(1, 9999, '', '', 'Installment', '', false, `${year}-${month}-01T00:00:00`, `${year}-${month}-${lastDayFromMonth}T23:59:59`))
      .then(res => {
        setDebts(res.data);
      })
  }, [month])

  const fixed = fixedValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Simple', '', '', '', null))
      .then(res => {
        setSimpleValue(res.data)
      })
  }, [month])

  const simple = simpleValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  useEffect(() => {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Installment', '', '', '', null))
      .then(res => {
        setInstallmentValue(res.data)
      })
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

  let lis_instalments = []
  let totalFinishing = 0.00

  for (const item in debts.items) {
    for (const installment in debts.items[item].installments) {
      if (debts.items[item].numberOfInstallments === debts.items[item].installments[installment].installmentNumber
      ) {
        lis_instalments.push(<tr key={item.id}>
          <td>{debts.items[item].name}</td>
          <td>
            R$ {decimalAdjust(debts.items[item].installments[installment].value)}
          </td>
          <td>{debts.items[item].installments[installment].installmentNumber}/{debts.items[item].numberOfInstallments}</td>
        </tr>)
        totalFinishing += debts.items[item].installments[installment].value
      }
    }
  }

  useEffect(() => {
    setIsLoading(true)
    axiosInstance.get(Endpoints.card.filterCards(1, 9999, null, month, year))
      .then(res => {
        setCards(res.data.items);
        setIsLoading(!isLoading)
      })
  }, [month])

  let minDate = new Date()
  let minCreditCard = ''
  let closureDate = 0

  if (isLoading == false && cards[0]?.closureDate) {
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
  const valorDisponivel = provisionedValue
  const diffMilissegundos = dataFechamento - calculateDate;
  const diasRestantes = Math.ceil(diffMilissegundos / (1000 * 60 * 60 * 24));
  const valorPorDia = valorDisponivel / diasRestantes;

  let day = `Valor por dia`
  let text = `${diasRestantes} dias referente ao cartão ${minCreditCard} que fecha dia ${closureDate}/${addLeadingZeros(month-1, 2)}`

  let showPerDay = dataHoje < dataFechamento || dataHoje > dataFechamento && dataHoje.getMonth() == dataFechamento.getMonth()

  return (
    <div>
      <div className="graphics">
        {showPerDay ?
          <div className="valuePerDay">
            <CustomCardSize
              title={day}
              children={decimalAdjust(valorPorDia > 0 ? valorPorDia: 0.00)}
              icon="fas fa-calendar-day success fa-2x"
              text={text}
              size='380px'
            ></CustomCardSize>
            <CustomCardSize
              title={`Parcelamentos acabando`}
              children={decimalAdjust(totalFinishing)}
              icon="fas fa-calendar-check success fa-2x"
              text=""
              size='380px'
            ></CustomCardSize>
          </div> : <div className="valuePerDay">
            <CustomCardSize
              title={day}
              children="0.00"
              icon="fas fa-calendar-day success fa-2x"
              text=""
              size='380px'
            ></CustomCardSize>
            <CustomCardSize
              title={`Parcelamentos acabando`}
              children={decimalAdjust(totalFinishing)}
              icon="fas fa-calendar-check success fa-2x"
              text=""
              size='380px'
            ></CustomCardSize>
            
          </div>}
        <Card className="graphicPagePie">
          <CardApexGraphicPie></CardApexGraphicPie>
        </Card>
        <Card className="cardDash">
          <CardApexGraphic></CardApexGraphic>
        </Card>
        <div style={{ display: "flex" }} className="cardsValues">
          <CustomCard
            title="Fixas"
            children={decimalAdjust(fixed)}
            icon="far fa-calendar blue fa-2x"
            data={fixedValue}
          >
          </CustomCard>
          <CustomCard
            title="Simples"
            children={decimalAdjust(simple)}
            icon="fas fa-coins blue fa-2x"
            data={simpleValue}
          >
          </CustomCard>
          <CustomCard
            title="Parceladas"
            children={decimalAdjust(installment)}
            icon="fas fa-credit-card blue fa-2x"
            data={installmentValue}
          >
          </CustomCard>
        </div>
      </div>
      <div className="analitics">
        <Card className="outsByDay">
          <CardApexGraphicByDay></CardApexGraphicByDay>
        </Card>
        <Card className='categorieTable'>
          <text className="finishingInstallments">Parcelamentos acabando</text>
          <p></p>
          {lis_instalments.length === 0 ?
            <div style={{ marginLeft: '148px', marginRight: '160px', marginTop: '30px' }}>
              <Image src={imageEmpty} rounded></Image>
            </div> :
            <div style={{ maxWidth: '570px'}}>
              <Table  borderless striped responsive hover variant="black" className="tableTotal" size="sm">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Valor</th>
                    <th>Parcela</th>
                  </tr>
                </thead>
                <tbody>
                  {lis_instalments}
                </tbody>
              </Table>
            </div>
          }
        </Card>
      </div>
    </div>);
};
