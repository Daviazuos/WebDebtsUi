import React from "react";
import { Card, Button } from "react-bootstrap";
import "./CardSumValue.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";

export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    axiosInstance.get(Endpoints.debt.filterInstallments('', mm, yyyy, 'Fixed', 'NotPaid'))
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
        <span className="value"> R$ {decimalAdjust(valueTotal)} </span>
      </Card>
    )
  }
}