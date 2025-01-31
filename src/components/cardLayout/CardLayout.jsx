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


export default function CardLayout() {
    const [sumAllValue, setSumAllValue] = useState([]);
    const [wallet, setWallet] = useState([]);
    const [month, setMonth] = useState(localStorage.getItem("month"))
    const [year, setYear] = useState(localStorage.getItem("year"))
    const { sharedValue } = useGlobalContext();

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

    const provisionedValue = valueTotal - sumAllValue.items?.reduce(function (prev, cur) {
        return prev + cur.value;
    }, 0);

    localStorage.setItem("provisionedValue", provisionedValue);

    let balanceColor = provisionedValue < 0? "fas fa-balance-scale red fa-2x":"fas fa-balance-scale success fa-2x"


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

    let cardSize = "310px"


    return (
        <div className="containerWallet">
            <div id="linha">
                <i onClick={() => selectNewMonth("left")} style={{cursor: 'pointer', color: '#B3B8D4'}} class={"fas fa-chevron-left"}></i> 
                <div style={{minWidth: '250px', display: 'flex', justifyContent: 'center'}}>{monthByNumber(month)} - {year}</div>
                <i style={{cursor: 'pointer', color: '#B3B8D4'}} onClick={() => selectNewMonth("right")} class={"fas fa-chevron-right"}></i>
            </div>
            <div className="walletCards">
                <CustomCardSize
                    title="Entradas"
                    children={decimalAdjust(valueTotal)}
                    icon="fas fa-hand-holding-usd success fa-1x"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saídas"
                    children={decimalAdjust(sumAll)}
                    icon="fas fa-hand-holding-usd red fa-2x"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Saldo Atual"
                    children={decimalAdjust(provisionedValue)}
                    icon={balanceColor}
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor pago"
                    children={decimalAdjust(paidValue)}
                    icon="fas fa-check success fa-2x"
                    size={cardSize}
                >
                </CustomCardSize>
                <CustomCardSize
                    title="Valor a pagar"
                    children={decimalAdjust(sumAll - paidValue)}
                    icon="fas fa-times red fa-2x"
                    size={cardSize}
                    className="toPay"
                >
                </CustomCardSize>

            </div>
        </div>
    )
}
