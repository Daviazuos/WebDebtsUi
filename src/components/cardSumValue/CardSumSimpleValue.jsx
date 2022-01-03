import React from "react";
import { axiosInstance } from "../../api";
import { Card } from "react-bootstrap";
import "./CardSumValue.css"
import { Endpoints } from '../../api/endpoints';


export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    axiosInstance.get(Endpoints.debt.filterInstallments('', mm, yyyy, 'Simple', 'NotPaid'))
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
              <span className="totalValue"><i className="fas fa-file-invoice-dollar"></i>Dívidas simples</span>
              <span className="value"> R$ {Math.round(valueTotal * 100) / 100} </span>
        </Card>
    )
  }
}