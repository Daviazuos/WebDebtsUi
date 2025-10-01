import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";
import { getLessMonthYearByMonth, monthByNumber } from "../../utils/dateFormater";

export default function CardApexGraphicByDay() {
    const [labels, setLabels] = useState([]);
    const [valuesData, setValuesData] = useState([]);

    const month = localStorage.getItem("month");

    const fetchMonthData = async (month, year) => {
        const response = await axiosInstance.get(Endpoints.debt.getDebtCategories(month, year));
        return response.data;
    };

    useEffect(() => {
        const month = parseInt(localStorage.getItem("month"));
        const year = parseInt(localStorage.getItem("year"));

        const fetchData = async () => {
            const months = Array.from(Array(4).keys()).reverse(); // Últimos 4 meses
            const allMonthsData = [];

            for (const index of months) {
                const [lessMonth, lessYear] = getLessMonthYearByMonth(month, index, year);
                const monthLabel = monthByNumber(lessMonth);
                const categories = await fetchMonthData(lessMonth, lessYear);

                allMonthsData.push({ monthLabel, categories });
            }

            processMonthData(allMonthsData);
        };

        fetchData();
    }, [month]);

    const processMonthData = (allMonthsData) => {
        const labels = [];
        const nameMap = {};

        allMonthsData.forEach(({ monthLabel, categories }) => {
            labels.push(monthLabel);

            categories.forEach((item) => {
                if (!nameMap[item.name]) {
                    nameMap[item.name] = {
                        name: item.name,
                        data: []
                    };
                }
                nameMap[item.name].data.push(item.value);
            });
        });

        // Processar dados para pegar o Top 10 categorias
        const flattenedValues = Object.values(nameMap).map(category => ({
            ...category,
            total: category.data.reduce((acc, cur) => acc + cur, 0)
        }));

        flattenedValues.sort((a, b) => b.total - a.total);
        const topTenValues = flattenedValues.slice(0, 10);

        setLabels(labels);
        setValuesData(topTenValues.map(({ name, data }) => ({ name, data })));
    };

    const graphic = {
        series: valuesData,
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
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
            responsive: [
                {
                    breakpoint: 1024,
                    options: {
                        chart: { width: '100%' },
                        legend: {
                            position: 'bottom',
                            fontSize: '10px',
                        },
                    }
                },
                {
                    breakpoint: 768,
                    options: {
                        chart: { width: '90%' },
                        legend: {
                            position: 'bottom',
                            fontSize: '8px',
                        },
                    }
                },
                {
                    breakpoint: 480,
                    options: {
                        chart: { width: '100%' },
                        legend: {
                            position: 'bottom',
                            fontSize: '6px',
                        },
                        dataLabels: {
                            enabled: false,
                        }
                    }
                }
            ],
            xaxis: {
                categories: labels,
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
        <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} width={955} />
    );
}
