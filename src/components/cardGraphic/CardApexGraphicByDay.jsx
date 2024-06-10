import React from "react";
import { Card } from "react-bootstrap";
import "./CardGraphic.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";
import { getLessMonthByMonth, getLessMonthYearByMonth, monthByNumber } from "../../utils/dateFormater";


export default class CardApexGraphicByDay extends React.Component {
    state = {
        labels: [],
        valuesData: [],
    }

    componentDidMount() {
        let labels = [];
        let values = [];
        let categories = [];
        let months = Array.from(Array(4).keys()).reverse();
        const nameMap = {};
    
        const promises = months.map(index => {
            let month_year = getLessMonthYearByMonth(
                parseInt(localStorage.getItem("month")),
                index,
                localStorage.getItem("year")
            );
            labels.push(monthByNumber(month_year[0]));
    
            return axiosInstance.get(Endpoints.debt.getDebtCategories(month_year[0], month_year[1], undefined))
                .then(res => {
                    categories = res.data;
    
                    for (const item of categories) {
                        if (!nameMap[item.name]) {
                            nameMap[item.name] = {
                                name: item.name,
                                data: []
                            };
                            values.push(nameMap[item.name]);
                        }
                        nameMap[item.name].data.push(item.value);
                    }
                });
        });
    
        Promise.all(promises).then(() => {
            // Flatten the data array for sorting
            let flattenedValues = [];
            for (const value of values) {
                const sum = value.data.reduce((acc, cur) => acc + cur, 0); // Sum the data array
                flattenedValues.push({ name: value.name, total: sum, data: value.data });
            }
    
            // Sort by total descending and take the top 10
            flattenedValues.sort((a, b) => b.total - a.total);
            const topTenValues = flattenedValues.slice(0, 10);
    
            // Prepare final values array
            const finalValues = topTenValues.map(item => ({
                name: item.name,
                data: item.data
            }));
    
            this.setState({ labels: labels });
            this.setState({ valuesData: finalValues });
        }).catch(error => {
            console.error("Error fetching debt categories", error);
        });
    }
    


    render() {
        const graphic = {

            series: this.state.valuesData,
            options: {
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
                        fontSize: "10px",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "bold"
                    }
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Top categorias',
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
            <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} width={960} />
        )
    }
}

