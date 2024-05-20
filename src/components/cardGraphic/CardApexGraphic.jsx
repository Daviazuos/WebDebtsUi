import React from "react";
import { Card } from "react-bootstrap";
import "./CardGraphic.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";
import { getLessMonthByMonth, getLessMonthYearByMonth } from "../../utils/dateFormater";


export default class CardApexGraphic extends React.Component {
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

        let month = getLessMonthYearByMonth(parseInt(localStorage.getItem("month")), 2, localStorage.getItem("year"))[0]
        let year = getLessMonthYearByMonth(parseInt(localStorage.getItem("month")), 2, localStorage.getItem("year"))[1]

        axiosInstance.get(Endpoints.debt.getDebtByMonth(month, year))
            .then(res => {
                const installments = res.data;

                for (const value in installments) {
                    labels.push(installments[value].month)
                    dataDebts.push(installments[value].debtValue)
                    dataWallet.push(installments[value].walletValue)
                }
                this.setState({ labels: labels });
                this.setState({ dataDebts: dataDebts });
                this.setState({ dataWallet: dataWallet });
            })
    }


    render() {
        const graphic = {

            series: [{
                name: "Dívidas",
                data: this.state.dataDebts,
            },
            {
                name: "Recebidos",
                data: this.state.dataWallet,
            }],
            options: {
                colors: ["#C60C30", "#25d988"],
                chart: {
                    height: 350,
                    type: 'line',
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        return "R$ " + decimalAdjust(val);
                    },
                    style: {
                        fontSize: "8px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Movimentação por mês',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: this.state.labels,
                },

                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return "R$ " + decimalAdjust(value);
                        }
                    },
                },
            },


        };

        return (
            <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={400} width={750} />
        )
    }
}

