import React from "react";
import { Card } from "react-bootstrap";
import "./CardGraphic.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";
import { getLessMonthByMonth, getLessMonthYearByMonth } from "../../utils/dateFormater";


export default class CardApexGraphicByDay extends React.Component {
    state = {
        installments: [],
        labels: [],
        dataDebts: [],
        dataWallet: []
    }

    componentDidMount() {
        const labels = []
        const dataDebts = []

        axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', localStorage.getItem("month"), localStorage.getItem("year"), '', '', '', '', null))
            .then(res => {
                const installments = res.data.items;
                var result = [];
                installments.reduce(function (res, value) {
                    if (!res[new Date(value.date).getUTCDate()]) {
                        res[new Date(value.date).getUTCDate()] = { Id: new Date(value.date).getUTCDate(), value: 0.00 };
                        result.push(res[new Date(value.date).getUTCDate()])
                    }
                    res[new Date(value.date).getUTCDate()].value += value.value;
                    return res;
                }, {});

                result.sort(function(a, b) { 
                    return a.Id - b.Id;
                })


                for (const value in result) {
                    dataDebts.push(result[value].value)
                    labels.push(result[value].Id)
                }
                this.setState({ labels: labels });
                this.setState({ dataDebts: dataDebts });
            })
    }


    render() {
        const graphic = {

            series: [{
                name: "Gastos",
                data: this.state.dataDebts,
            }],
            options: {
                colors: ["#C60C30", "#C60C30"],
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
                    text: 'Movimentação por dia',
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
            <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} width={974} />
        )
    }
}

