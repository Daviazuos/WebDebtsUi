import React, { useEffect, useState } from "react";
import "./CardGraphicPie.css";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import ReactApexChart from "react-apexcharts";
import { decimalAdjust } from "../../utils/valuesFormater";
import { Card, CardBody } from "react-bootstrap";
import DashModal from "../../pages/dashboard/DashModal";

export default function CardApexGraphicPie(props) {
    const [graphic, setGraphic] = useState(null);
    const [year, setYear] = useState(localStorage.getItem("year"));
    const [modalShow, setModalShow] = useState(false);
    const [modalData, setModalData] = useState([]); // Para armazenar os dados da modal
    const [title, setTittle] = useState('')

    let month = props?.month === undefined ? localStorage.getItem("month") : props?.month;

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
                            width: 280,
                            type: "donut",
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const selectedCategory = categoriesList[config.dataPointIndex];
                                    setTittle(config.w.config.labels[config.dataPointIndex])
                                    setModalData(selectedCategory.installmentsPerCategory); // Armazena os itens da categoria
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
                        title: {
                            text: `Percentual por categorias`,
                            align: 'left'
                        },
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

    return (
        <>
            <DashModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={modalData} // Passa os dados para a modal
                head={title}
            />
            {graphic !== null ? (
                <ReactApexChart
                    options={graphic.options}
                    series={graphic.series}
                    type="donut"
                    width={770}
                    height={500}
                />
            ) : (
                <div style={{ width: 770, height: 400 }}>
                    <i
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "210px"
                        }}
                        className="fas fa-spinner fa-spin gray fa-4x"
                    />
                </div>
            )}
        </>
    );
}
