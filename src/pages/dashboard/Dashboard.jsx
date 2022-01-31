import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

import { monthByNumber } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";

import CardGraphic from "../../components/cardGraphic/CardGraphic"

import "./Dashboard.css";
import CustomCard from "../../components/customCard/CustomCard";
import CardApexGraphic from "../../components/cardGraphic/CardApexGraphic";


export default function Dashboard() {
  const [month, setMonth] = useState(localStorage.getItem("month"));
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [sumAllValue, setSumAllValue] = useState([]);
  const [fixedValue, setFixedValue] = useState([]);
  const [simpleValue, setSimpleValue] = useState([]);
  const [installmentValue, setInstallmentValue] = useState([]);


  useEffect(() => {
    let mounted = true;
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', ''))
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
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Fixed', '', '', ''))
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
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Simple', '', '', ''))
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
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, 'Installment', '', '', ''))
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
          title="Total dívidas"
          children={decimalAdjust(sumAll)}
          icon="fas fa-hand-holding-usd blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Fixas"
          children={decimalAdjust(fixed)}
          icon="far fa-calendar blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Simples"
          children={decimalAdjust(simple)}
          icon="fas fa-coins blue fa-2x"
        >
        </CustomCard>
        <CustomCard
          title="Parceladas"
          children={decimalAdjust(installment)}
          icon="fas fa-credit-card blue fa-2x"
        >
        </CustomCard>
      </Container>
      <Container>
        <div className='graphicPage'>
          <CardApexGraphic></CardApexGraphic>
        </div>
      </Container>
    </div>);
};
