import { useEffect, useState } from "react";
import { Card, Table, Image } from "react-bootstrap";
import imageEmpty from '../../assets/empty.png'


import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

import { decimalAdjust } from "../../utils/valuesFormater";

import "./Dashboard.css";
import CustomCard from "../../components/customCard/CustomCard";
import CardApexGraphic from "../../components/cardGraphic/CardApexGraphic";
import CardApexGraphicPie from "../../components/cardGraphicPie/CardApexGraphicPie";
import { dateAdjust, monthByNumber } from "../../utils/dateFormater";


export default function Dashboard() {
  const [month, setMonth] = useState(localStorage.getItem("month"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [sumAllValue, setSumAllValue] = useState([]);
  const [fixedValue, setFixedValue] = useState([]);
  const [simpleValue, setSimpleValue] = useState([]);
  const [installmentValue, setInstallmentValue] = useState([]);
  const [category, setCategory] = useState(null);
  const [debts, setDebts] = useState([])


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


  return (
    <div>
      <div className="cards">
        <CustomCard
          title="Total dívidas"
          children={decimalAdjust(sumAll)}
          icon="fas fa-hand-holding-usd blue fa-2x"
          data={sumAllValue}
        >
        </CustomCard>
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
      <div className="graphics">
        <Card className="cardDash">
          <CardApexGraphic></CardApexGraphic>
        </Card>
        <Card className="graphicPagePie">
          <CardApexGraphicPie></CardApexGraphicPie>
        </Card>
      </div>
      <Card className='categorieTable'>
        <text className="finishingInstallments">Parcelamentos acabando em {monthByNumber(month)}</text>
        <p></p>
        {lis_instalments.length === 0 ?
          <div style={{ marginLeft: '150px' }}>
            <Image src={imageEmpty} rounded></Image>
          </div> :
          <div>
            <Table responsive hover variant="black" className="tableTotal" size="sm">
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
            <text>Total: R$ {decimalAdjust(totalFinishing)}</text>
          </div>
        }
      </Card>
    </div>);
};
