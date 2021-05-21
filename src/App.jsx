import React from "react";
import { Container } from "react-bootstrap";

import CardSumAllValue from "./components/cardSumAllValue/CardSumAllValue"
import CardSumFixedValue from "./components/cardSumValue/CardSumFixedValue"
import CardSumSimpleValue from "./components/cardSumValue/CardSumSimpleValue"
import CardSumInstallmentValue from "./components/cardSumValue/CardSumInstallmentValue"
import CardGraphic from "./components/cardGraphic/CardGraphic"
import MaxDebts from "./components/maxDebts/MaxDebts"
import "./App.css";

export default () => {
  return (
    <>
      <div className='appPage'>
        <Container className='containerUpPage'>
          <div className='allValue'>
            <CardSumAllValue></CardSumAllValue>
            <CardSumFixedValue></CardSumFixedValue>
            <CardSumSimpleValue></CardSumSimpleValue>
            <CardSumInstallmentValue></CardSumInstallmentValue>
          </div>
          <div className='maxDebts'>
            <MaxDebts></MaxDebts>
          </div>
        </Container>
        <Container>
          <div className='graphicPage'>
            <CardGraphic></CardGraphic>
          </div>
        </Container>
      </div>
    </>);
};
