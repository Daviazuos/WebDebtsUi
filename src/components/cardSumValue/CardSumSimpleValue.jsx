import React from "react";
import { axiosInstance } from "../../api";
import { Card } from "react-bootstrap";
import { Endpoints } from '../../api/endpoints';
import { decimalAdjust } from "../../utils/valuesFormater";
import CustomCard from "../customCard/CustomCard";


export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    axiosInstance.get(Endpoints.debt.filterInstallments(1,'', mm, yyyy, 'Simple', 'NotPaid'))
      .then(res => {
        const installments = res.data;
        this.setState({ installments });
      })
  }

  render() {

    const valueTotal = this.state.installments.items?.reduce(function (prev, cur) {
      return prev + cur.value;
    }, 0);

    return (
      <CustomCard
        title="Simples"
        children={decimalAdjust(valueTotal)}
        icon="fas fa-coins red font-large-2"
      >
      </CustomCard>
    )
  }
}