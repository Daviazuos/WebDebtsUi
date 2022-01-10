import React from "react";
import { axiosInstance } from "../../api";
import { Card } from "react-bootstrap";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";


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
      <Card className='cardDash'>
        <span className="totalValue"><i className="fas fa-file-invoice-dollar"></i>Simples</span>
        <span className="value"> R$ {decimalAdjust(valueTotal)} </span>
      </Card>
    )
  }
}