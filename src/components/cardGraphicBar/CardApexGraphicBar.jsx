import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "./CardGraphicBar.css"
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";


export default function CardApexGraphicBar() {
    const [graphic, setGraphic] = useState(null);
    const [month, setMonth] = useState(localStorage.getItem("month"));
    const [year, setYear] = useState(localStorage.getItem("year"));

    useEffect(() => {

        const labelsList = []
        const valuesList = []

        axiosInstance.get(Endpoints.spendingCeiling.getByMonth(month, year))
            .then(res => {
                const spendingCeilings = res.data;
                for (const value in spendingCeilings) {
                    labelsList.push(spendingCeilings[value].categoryName)
                    valuesList.push({
                        x: spendingCeilings[value].categoryName,
                        y: spendingCeilings[value].percentValue,
                        goals: [
                            {
                                name: 'Percentual esperado',
                                value: 70,
                                strokeColor: '#775DD0'
                            },
                        ],
                    })
                }
                setGraphic({
                    series: [{ 
                        name: 'Percentual gasto',
                        data: valuesList,
                        formatter: function (val) {
                            return val + "%";
                        },
                    }],
                    dataLabels: {
                        enabled: true
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true,
                                barHeight: '5%'
                            }
                        },
                        labels: labelsList,
                        legend: {
                            show: true,
                            fontSize: '5px',
                            position: 'right'
                        },
                        responsive: [{
                            breakpoint: 480,
                        }],

                    },
                })
            })
    }, [])
    return (
        graphic !== null ?
            <ReactApexChart options={graphic.options} series={graphic.series} type="bar" width={500} height={400} /> : ""
    )
}

