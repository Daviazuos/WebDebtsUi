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
    const year = localStorage.getItem("year");

    useEffect(() => {
        const fetchData = async () => {
            const months = Array.from(Array(4).keys()).reverse();
            const monthYearList = months.map(index => 
                getLessMonthYearByMonth(parseInt(month), index, year)
            );

            const newLabels = [];
            const nameMap = {};

            for (const [monthNumber, yearNumber] of monthYearList) {
                newLabels.push(monthByNumber(monthNumber));

                try {
                    const res = await axiosInstance.get(
                        Endpoints.debt.getDebtCategories(monthNumber, yearNumber, undefined)
                    );

                    res.data.forEach(item => {
                        if (!nameMap[item.name]) {
                            nameMap[item.name] = { name: item.name, data: [] };
                        }
                        nameMap[item.name].data.push(item.value);
                    });
                } catch (error) {
                    console.error("Erro ao buscar categorias", error);
                }
            }

            const processedValues = Object.values(nameMap).map(item => ({
                ...item,
                total: item.data.reduce((acc, cur) => acc + cur, 0)
            }));

            processedValues.sort((a, b) => b.total - a.total);
            const top10 = processedValues.slice(0, 10);

            setLabels(newLabels);
            setValuesData(top10.map(({ name, data }) => ({ name, data })));
        };

        fetchData();
    }, [month, year]);

    console.log(valuesData)

    const graphic = {
        series: valuesData,
        options: {
            chart: { height: 350, type: 'line' },
            dataLabels: {
                enabled: true,
                formatter: (val) => `R$ ${decimalAdjust(val)}`,
                style: { fontSize: "10px", fontWeight: "bold" }
            },
            stroke: { curve: 'straight' },
            title: { text: 'Top categorias', align: 'left' },
            xaxis: { categories: labels },
            yaxis: {
                labels: {
                    formatter: (value) => `R$ ${decimalAdjust(value)}`
                }
            },
            responsive: [
                { breakpoint: 1024, options: { chart: { width: '100%' }, legend: { position: 'bottom', fontSize: '10px' } } },
                { breakpoint: 768, options: { chart: { width: '90%' }, legend: { position: 'bottom', fontSize: '8px' } } },
                { breakpoint: 480, options: { chart: { width: '100%' }, legend: { position: 'bottom', fontSize: '6px' }, dataLabels: { enabled: false } } },
            ]
        }
    };

    return (
        <ReactApexChart options={graphic.options} series={graphic.series} type="line" height={350} width={955} />
    );
}
