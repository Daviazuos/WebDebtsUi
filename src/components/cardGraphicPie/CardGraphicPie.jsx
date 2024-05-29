import React from "react";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import "./CardGraphicPie.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";

export default class CardGraphic extends React.Component {
    state = {
        installments: [],
        labels: [],
        dataDebts: [],
        dataWallet: []
    }

    componentDidMount() {
        const labels = []
        const dataDebts = []
        const dataWallet = []
        const today = new Date()
        const pastMonths = new Date(today.setMonth(today.getMonth() - 5));
        const mm = String(pastMonths.getMonth())
        const yyyy = pastMonths.getFullYear()

        axiosInstance.get(Endpoints.debt.getDebtByMonth(mm, yyyy))
          .then(res => {
            const installments = res.data;

            for (const value in installments){
                labels.push(installments[value].month)
                dataDebts.push(installments[value].debtValue)
                dataWallet.push(installments[value].walletValue)
            }
            this.setState({ labels: labels });
            this.setState({ dataDebts: dataDebts  });
            this.setState({ dataWallet: dataWallet });
          })
      }
    

    render() {
        const options = {
                labels: this.state.labels,
                datasets: [
                    {
                        label: "Dívidas",
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(225, 204,230, .3)",
                        borderColor: "rgb(205, 130, 158)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(205, 130,1 58)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.state.dataDebts
                    },
                    {
                        label: "Recebidos",
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(184, 185, 210, .3)",
                        borderColor: "rgb(35, 26, 136)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(35, 26, 136)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.state.dataWallet
                    }
                ]
            };

        return (
            <div>
                <h3 className="graphicName">Movimentação por mês</h3>
                <Line className="graphic" data={options} width={100} height={30} options={{ responsive: true }} />
            </div>
        );
    }
}