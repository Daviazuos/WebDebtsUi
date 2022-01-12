import React from "react";
import { Card } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { monthByNumber } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";
import CustomCard from "../customCard/CustomCard";

const today = new Date();
const mm = String(today.getMonth() + 2).padStart(2, '0')
const yyyy = today.getFullYear()

export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
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
      <>
        <CustomCard
          title="Total do mês"
          subTitle={monthByNumber(mm-1)+"/"+yyyy}
          children={decimalAdjust(valueTotal)}
          icon="fas fa-hand-holding-usd red font-large-2"
          >
        </CustomCard>
      </>
    )
  }
}