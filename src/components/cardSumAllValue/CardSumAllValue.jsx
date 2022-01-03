import React from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import "./CardSumAllValue.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 2).padStart(2, '0')
    const yyyy = today.getFullYear()
    axiosInstance.get(Endpoints.debt.filterInstallments('', mm, yyyy, '', 'NotPaid'))
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
        <Card className='cardAllTotal'>
              <span className="totalAllValue"><i className="fas fa-file-invoice-dollar"></i>Dívidas totais do mês</span>
              <span className="allValue"> R$ {Math.round(valueTotal * 100) / 100} </span>
        </Card>
    )
  }
}