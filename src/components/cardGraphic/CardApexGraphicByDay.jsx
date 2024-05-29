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
        labels: [],
        valuesData: [],
    }

    componentDidMount() {
        const labels = []
        const values = []


        let months = Array.from(Array(4).keys())
        for (const index in months) {
            let month_year = getLessMonthYearByMonth(parseInt(localStorage.getItem("month")), months[index], localStorage.getItem("year"))
            axiosInstance.get(Endpoints.debt.getDebtCategories(month_year[0], month_year[1], undefined))
                .then(res => {
                    const categories = res.data;
                    for (const value in categories) {
                        values.push({
                            name: `${categories[value].name}`,
                            data: `R$ ${decimalAdjust(categories[value].value)}`
                        })
                    }
                })
            labels.push(month_year[0])
        }
        this.setState({ labels: labels });
        this.setState({ valuesData: values });
    }


    render() {

        console.log(this.state.labels)
        console.log(this.state.valuesData)
        // const graphic = {

        //     series: [this.state.values],
        //     options: {
        //         colors: ["#C60C30", "#C60C30"],
        //         chart: {
        //             height: 350,
        //             type: 'line',
        //         },
        //         dataLabels: {
        //             enabled: true,
        //             formatter: function (val, opts) {
        //                 return "R$ " + decimalAdjust(val);
        //             },
        //             style: {
        //                 fontSize: "8px",
        //                 fontFamily: "Helvetica, Arial, sans-serif",
        //                 fontWeight: "bold"
        //             }
        //         },
        //         stroke: {
        //             curve: 'straight'
        //         },
        //         title: {
        //             text: 'Movimentação por dia',
        //             align: 'left'
        //         },
        //         grid: {
        //             row: {
        //                 colors: ['#f3f3f3', 'transparent'],
        //                 opacity: 0.5
        //             },
        //         },
        //         xaxis: {
        //             categories: this.state.labels,
        //         },

        //         yaxis: {
        //             labels: {
        //                 formatter: function (value) {
        //                     return "R$ " + decimalAdjust(value);
        //                 }
        //             },
        //         },
        //     },


        // };

        return (
            // <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} width={957} />
            <></>
        )
    }
}

