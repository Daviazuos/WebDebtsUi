import React, { useEffect, useState } from "react";
import "./CardGraphicPie.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { monthByNumber } from "../../utils/dateFormater";
import { decimalAdjust } from "../../utils/valuesFormater";
import { Card, CardBody } from "react-bootstrap";


export default function CardApexGraphicPie(props) {
    const [graphic, setGraphic] = useState(null);
    const [year, setYear] = useState(localStorage.getItem("year"));

    let month = props?.month === undefined ? localStorage.getItem("month") : props?.month

    useEffect(() => {
        const labelsList = []
        const valuesList = []

        axiosInstance.get(Endpoints.debt.getDebtCategories(month, year, props.cardId))
            .then(res => {
                const categories = res.data;
                for (const value in categories) {
                    labelsList.push(`${categories[value].name} - R$ ${decimalAdjust(categories[value].value)}` || 'Sem categoria')
                    valuesList.push(categories[value].percent)
                }
                setGraphic({
                    series: valuesList,
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            return val
                        }
                    },
                    options: {
                        chart: {
                            width: 280,
                            type: "donut"
                        },
                        labels: labelsList,
                        legend: {
                            show: true,
                            fontSize: '12px',
                            position: 'right'
                        },
                        title: {
                            text: `Percentual por categorias`,
                            align: 'left'
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 180
                                }
                            }
                        }],
                        theme: {
                            mode: 'light',
                            palette: 'palette3',
                            monochrome: {
                                enabled: false,
                                color: '#255aee',
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            },
                        }
                    },
                })
            })
    }, [(props?.month != undefined) ? props.month : month])
    return (
        graphic !== null ?
            <ReactApexChart options={graphic.options} series={graphic.series} type="donut" width={770} height={500} /> : <div style={{ width: 770, height: 400 }}><i style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "210px" }} class="fas fa-spinner fa-spin gray fa-4x"></i></div>
    )
}

