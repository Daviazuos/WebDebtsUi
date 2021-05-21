import React from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import "./CardSumValue.css"

export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    axios.get(`https://localhost:5001/Debts/FilterInstallments?Month=${mm}&Year=${yyyy}&DebtInstallmentType=Fixed&StatusApp=NotPaid`)
      .then(res => {
        const installments = res.data;
        this.setState({ installments });
      })
  }

  render() {

    const valueTotal = this.state.installments.reduce(function (prev, cur) {
      return prev + cur.value;
    }, 0);

    return (
      <Card className='cardTotal'>
        <span className="totalValue"><i className="fas fa-file-invoice-dollar"></i>Dívidas fixas</span>
        <span className="value"> R$ {Math.round(valueTotal * 100) / 100} </span>
      </Card>
    )
  }
}