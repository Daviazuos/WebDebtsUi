import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { decimalAdjust } from "../../utils/valuesFormater";

import "./CardLayout.css";
import { debtInstallmentTransform, walletStatusTransform } from "../../utils/enumFormatter";
import CustomCard from "../customCard/CustomCard";


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

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const primeiroDiaProximoMes = new Date(anoAtual, mesAtual + 1, 1);
    const milissegundosRestantes = primeiroDiaProximoMes - hoje;
    const diasRestantes = Math.floor(milissegundosRestantes / 86400000);

    const valuePerDay = provisionedValue / (diasRestantes + 1)

    const sumAll = sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);


    return (
        <div className="containerWallet">
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
                    title="Valor por dia"
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
