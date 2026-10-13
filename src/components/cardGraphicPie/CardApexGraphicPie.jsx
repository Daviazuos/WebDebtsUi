import React, { useEffect, useRef, useState } from "react";
import "./CardGraphicPie.css";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";
import { Card, CardBody, Table } from "react-bootstrap";
import DashModal from "../../pages/dashboard/DashModal";

export default function CardApexGraphicPie(props) {
    const [graphic, setGraphic] = useState(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const chartContainerRef = useRef(null);
    const [year, setYear] = useState(localStorage.getItem("year"));
    const [modalShow, setModalShow] = useState(false);
    const [modalData, setModalData] = useState([]); // Para armazenar os dados da modal
    const [title, setTittle] = useState('')

    let month = props?.month === undefined ? localStorage.getItem("month") : props?.month;

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container || typeof ResizeObserver === "undefined") return undefined;

        const observer = new ResizeObserver(entries => {
            const width = Math.round(entries[0]?.contentRect.width || 0);
            setContainerWidth(currentWidth => currentWidth === width ? currentWidth : width);
        });
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    const chartHeight = containerWidth
        ? Math.round(Math.min(390, Math.max(280, containerWidth * 0.7)))
        : 350;
    const chartOptions = graphic ? {
        ...graphic.options,
        legend: {
            ...graphic.options.legend,
            position: containerWidth < 560 ? "bottom" : "right",
            fontSize: containerWidth < 560 ? "10px" : "11px",
            height: containerWidth < 560 ? 88 : chartHeight - 24,
            itemMargin: { horizontal: 5, vertical: 3 }
        },
        responsive: []
    } : null;

    useEffect(() => {
        const labelsList = [];
        const valuesList = [];
        const categoriesList = []; // Para armazenar os dados completos de cada categoria

        axiosInstance.get(Endpoints.debt.getDebtCategories(month, year, props.cardId))
            .then(res => {
                const categories = res.data;
                for (const value in categories) {
                    labelsList.push(`${categories[value].name} - R$ ${decimalAdjust(categories[value].value)}` || 'Sem categoria');
                    valuesList.push(categories[value].percent);
                    categoriesList.push(categories[value]); // Armazena os dados completos
                }
                setGraphic({
                    series: valuesList,
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            return val;
                        }
                    },
                    options: {
                        chart: {
                            type: "donut",
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const selectedCategory = categoriesList[config.dataPointIndex];
                                    setTittle(config.w.config.labels[config.dataPointIndex])
                                    setModalData((selectedCategory.installmentsPerCategory.map(item => {
                                              return (
                                                <tr key={item.id}>
                                                  <td>{item.debtName}</td>
                                                  <td>{item.category}</td>
                                                  <td>R$ {decimalAdjust(item.value)}</td>
                                                </tr>
                                              )
                                            })
                                            )); // Armazena os itens da categoria
                                    setModalShow(true); // Abre a modal
                                },
                                mounted: (chart) => {
                                    chart.windowResizeHandler();
                                  }
                            }
                        },
                        labels: labelsList,
                        legend: {
                            show: true,
                            fontSize: '12px',
                            position: 'right'
                        },
                        title: { text: '' },
                        responsive: [
                            {
                                breakpoint: 1024, // Tablets ou telas intermediárias
                                options: {
                                    chart: {
                                        width: '100%' // Ajusta a largura para o container pai
                                    },
                                    legend: {
                                        show: false, // Oculta a legenda
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
                                        show: false, // Oculta a legenda
                                        position: 'bottom',
                                        fontSize: '8px', // Fonte menor
                                    },
                                    title: {
                                        style: {
                                            fontSize: "10px",
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 480, // Dispositivos móveis pequenos
                                options: {
                                    chart: {
                                        width: '100%', // Largura completa do container
                                    },
                                    legend: {
                                        show: false,
                                        position: 'bottom',
                                        fontSize: '6px', // Fonte ainda menor
                                    },
                                    dataLabels: {
                                        enabled: true, // Desativa labels para economizar espaço
                                    }
                                }
                            }
                        ],
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
                });
            });
    }, [month, year, props.cardId]);

    let categoryTable = (<Table striped borderless hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {modalData}
          </tbody>
        </Table>)

    return (
        <>
            <DashModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                table={categoryTable} // Passa os dados para a modal
                head={title}
            />
            <div ref={chartContainerRef} className="categoryChartContainer">
                {graphic !== null ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={graphic.series}
                        type="donut"
                        width={containerWidth || "100%"}
                        height={chartHeight}
                    />
                ) : (
                    <div className="skeletonCard">
                        <i className="fas fa-spinner fa-spin gray fa-4x" aria-hidden="true" />
                    </div>
                )}
            </div>
        </>
    );
}
