import React, { useEffect, useState } from "react";
import { Button, Card, Container, Table, Modal } from "react-bootstrap";
import { axiosInstance } from "../../api";
import { Endpoints } from "../../api/endpoints";
import { addLeadingZeros, decimalAdjust } from "../../utils/valuesFormater";

import "./CardLayout.css";
import { debtInstallmentTransform, walletStatusTransform } from "../../utils/enumFormatter";
import CustomCard from "../customCard/CustomCard";
import { monthByNumber } from "../../utils/dateFormater";
import { refreshPage } from "../../utils/utils";
import { useGlobalContext } from "../../services/local-storage-event";
import CustomCardSize from "../customCardSize/CustomCardSize";
import { PieChart } from "lucide-react";
import { useProvisionedValue } from "../../context/ProvisionedValueContext";


export default function CardLayout() {
    const [sumAllValue, setSumAllValue] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"))
    const [year, setYear] = useState(localStorage.getItem("year"))
    const { sharedValue } = useGlobalContext();
    const { provisionedValue, setProvisionedValue } = useProvisionedValue();

    useEffect(() => {
        axiosInstance.get(Endpoints.wallet.getEnable(month, year))
            .then(res => {
                setWallet(res.data);
            })

    }, [month, sharedValue])

    useEffect(() => {
        axiosInstance.get(Endpoints.debt.filterInstallments(1, 9999, '', month, year, '', '', '', '', null))
            .then(res => {
                setSumAllValue(res.data)
            })

    }, [month, sharedValue])

    const valueTotal = wallet.filter(({ walletStatus }) => walletStatus !== 'Pending').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);


    const paidValue = sumAllValue.items?.filter(({ status }) => status === 'Paid').reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    useEffect(() => {
        const calculatedValue = valueTotal - (sumAllValue.items?.reduce((prev, cur) => prev + cur.value, 0) || 0);
        setProvisionedValue(Number(calculatedValue.toFixed(2)));
    }, [valueTotal, sumAllValue, setProvisionedValue]);

    const provisionedValueToShow = provisionedValue || 0;

    let balanceColor = provisionedValueToShow < 0 ? "fas fa-balance-scale red custom-icon" : "fas fa-balance-scale success custom-icon"


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
                localStorage.setItem("month", parseInt(month) + 1);

            }
        }
        refreshPage()

    }

    let cardSize = "310px"


    return (
        <div className="containerWallet">
            {/* <div id="linha">
                <i onClick={() => selectNewMonth("left")} style={{cursor: 'pointer', color: '#B3B8D4'}} class={"fas fa-chevron-left"}></i> 
                <div style={{minWidth: '250px', display: 'flex', justifyContent: 'center'}}>{monthByNumber(month)} - {year}</div>
                <i style={{cursor: 'pointer', color: '#B3B8D4'}} onClick={() => selectNewMonth("right")} class={"fas fa-chevron-right"}></i>
            </div> */}
            <div className="flex items-center gap-2">
                <PieChart className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Planejamento Financeiro</h1>
                    <div className="flex items-center gap-4">
                        <i onClick={() => selectNewMonth("left")} style={{ cursor: 'pointer', color: '#B3B8D4' }} class={"fas fa-chevron-left"}></i>
                        <p className="text-sm text-muted-foreground capitalize">{monthByNumber(month)} {year}</p>
                        <i style={{ cursor: 'pointer', color: '#B3B8D4' }} onClick={() => selectNewMonth("right")} class={"fas fa-chevron-right"}></i>
                    </div>
                </div>
            </div>
            <div className="walletCards">
                <CustomCardSize
                    title="Entradas"
                    children={decimalAdjust(valueTotal)}
                    icon="fas fa-hand-holding-usd success custom-icon"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saídas"
                    children={decimalAdjust(sumAll)}
                    icon="fas fa-hand-holding-usd red custom-icon"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saldo Atual"
                    children={decimalAdjust(provisionedValueToShow)}
                    icon={balanceColor}
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor pago"
                    children={decimalAdjust(paidValue)}
                    icon="fas fa-check success custom-icon"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor a pagar"
                    children={decimalAdjust(sumAll - paidValue)}
                    icon="fas fa-times red custom-icon"
                    size={cardSize}
                    className="toPay"
                >
                </CustomCardSize>
            </div>
        </div>
    )
}
