import React from "react";
import { Card } from "react-bootstrap";
import "./CardGraphic.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";


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
        const today = new Date()
        const pastMonths = new Date(today.setMonth(today.getMonth() - 5));
        const mm = String(pastMonths.getMonth())
        const yyyy = pastMonths.getFullYear()

        axiosInstance.get(Endpoints.debt.getDebtByMonth(mm, yyyy))
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
                data: this.state.dataDebts
            },
            {
                name: "Recebidos",
                data: this.state.dataWallet
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
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
            <Card className='cardDash'>
                <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} />
            </Card>
        )
    }
}

