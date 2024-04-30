import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";

import "./CardLayout.css";
import { debtInstallmentTransform, walletStatusTransform } from "../../utils/enumFormatter";
import CustomCard from "../customCard/CustomCard";
import { monthByNumber } from "../../utils/dateFormater";
import { refreshPage } from "../../utils/utils";


export default function CardLayout() {
    const [sumAllValue, setSumAllValue] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"))
    const [year, setYear] = useState(localStorage.getItem("year"))

    useEffect(() => {
        axiosInstance.get(Endpoints.wallet.getEnable(month, year))
            .then(res => {
                setWallet(res.data);
            })

    }, [month])

    useEffect(() => {
        axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', '', null))
            .then(res => {
                setSumAllValue(res.data)
            })

    }, [month])

    const valueTotal = wallet.filter(({ walletStatus }) => walletStatus !== 'Pending').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);


    const paidValue = sumAllValue.items?.filter(({ status }) => status === 'Paid').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    const provisionedValue = valueTotal - sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    const now = new Date();

    const mountedDate = new Date(year, month -1, parseInt(month) == now.getMonth() +1 ? now.getDate() : 1);
    const mesAtual = mountedDate.getMonth();
    const anoAtual = mountedDate.getFullYear();

    const primeiroDiaProximoMes = new Date(anoAtual, mesAtual + 1, 1);
    const milissegundosRestantes = primeiroDiaProximoMes - mountedDate;
    const diasRestantes = Math.floor(milissegundosRestantes / 86400000);

    let valuePerDay = provisionedValue / (diasRestantes)

    if (valuePerDay < 0) {
        valuePerDay = 0.00
    }

    let day = `Valor por dia referente a ${diasRestantes} dias`

    const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    const selectNewMonth = (direction) => {
        if (direction === 'left') {
            if (parseInt(month) === 1) {
                localStorage.setItem("year", parseInt(year) - 1);
                localStorage.setItem("month", 12);
            } else {
                localStorage.setItem("month", parseInt(month) - 1);
            }
        } else {
            if (parseInt(month) === 12) {
                localStorage.setItem("year", parseInt(year) + 1);
                localStorage.setItem("month", 1)
            } else {
                localStorage.setItem("month", parseInt(month)+1);

            }
        }
        refreshPage()
    }


    return (
        <div className="containerWallet">
            <div id="linha">
                <i onClick={() => selectNewMonth("left")} style={{cursor: 'pointer'}} class={"fas fa-chevron-left"}></i> 
                {' '}{monthByNumber(month)} - {year}{' '}
                <i style={{cursor: 'pointer'}} onClick={() => selectNewMonth("right")} class={"fas fa-chevron-right"}></i>
            </div>
            <div className="walletCards">
                <CustomCard
                    title="Carteira"
                    children={decimalAdjust(valueTotal)}
                    icon="fas fa-wallet blue fa-2x"
                >
                </CustomCard>
                <CustomCard
                    title="Dividas"
                    children={decimalAdjust(sumAll)}
                    icon="fas fa-hand-holding-usd red fa-2x"
                >
                </CustomCard>
                <CustomCard
                    title={day}
                    children={decimalAdjust(valuePerDay)}
                    icon="fas fa-calendar-day success fa-2x"

                ></CustomCard>
                <CustomCard
                    title="Provisionado"
                    children={decimalAdjust(provisionedValue)}
                    icon="fas fa-lightbulb yellow fa-2x"
                >
                </CustomCard>
                <CustomCard
                    title="Valor pago"
                    children={decimalAdjust(paidValue)}
                    icon="fas fa-check success fa-2x"
                >
                </CustomCard>
                <CustomCard
                    title="Valor a pagar"
                    children={decimalAdjust(sumAll - paidValue)}
                    icon="fas fa-lightbulb red fa-2x"
                >
                </CustomCard>

            </div>
        </div>
    )
}
