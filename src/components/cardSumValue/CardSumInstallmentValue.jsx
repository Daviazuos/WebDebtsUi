import React from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
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
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', mm, yyyy, 'Installment', 'NotPaid', ''))
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
        title="Parceladas"
        children={decimalAdjust(valueTotal)}
        icon="fas fa-credit-card red font-large-2"
      >
      </CustomCard>
    )
  }
}