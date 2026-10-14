import React from "react";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";

const chartColors = ["#C60C30", "#D83B58", "#E3667D", "#ED91A2", "#F5BBC5"];

export default function CardApexGraphicTopDebts({ items = [] }) {
    const topDebts = items
        .map(item => ({
            name: item.debtName || item.name || "Despesa sem nome",
            value: Number(item.value) || 0
        }))
        .sort((first, second) => second.value - first.value)
        .slice(0, 5);

    if (topDebts.length === 0) {
        return <div className="topDebtsEmpty">Nenhuma despesa encontrada neste período.</div>;
    }

    const options = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            foreColor: "#777d85"
        },
        colors: chartColors,
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                borderRadius: 5,
                barHeight: "58%"
            }
        },
        dataLabels: {
            enabled: true,
            formatter: value => `R$ ${decimalAdjust(value)}`,
            style: {
                colors: ["#25282b"],
                fontSize: "11px",
                fontWeight: 600
            }
        },
        grid: {
            borderColor: "#edf0f3",
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } },
            padding: { left: 8, right: 20 }
        },
        xaxis: {
            categories: topDebts.map(debt => debt.name),
            labels: {
                formatter: value => `R$ ${decimalAdjust(value)}`,
                style: { fontSize: "10px" }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                maxWidth: 140,
                style: { colors: "#25282b", fontSize: "11px" }
            }
        },
        tooltip: {
            y: { formatter: value => `R$ ${decimalAdjust(value)}` }
        },
        legend: { show: false },
        responsive: [{
            breakpoint: 520,
            options: {
                chart: { height: 300 },
                dataLabels: { style: { fontSize: "10px" } },
                yaxis: { labels: { maxWidth: 105 } }
            }
        }]
    };

    return (
        <div className="topDebtsChart">
            <ReactApexChart
                options={options}
                series={[{ name: "Despesas", data: topDebts.map(debt => debt.value) }]}
                type="bar"
                height={320}
                width="100%"
            />
        </div>
    );
}
