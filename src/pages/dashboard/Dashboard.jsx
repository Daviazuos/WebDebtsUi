import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";

import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

import { monthByNumber } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";

import CardGraphic from "../../components/cardGraphic/CardGraphic"
import Context from "../../context/Context";

import "./Dashboard.css";
import CustomCard from "../../components/customCard/CustomCard";


export default function Dashboard() {
  const [month, setMonth] = useContext(Context);
  const [sumAllValue, setSumAllValue] = React.useState([]);
  const [fixedValue, setFixedValue] = React.useState([]);
  const [simpleValue, setSimpleValue] = React.useState([]);
  const [installmentValue, setInstallmentValue] = React.useState([]);


  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, '2022', '', '', '', ''))
      .then(res => {
        setSumAllValue(res.data)
      })
    return () => mounted = false;
  }, [month])

  const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, '2022', 'Fixed', '', '', ''))
      .then(res => {
        setFixedValue(res.data)
      })
    return () => mounted = false;
  }, [month])

  const fixed = fixedValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, '2022', 'Simple', '', '', ''))
      .then(res => {
        setSimpleValue(res.data)
      })
    return () => mounted = false;
  }, [month])

  const simple = simpleValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, '2022', 'Installment', '', '', ''))
      .then(res => {
        setInstallmentValue(res.data)
      })
    return () => mounted = false;
  }, [month])

  const installment = installmentValue.items?.reduce(function (prev, cur) {
    return prev + cur.value;
  }, 0);


  return (
    <div className='dashPage'>
      <Container className='containerUpPage'>
        <CustomCard
          title="Total do mês"
          subTitle={monthByNumber(month) + "/" + "2022"}
          children={decimalAdjust(sumAll)}
          icon="fas fa-hand-holding-usd red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Fixas"
          children={decimalAdjust(fixed)}
          icon="far fa-calendar red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Simples"
          children={decimalAdjust(simple)}
          icon="fas fa-coins red fa-4x"
        >
        </CustomCard>
        <CustomCard
          title="Parceladas"
          children={decimalAdjust(installment)}
          icon="fas fa-credit-card red fa-4x"
        >
        </CustomCard>
      </Container>
      <Container>
        <div className='graphicPage'>
          <CardGraphic></CardGraphic>
        </div>
      </Container>
    </div>);
};
