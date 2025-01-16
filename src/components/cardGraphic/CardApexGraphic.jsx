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
                colors: ["#C60C30", "#13D8AA"],
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
                        opacity: 0.2
                    },
                },
                responsive: [
                    {
                        breakpoint: 1024, // Tablets ou telas intermediárias
                        options: {
                            chart: {
                                width: '100%' // Ajusta a largura para o container pai
                            },
                            legend: {
                                position: 'bottom', // Mova a legenda para baixo
                                fontSize: '10px', // Reduza o tamanho da fonte
                            },
                        }
                    },
                    {
                        breakpoint: 768, // Dispositivos móveis maiores
                        options: {
                            chart: {
                                width: '90%', // Reduz ainda mais a largura
                            },
                            legend: {
                                position: 'bottom',
                                fontSize: '8px', // Fonte menor
                            },
                        }
                    },
                    {
                        breakpoint: 480, // Dispositivos móveis pequenos
                        options: {
                            chart: {
                                width: '100%', // Largura completa do container
                            },
                            legend: {
                                position: 'bottom',
                                fontSize: '6px', // Fonte ainda menor
                            },
                            dataLabels: {
                                enabled: false, // Desativa labels para economizar espaço
                            }
                        }
                    }
                ],
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

