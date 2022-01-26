import React from "react";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { monthByNumber } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";
import CustomCard from "../customCard/CustomCard";

const today = new Date();
const mm = String(today.getMonth() + 1).padStart(2, '0')
const yyyy = today.getFullYear()

export default class SumAllValue extends React.Component {
  state = {
    installments: [],
  }

  componentDidMount() {
    axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', mm, yyyy, '', 'NotPaid', ''))
      .then(res => {
        const installments = res.data;
        this.setState({ installments });
      })
  }

  render() {

    console.log(this.state.installments)

    const valueTotal = this.state.installments.items?.reduce(function (prev, cur) {
      return prev + cur.value;
    }, 0);

    return (
      <>
        <CustomCard
          title="Total do mês"
          subTitle={monthByNumber(mm)+"/"+yyyy}
          children={decimalAdjust(valueTotal)}
          icon="fas fa-hand-holding-usd red font-large-2"
          >
        </CustomCard>
      </>
    )
  }
}