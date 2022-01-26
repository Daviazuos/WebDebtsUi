import React from "react";
import { Container } from "react-bootstrap";

import CardSumAllValue from "../../components/cardSumAllValue/CardSumAllValue"
import CardSumFixedValue from "../../components/cardSumValue/CardSumFixedValue"
import CardSumSimpleValue from "../../components/cardSumValue/CardSumSimpleValue"
import CardSumInstallmentValue from "../../components/cardSumValue/CardSumInstallmentValue"
import CardGraphic from "../../components/cardGraphic/CardGraphic"
import "./Dashboard.css";

export default () => {
  return (
    <>
      <div className='dashPage'>
        <Container className='containerUpPage'>
          <CardSumAllValue></CardSumAllValue>
          <CardSumFixedValue></CardSumFixedValue>
          <CardSumSimpleValue></CardSumSimpleValue>
          <CardSumInstallmentValue></CardSumInstallmentValue>
        </Container>
        <Container>
          <div className='graphicPage'>
            <CardGraphic></CardGraphic>
          </div>
        </Container>
      </div>
    </>);
};
